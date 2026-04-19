import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { GraduationCap, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import loginStudentImg from "@/assets/login-student.jpg";

const studentLoginSchema = z.object({
  matricule: z.string().trim().min(3, "Le matricule est requis").max(50, "Matricule trop long"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(128),
});

type StudentLoginValues = z.infer<typeof studentLoginSchema>;

const StudentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<StudentLoginValues>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { matricule: "", password: "" },
  });

  const onSubmit = async (data: StudentLoginValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Connexion réussie", description: `Bienvenue, ${data.matricule}` });
      navigate("/student");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — image + texte marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={loginStudentImg}
          alt="Étudiante africaine fière sur son campus"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-accent/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

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
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Votre réussite,<br />notre mission.
            </h2>
            <p className="text-primary-foreground/85 text-lg leading-relaxed max-w-md mb-8">
              Consultez vos résultats en temps réel, suivez votre progression et célébrez chaque étape de votre parcours académique.
            </p>
            <ul className="space-y-3">
              {[
                "Résultats disponibles 24h/24",
                "Historique complet par année",
                "Téléchargement de bulletins PDF",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-primary-foreground/90">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-primary-foreground/70">
            « L'éducation est l'arme la plus puissante pour changer le monde. »
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Connexion Étudiant</h1>
            <p className="text-muted-foreground">Accédez à vos résultats avec votre matricule</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="matricule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="EL-2025-001" className="pl-10" {...field} />
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

              <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>

          <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} type="matricule" />

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

export default StudentLogin;
