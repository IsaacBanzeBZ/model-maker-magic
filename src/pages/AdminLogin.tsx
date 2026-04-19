import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Building2, Lock, Mail, Eye, EyeOff, ArrowLeft, CheckCircle2, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import loginAdminImg from "@/assets/login-admin.jpg";

const adminLoginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(128),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: AdminLoginValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Connexion réussie", description: `Bienvenue, ${data.email}` });
      navigate("/admin");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — image + texte marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginAdminImg}
          alt="Administratrice universitaire dans son bureau"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-primary/85" />

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
              <Building2 className="h-3.5 w-3.5" />
              Espace Administration
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Pilotez votre université<br />en toute sérénité.
            </h2>
            <p className="text-primary-foreground/85 text-lg leading-relaxed max-w-md mb-8">
              Importez, gérez et publiez les résultats de vos étudiants depuis un tableau de bord pensé pour les professionnels de l'éducation.
            </p>
            <ul className="space-y-3">
              {[
                "Import Excel intelligent en un clic",
                "Publication instantanée des notes",
                "Gestion multi-promotions illimitée",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-primary-foreground/70">
            « Former l'esprit sans former le cœur n'est pas former du tout. » — Aristote
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Connexion Admin</h1>
            <p className="text-muted-foreground">Connectez-vous à votre espace d'administration</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="admin@universite.cd" className="pl-10" {...field} />
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

          <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} type="email" />

          <p className="text-center text-sm text-muted-foreground mt-8">
            Vous êtes étudiant ?{" "}
            <Link to="/login/student" className="text-primary font-medium hover:underline">
              Accéder à l'espace étudiant
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
