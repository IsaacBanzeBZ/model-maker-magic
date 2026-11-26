import { createClient, type User } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.25.76";
import { canManageAccount, type AccountScope, type EduLedgerRole } from "../_shared/account-permissions.ts";

const nameSchema = z.string().trim().min(2).max(160);
const emailSchema = z.string().trim().email().max(254);
const passwordSchema = z.string().min(10).max(128);
const optionalText = (max: number) => z.string().trim().max(max).optional().nullable();

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("bootstrap-status") }),
  z.object({ action: z.literal("bootstrap-super-admin"), fullName: nameSchema }),
  z.object({ action: z.literal("create-university"), name: nameSchema, code: z.string().trim().min(2).max(20), contactEmail: emailSchema, phone: optionalText(40), address: optionalText(300) }),
  z.object({ action: z.literal("update-university"), universityId: z.string().uuid(), name: nameSchema, code: z.string().trim().min(2).max(20), contactEmail: emailSchema, phone: optionalText(40), address: optionalText(300) }),
  z.object({ action: z.literal("set-university-active"), universityId: z.string().uuid(), active: z.boolean() }),
  z.object({ action: z.literal("archive-university"), universityId: z.string().uuid() }),
  z.object({ action: z.literal("create-admin"), universityId: z.string().uuid(), fullName: nameSchema, email: emailSchema, phone: optionalText(40) }),
  z.object({ action: z.literal("create-promotion"), universityId: z.string().uuid().optional(), name: z.string().trim().min(1).max(80) }),
  z.object({ action: z.literal("create-student"), universityId: z.string().uuid().optional(), promotionId: z.string().uuid(), fullName: nameSchema, email: emailSchema, phone: optionalText(40) }),
  z.object({ action: z.literal("update-user"), userId: z.string().uuid(), fullName: nameSchema, email: emailSchema, phone: optionalText(40) }),
  z.object({ action: z.literal("set-user-status"), userId: z.string().uuid(), status: z.enum(["active", "inactive", "banned"]) }),
  z.object({ action: z.literal("reset-password"), userId: z.string().uuid(), password: passwordSchema }),
  z.object({ action: z.literal("change-my-password"), password: passwordSchema }),
  z.object({ action: z.literal("sync-my-email") }),
  z.object({ action: z.literal("student-login"), matricule: z.string().trim().min(3).max(50), password: z.string().min(1).max(128) }),
]);

type ManagementRequest = z.infer<typeof requestSchema>;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

class RequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const fail = (message: string, status = 400): never => {
  throw new RequestError(message, status);
};

const backendUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

if (!backendUrl || !serviceKey) {
  throw new Error("Server configuration is incomplete");
}

const service = createClient(backendUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const getSignedInUser = async (request: Request): Promise<User> => {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) fail("Connexion requise.", 401);
  const { data, error } = await service.auth.getUser(token);
  if (error || !data.user) fail("Connexion invalide ou expirée.", 401);
  return data.user;
};

interface Actor extends AccountScope {
  id: string;
  email: string;
}

const getActor = async (request: Request): Promise<Actor> => {
  const user = await getSignedInUser(request);
  const [{ data: profile, error: profileError }, { data: roles, error: rolesError }] = await Promise.all([
    service.from("profiles").select("id, email, status").eq("id", user.id).maybeSingle(),
    service.from("user_roles").select("role, university_id").eq("user_id", user.id),
  ]);
  if (profileError || rolesError) fail("Impossible de vérifier les droits du compte.", 500);
  if (!profile || profile.status !== "active") fail("Ce compte est désactivé.", 403);

  const roleRow = roles?.find((item) => item.role === "super_admin") ?? roles?.find((item) => item.role === "university_admin") ?? roles?.find((item) => item.role === "student");
  if (!roleRow) fail("Ce compte n’a aucun rôle EduLedger.", 403);
  if (roleRow.role !== "super_admin") {
    const { data: university, error } = await service
      .from("universities")
      .select("is_active, deleted_at")
      .eq("id", roleRow.university_id)
      .maybeSingle();
    if (error || !university || !university.is_active || university.deleted_at) {
      fail("L’accès à cette université est suspendu.", 403);
    }
  }

  return {
    id: user.id,
    email: profile.email,
    role: roleRow.role as EduLedgerRole,
    universityId: roleRow.university_id,
  };
};

const requireSuperAdmin = (actor: Actor) => {
  if (actor.role !== "super_admin") fail("Cette action est réservée au Super Admin.", 403);
};

const recordAudit = async (
  actor: Actor,
  action: string,
  targetType: string,
  universityId: string | null,
  targetUserId: string | null = null,
  details: Record<string, unknown> = {},
) => {
  const { error } = await service.from("audit_logs").insert({
    actor_user_id: actor.id,
    target_user_id: targetUserId,
    university_id: universityId,
    action,
    target_type: targetType,
    details,
  });
  if (error) throw new Error("L’action a été réalisée, mais son journal n’a pas pu être enregistré.");
};

const ensureUniversityActive = async (universityId: string) => {
  const { data, error } = await service
    .from("universities")
    .select("id, code, is_active, deleted_at")
    .eq("id", universityId)
    .maybeSingle();
  if (error) fail("Impossible de vérifier l’université.", 500);
  if (!data || !data.is_active || data.deleted_at) fail("L’université est introuvable ou désactivée.", 404);
  return data;
};

const getTargetScope = async (userId: string): Promise<AccountScope> => {
  const { data, error } = await service
    .from("user_roles")
    .select("role, university_id")
    .eq("user_id", userId);
  if (error) fail("Impossible de vérifier le compte ciblé.", 500);
  if (data?.some((item) => item.role === "super_admin")) fail("Le compte propriétaire ne peut pas être modifié depuis cette action.", 403);
  const target = data?.find((item) => item.role !== "super_admin");
  if (!target) fail("Le compte est introuvable ou ne peut pas être modifié.", 404);
  return { role: target.role as EduLedgerRole, universityId: target.university_id };
};

const ensureCanManage = (actor: Actor, target: AccountScope) => {
  if (!canManageAccount(actor, target)) fail("Vous ne pouvez pas gérer ce compte.", 403);
};

const createAuthAccount = async (input: {
  fullName: string;
  email: string;
  phone?: string | null;
  universityId: string;
}) => {
  const { data, error } = await service.auth.admin.inviteUserByEmail(input.email, {
    data: { full_name: input.fullName },
  });
  if (error || !data.user) {
    fail(error?.message.toLowerCase().includes("already") ? "Cette adresse email est déjà utilisée." : "L’invitation du compte a échoué.", 409);
  }
  const userId = data.user.id;
  try {
    const { error: profileError } = await service.from("profiles").insert({
      id: userId,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone ?? null,
      university_id: input.universityId,
      status: "active",
      must_change_password: true,
    });
    if (profileError) throw profileError;
    const { error: roleError } = await service.from("user_roles").insert({
      user_id: userId,
      role: "university_admin",
      university_id: input.universityId,
    });
    if (roleError) throw roleError;
  } catch {
    await service.auth.admin.deleteUser(userId);
    fail("Le compte n’a pas pu être enregistré complètement.", 500);
  }
  return userId;
};

const createStudentAccount = async (actor: Actor, request: Extract<ManagementRequest, { action: "create-student" }>) => {
  if (actor.role !== "super_admin" && actor.role !== "university_admin") fail("Action non autorisée.", 403);
  const universityId = actor.role === "university_admin" ? actor.universityId : request.universityId;
  if (!universityId) fail("Choisissez une université.");
  await ensureUniversityActive(universityId);
  const { data: promotion, error: promotionError } = await service
    .from("promotions")
    .select("id")
    .eq("id", request.promotionId)
    .eq("university_id", universityId)
    .eq("is_active", true)
    .maybeSingle();
  if (promotionError || !promotion) fail("La promotion sélectionnée n’appartient pas à cette université.");

  let matricule = "";
  let uniqueMatricule = false;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    matricule = `ETU-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { data: existing } = await service.from("students").select("id").eq("matricule", matricule).maybeSingle();
    if (!existing) {
      uniqueMatricule = true;
      break;
    }
  }
  if (!uniqueMatricule) fail("Un matricule unique n’a pas pu être généré. Réessayez.", 500);

  const { data: invited, error: inviteError } = await service.auth.admin.inviteUserByEmail(request.email, {
    data: { full_name: request.fullName },
  });
  if (inviteError || !invited.user) {
    fail(inviteError?.message.toLowerCase().includes("already") ? "Cette adresse email est déjà utilisée." : "L’invitation du compte a échoué.", 409);
  }
  const userId = invited.user.id;
  try {
    const { error: profileError } = await service.from("profiles").insert({
      id: userId,
      full_name: request.fullName,
      email: request.email,
      phone: request.phone ?? null,
      university_id: universityId,
      status: "active",
      must_change_password: true,
    });
    if (profileError) throw profileError;
    const { error: roleError } = await service.from("user_roles").insert({
      user_id: userId,
      role: "student",
      university_id: universityId,
    });
    if (roleError) throw roleError;
    const { error: studentError } = await service.from("students").insert({
      user_id: userId,
      university_id: universityId,
      promotion_id: request.promotionId,
      matricule,
    });
    if (studentError) throw studentError;
  } catch {
    await service.auth.admin.deleteUser(userId);
    fail("Le compte étudiant n’a pas pu être enregistré complètement.", 500);
  }
  await recordAudit(actor, "student.created", "student", universityId, userId, { matricule });
  return { userId, matricule };
};

const handleStudentLogin = async (request: Extract<ManagementRequest, { action: "student-login" }>) => {
  if (!publishableKey) fail("La connexion étudiant n’est pas configurée.", 500);
  const { data: student, error: studentError } = await service
    .from("students")
    .select("user_id, university_id")
    .eq("matricule", request.matricule)
    .maybeSingle();
  if (studentError || !student) fail("Matricule ou mot de passe incorrect.", 401);
  const [{ data: profile }, { data: role }, { data: university }, authAccount] = await Promise.all([
    service.from("profiles").select("status").eq("id", student.user_id).maybeSingle(),
    service.from("user_roles").select("role").eq("user_id", student.user_id).eq("role", "student").maybeSingle(),
    service.from("universities").select("is_active, deleted_at").eq("id", student.university_id).maybeSingle(),
    service.auth.admin.getUserById(student.user_id),
  ]);
  const email = authAccount.data.user?.email;
  if (!profile || !role || profile.status !== "active" || !university?.is_active || university.deleted_at || authAccount.error || !email) {
    fail("Matricule ou mot de passe incorrect.", 401);
  }
  const publicClient = createClient(backendUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await publicClient.auth.signInWithPassword({ email, password: request.password });
  if (error || !data.session) fail("Matricule ou mot de passe incorrect.", 401);
  return { session: data.session };
};

const handleManagementRequest = async (request: Request, body: ManagementRequest) => {
  if (body.action === "student-login") return await handleStudentLogin(body);
  if (body.action === "bootstrap-status") {
    const { count, error } = await service
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin");
    if (error) fail("Impossible de vérifier la configuration initiale.", 500);
    return { available: (count ?? 0) === 0 };
  }

  const user = await getSignedInUser(request);
  if (body.action === "bootstrap-super-admin") {
    const expectedEmail = Deno.env.get("BOOTSTRAP_SUPER_ADMIN_EMAIL")?.trim().toLowerCase();
    if (!expectedEmail) fail("La configuration du premier compte Super Admin est incomplète.", 503);
    if (!user.email || user.email.toLowerCase() !== expectedEmail || !user.email_confirmed_at) {
      fail("Confirmez l’adresse propriétaire avant de terminer la configuration.", 403);
    }
    const { count, error: countError } = await service
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin");
    if (countError) fail("Impossible de vérifier la configuration initiale.", 500);
    if ((count ?? 0) > 0) fail("Le compte propriétaire est déjà configuré.", 409);

    const { error: profileError } = await service.from("profiles").upsert({
      id: user.id,
      full_name: body.fullName,
      email: expectedEmail,
      status: "active",
      must_change_password: false,
    });
    if (profileError) fail("Le profil propriétaire n’a pas pu être créé.", 500);
    const { error: roleError } = await service.from("user_roles").insert({ user_id: user.id, role: "super_admin", university_id: null });
    if (roleError) fail("Le rôle propriétaire n’a pas pu être attribué.", 500);
    await service.from("audit_logs").insert({
      actor_user_id: user.id,
      action: "super_admin.bootstrap",
      target_type: "super_admin",
      details: { email: expectedEmail },
    });
    return { role: "super_admin" };
  }

  const actor = await getActor(request);
  switch (body.action) {
    case "create-university": {
      requireSuperAdmin(actor);
      const { data, error } = await service.from("universities").insert({
        name: body.name,
        code: body.code.toUpperCase(),
        contact_email: body.contactEmail,
        phone: body.phone ?? null,
        address: body.address ?? null,
      }).select("id").single();
      if (error || !data) fail(error?.code === "23505" ? "Ce code d’université existe déjà." : "L’université n’a pas pu être créée.", 400);
      await recordAudit(actor, "university.created", "university", data.id, null, { code: body.code.toUpperCase() });
      return { universityId: data.id };
    }
    case "update-university": {
      requireSuperAdmin(actor);
      const { error } = await service.from("universities").update({
        name: body.name,
        code: body.code.toUpperCase(),
        contact_email: body.contactEmail,
        phone: body.phone ?? null,
        address: body.address ?? null,
        updated_at: new Date().toISOString(),
      }).eq("id", body.universityId);
      if (error) fail(error.code === "23505" ? "Ce code d’université existe déjà." : "La modification de l’université a échoué.", 400);
      await recordAudit(actor, "university.updated", "university", body.universityId);
      return { success: true };
    }
    case "set-university-active": {
      requireSuperAdmin(actor);
      const updates = body.active
        ? { is_active: true, deleted_at: null, updated_at: new Date().toISOString() }
        : { is_active: false, updated_at: new Date().toISOString() };
      const { error } = await service.from("universities").update(updates).eq("id", body.universityId);
      if (error) fail("Le statut de l’université n’a pas pu être modifié.", 400);
      await recordAudit(actor, body.active ? "university.activated" : "university.deactivated", "university", body.universityId);
      return { success: true };
    }
    case "archive-university": {
      requireSuperAdmin(actor);
      const { error } = await service.from("universities").update({ is_active: false, deleted_at: new Date().toISOString() }).eq("id", body.universityId);
      if (error) fail("L’université n’a pas pu être archivée.", 400);
      await recordAudit(actor, "university.archived", "university", body.universityId);
      return { success: true };
    }
    case "create-admin": {
      requireSuperAdmin(actor);
      await ensureUniversityActive(body.universityId);
      const userId = await createAuthAccount({
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        role: "university_admin",
        universityId: body.universityId,
      });
      await recordAudit(actor, "university_admin.created", "university_admin", body.universityId, userId);
      return { userId };
    }
    case "create-promotion": {
      if (actor.role !== "super_admin" && actor.role !== "university_admin") fail("Action non autorisée.", 403);
      const universityId = actor.role === "university_admin" ? actor.universityId : body.universityId;
      if (!universityId) fail("Choisissez une université.");
      await ensureUniversityActive(universityId);
      const { data, error } = await service
        .from("promotions")
        .insert({ university_id: universityId, name: body.name })
        .select("id")
        .single();
      if (error || !data) fail(error?.code === "23505" ? "Cette promotion existe déjà dans cette université." : "La promotion n’a pas pu être créée.", 400);
      await recordAudit(actor, "promotion.created", "promotion", universityId, null, { promotionId: data.id, name: body.name });
      return { promotionId: data.id };
    }
    case "create-student":
      return await createStudentAccount(actor, body);
    case "update-user": {
      const target = await getTargetScope(body.userId);
      ensureCanManage(actor, target);
      const { data: current, error: currentError } = await service.from("profiles").select("email, university_id").eq("id", body.userId).maybeSingle();
      if (currentError || !current) fail("Le compte est introuvable.", 404);
      const emailChanged = body.email.toLowerCase() !== current.email.toLowerCase();
      if (emailChanged) {
        if (actor.role !== "super_admin") fail("Seul le Super Admin peut modifier l’adresse de connexion.", 403);
        const { error } = await service.auth.admin.updateUserById(body.userId, { email: body.email });
        if (error) fail("La vérification de la nouvelle adresse email n’a pas pu être lancée.", 400);
      }
      const { error } = await service.from("profiles").update({
        full_name: body.fullName,
        phone: body.phone ?? null,
        updated_at: new Date().toISOString(),
      }).eq("id", body.userId);
      if (error) fail("Les informations du compte n’ont pas pu être enregistrées.", 400);
      await recordAudit(actor, "account.updated", target.role, target.universityId, body.userId, { emailChanged });
      return { success: true, emailVerificationRequired: emailChanged };
    }
    case "set-user-status": {
      const target = await getTargetScope(body.userId);
      ensureCanManage(actor, target);
      const { error } = await service.from("profiles").update({ status: body.status, updated_at: new Date().toISOString() }).eq("id", body.userId);
      if (error) fail("Le statut du compte n’a pas pu être modifié.", 400);
      await recordAudit(actor, `account.${body.status}`, target.role, target.universityId, body.userId);
      return { success: true };
    }
    case "reset-password": {
      const target = await getTargetScope(body.userId);
      ensureCanManage(actor, target);
      const { error: authError } = await service.auth.admin.updateUserById(body.userId, { password: body.password });
      if (authError) fail("Le mot de passe n’a pas pu être réinitialisé.", 400);
      const { error } = await service.from("profiles").update({ must_change_password: true, updated_at: new Date().toISOString() }).eq("id", body.userId);
      if (error) fail("Le mot de passe a été modifié, mais l’état de première connexion n’a pas pu être enregistré.", 500);
      await recordAudit(actor, "account.password_reset", target.role, target.universityId, body.userId);
      return { success: true };
    }
    case "change-my-password": {
      const { error: authError } = await service.auth.admin.updateUserById(user.id, { password: body.password });
      if (authError) fail("Le mot de passe n’a pas pu être modifié.", 400);
      const { error } = await service.from("profiles").update({ must_change_password: false, updated_at: new Date().toISOString() }).eq("id", user.id);
      if (error) fail("Le mot de passe a été modifié, mais le profil n’a pas pu être mis à jour.", 500);
      await recordAudit(actor, "account.password_changed", actor.role, actor.universityId, user.id);
      return { success: true };
    }
    case "sync-my-email": {
      if (!user.email || !user.email_confirmed_at) return { synced: false, emailConfirmationPending: true };
      const { error } = await service.from("profiles").update({ email: user.email, updated_at: new Date().toISOString() }).eq("id", user.id);
      if (error) fail("L’adresse email confirmée n’a pas pu être synchronisée.", 500);
      return { synced: true };
    }
    default:
      return fail("Action non prise en charge.", 400);
  }
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Données invalides." }, 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Vérifiez les informations saisies." }, 400);

  try {
    const result = await handleManagementRequest(request, parsed.data);
    return json(result);
  } catch (error) {
    if (error instanceof RequestError) return json({ error: error.message }, error.status);
    console.error("Account management request failed");
    return json({ error: error instanceof Error ? error.message : "Une erreur inattendue est survenue." }, 500);
  }
});