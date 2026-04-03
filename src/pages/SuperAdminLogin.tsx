import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const superAdminLoginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide").max(255),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(128),
});

type SuperAdminLoginValues = z.infer<typeof superAdminLoginSchema>;

const DEFAULT_EMAIL = "superadmin@eduledger.com";
const DEFAULT_PASSWORD = "superadmin123";

const SuperAdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<SuperAdminLoginValues>({
    resolver: zodResolver(superAdminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SuperAdminLoginValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (data.email === DEFAULT_EMAIL && data.password === DEFAULT_PASSWORD) {
        toast({ title: "Connexion réussie", description: "Bienvenue, Super Admin" });
        navigate("/super-admin");
      } else {
        toast({ title: "Erreur", description: "Email ou mot de passe incorrect", variant: "destructive" });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary opacity-90" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsl(var(--accent) / 0.15) 0%, transparent 50%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Super Administration
          </h2>
          <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md">
            Accès réservé au Super Admin. Gérez les universités, les administrateurs et la plateforme entière.
          </p>
        </motion.div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Connexion Super Admin</h1>
            <p className="text-muted-foreground">Accédez au panneau de contrôle principal</p>
          </div>

          {/* Default credentials hint */}
          <div className="mb-6 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Identifiants par défaut :</p>
            <p>Email : <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{DEFAULT_EMAIL}</code></p>
            <p>Mot de passe : <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{DEFAULT_PASSWORD}</code></p>
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

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>

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
