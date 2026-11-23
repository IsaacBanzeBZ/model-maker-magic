CREATE TYPE public.app_role AS ENUM ('super_admin', 'university_admin', 'student');

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  role_exists BOOLEAN;
BEGIN
  IF _user_id IS DISTINCT FROM auth.uid() AND auth.role() IS DISTINCT FROM 'service_role' THEN
    RETURN FALSE;
  END IF;
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.user_id
    LEFT JOIN public.universities u ON u.id = ur.university_id
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND p.status = 'active'
      AND (_role = 'super_admin' OR (u.is_active AND u.deleted_at IS NULL))
  ) INTO role_exists;
  RETURN role_exists;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_user_university_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  university_uuid UUID;
BEGIN
  SELECT ur.university_id INTO university_uuid
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid()
    AND ur.role IN ('university_admin', 'student')
  LIMIT 1;
  RETURN university_uuid;
END;
$$;

CREATE TABLE public.universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  contact_email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.universities TO authenticated;
GRANT ALL ON public.universities TO service_role;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins view all universities" ON public.universities FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "University admins view their university" ON public.universities FOR SELECT TO authenticated USING (id = public.current_user_university_id() AND public.has_role(auth.uid(), 'university_admin'));

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university_id UUID REFERENCES public.universities(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
  must_change_password BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Super admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "University admins view profiles in their university" ON public.profiles FOR SELECT TO authenticated USING (university_id = public.current_user_university_id() AND public.has_role(auth.uid(), 'university_admin'));

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  university_id UUID REFERENCES public.universities(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role),
  CONSTRAINT user_roles_university_scope CHECK ((role = 'super_admin' AND university_id IS NULL) OR (role <> 'super_admin' AND university_id IS NOT NULL))
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Super admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "University admins read roles in their university" ON public.user_roles FOR SELECT TO authenticated USING (university_id = public.current_user_university_id() AND public.has_role(auth.uid(), 'university_admin'));

CREATE TABLE public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES public.universities(id),
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (university_id, name)
);
GRANT SELECT ON public.promotions TO authenticated;
GRANT ALL ON public.promotions TO service_role;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins read promotions" ON public.promotions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "University admins read promotions in their university" ON public.promotions FOR SELECT TO authenticated USING (university_id = public.current_user_university_id() AND public.has_role(auth.uid(), 'university_admin'));

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id),
  university_id UUID NOT NULL REFERENCES public.universities(id),
  promotion_id UUID NOT NULL REFERENCES public.promotions(id),
  matricule TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view their own record" ON public.students FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Super admins view all students" ON public.students FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "University admins view students in their university" ON public.students FOR SELECT TO authenticated USING (university_id = public.current_user_university_id() AND public.has_role(auth.uid(), 'university_admin'));
CREATE POLICY "Students read their promotion" ON public.promotions FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.students s WHERE s.promotion_id = promotions.id AND s.user_id = auth.uid()));

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  target_user_id UUID,
  university_id UUID REFERENCES public.universities(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins read all audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "University admins read audit logs in their university" ON public.audit_logs FOR SELECT TO authenticated USING (university_id = public.current_user_university_id() AND public.has_role(auth.uid(), 'university_admin'));

CREATE INDEX user_roles_user_role_idx ON public.user_roles (user_id, role);
CREATE INDEX user_roles_university_idx ON public.user_roles (university_id);
CREATE INDEX profiles_university_status_idx ON public.profiles (university_id, status);
CREATE INDEX students_university_promotion_idx ON public.students (university_id, promotion_id);
CREATE INDEX audit_logs_university_created_idx ON public.audit_logs (university_id, created_at DESC);

REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.current_user_university_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_user_university_id() TO authenticated, service_role;
GRANT USAGE ON TYPE public.app_role TO authenticated, service_role;
