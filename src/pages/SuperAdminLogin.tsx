import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, CheckCircle2, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import loginSuperAdminImg from "@/assets/login-superadmin.jpg";
import { supabase } from "@/integrations/supabase/client";
import { manageAccount } from "@/lib/account-management";

const superAdminLoginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(128),
});

type SuperAdminLoginValues = z.infer<typeof superAdminLoginSchema>;

const SuperAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bootstrapAvailable, setBootstrapAvailable] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [setupName, setSetupName] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    void manageAccount<{ available: boolean }>({ action: "bootstrap-status" })
      .then((result) => { if (active) setBootstrapAvailable(result.available); })
      .catch(() => { if (active) setBootstrapAvailable(false); });
    return () => { active = false; };
  }, []);

  const form = useForm<SuperAdminLoginValues>({
    resolver: zodResolver(superAdminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SuperAdminLoginValues) => {
    setIsLoading(true);
    try {
      if (setupMode) {
        if (setupName.trim().length < 2) throw new Error("Saisissez votre nom complet.");
        const { data: signup, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { full_name: setupName.trim() },
            emailRedirectTo: `${window.location.origin}/login/super-admin`,
          },
        });
        if (error) throw new Error(error.message);
        if (signup.session) {
          await manageAccount({ action: "bootstrap-super-admin", fullName: setupName.trim() });
          toast({ title: "Compte propriétaire créé", description: "Vous pouvez maintenant accéder à l’administration." });
          navigate("/super-admin");
          return;
        }
        setConfirmationSent(true);
        toast({ title: "Vérifiez votre boîte mail", description: "Confirmez votre adresse avant de créer le compte propriétaire." });
        return;
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
      if (error || !authData.user) throw new Error("Email ou mot de passe incorrect.");
      const { data: roles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", authData.user.id);
      if (rolesError) throw new Error("Impossible de vérifier les droits de ce compte.");
      const isSuperAdmin = roles?.some((role) => role.role === "super_admin") ?? false;
      if (!isSuperAdmin && bootstrapAvailable) {
        const fullName = String(authData.user.user_metadata?.full_name ?? setupName).trim();
        try {
          await manageAccount({ action: "bootstrap-super-admin", fullName: fullName || data.email.split("@")[0] });
          toast({ title: "Compte propriétaire créé", description: "Bienvenue dans EduLedger." });
          navigate("/super-admin");
          return;
        } catch {
          await supabase.auth.signOut();
          throw new Error("Cette adresse ne peut pas terminer la configuration du compte propriétaire.");
        }
      }
      const { data: profile } = await supabase.from("profiles").select("status").eq("id", authData.user.id).maybeSingle();
      if (!isSuperAdmin || !profile || profile.status !== "active") {
        await supabase.auth.signOut();
        throw new Error("Ce compte n’a pas accès à l’espace Super Admin.");
      }
      toast({ title: "Connexion réussie", description: "Bienvenue, Super Admin." });
      navigate("/super-admin");
    } catch (error) {
      toast({ title: "Connexion impossible", description: error instanceof Error ? error.message : "Vérifiez vos identifiants.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — image + texte marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginSuperAdminImg}
          alt="Centre de contrôle Super Administration EduLedger"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/90" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground w-full"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">EduLedger</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold mb-6">
              <ShieldCheck className="h-3.5 w-3.5" />
              Accès Super Administration
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Le contrôle total,<br />à votre portée.
            </h2>
            <p className="text-primary-foreground/85 text-lg leading-relaxed max-w-md mb-8">
              Supervisez l'écosystème EduLedger : universités, administrateurs, audit logs et configurations globales depuis une console unique.
            </p>
            <ul className="space-y-3">
              {[
                "Gestion multi-universités centralisée",
                "Audit logs et traçabilité complète",
                "Sécurité et permissions granulaires",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-primary-foreground/70">
            « La connaissance est le pouvoir. » — Francis Bacon
          </p>
        </motion.div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 lg:hidden">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{setupMode ? "Créer le compte propriétaire" : "Connexion Super Admin"}</h1>
            <p className="text-muted-foreground">{setupMode ? "Créez le premier accès sécurisé à EduLedger." : "Accédez au panneau de contrôle principal"}</p>
          </div>

          {setupMode && (
            <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
              {confirmationSent ? "Un lien de confirmation vous a été envoyé. Après confirmation, revenez ici et connectez-vous pour terminer." : "La création est limitée à l’adresse propriétaire autorisée et nécessite une confirmation par email."}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {setupMode && (
                <div className="space-y-2">
                  <Label htmlFor="owner-name">Nom complet</Label>
                  <Input id="owner-name" value={setupName} onChange={(event) => setSetupName(event.target.value)} placeholder="Isaac Tshama" autoComplete="name" />
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="superadmin@eduledger.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>

          {bootstrapAvailable && (
            <div className="mt-5 text-center">
              <Button variant="link" onClick={() => { setSetupMode(!setupMode); setConfirmationSent(false); }}>
                {setupMode ? "Retour à la connexion" : "Créer le premier compte propriétaire"}
              </Button>
            </div>
          )}

          <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} type="email" />

          <p className="text-center text-sm text-muted-foreground mt-8">
            Vous êtes administrateur ?{" "}
            <Link to="/login/admin" className="text-primary font-medium hover:underline">
              Accéder à l'espace admin
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
