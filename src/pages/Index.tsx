import { motion } from "framer-motion";
import { GraduationCap, Upload, Shield, BarChart3, Users, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Upload,
    title: "Import Excel intelligent",
    description: "Importez étudiants et notes en un clic. Création automatique des profils et génération des matricules.",
  },
  {
    icon: BarChart3,
    title: "Publication en temps réel",
    description: "Publiez les résultats instantanément. Les étudiants consultent leurs notes depuis leur dashboard.",
  },
  {
    icon: Building2,
    title: "Multi-universités",
    description: "Une seule plateforme pour plusieurs universités. Données isolées et sécurisées par institution.",
  },
  {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Authentification sécurisée, accès par rôle, isolation des données et chiffrement des mots de passe.",
  },
  {
    icon: Users,
    title: "Gestion des rôles",
    description: "Super Admin, Admin université et Étudiant. Chaque rôle a des permissions adaptées.",
  },
  {
    icon: GraduationCap,
    title: "Historique complet",
    description: "Conservez l'historique par année académique. Gérez les redoublants sans perte de données.",
  },
];

const stats = [
  { value: "100%", label: "Digital" },
  { value: "3", label: "Rôles" },
  { value: "∞", label: "Universités" },
  { value: "24/7", label: "Accès" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduLedger</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Fonctionnalités</a>
            <a href="#how" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Comment ça marche</a>
            <a href="#stats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Chiffres</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login/student">Espace étudiant</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/login/admin">Espace admin <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Plateforme SaaS académique
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Digitalisez la gestion de vos{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                résultats académiques
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              EduLedger centralise la gestion des notes, des étudiants et des promotions
              pour les universités. Import Excel, publication instantanée, accès sécurisé.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base font-semibold">
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Voir la démo
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 sm:p-12">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="rounded-xl border border-border bg-card p-6 text-center"
                    >
                      <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
                      <div className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Tout ce dont votre université a besoin
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Une plateforme complète pour gérer les résultats académiques de A à Z.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Comment ça marche ?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              En 3 étapes simples, digitalisez votre gestion académique.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              { step: "01", title: "Créez votre université", desc: "Inscrivez votre institution et configurez les années académiques et les promotions." },
              { step: "02", title: "Importez via Excel", desc: "Téléversez votre fichier Excel. Les étudiants et notes sont créés automatiquement." },
              { step: "03", title: "Publiez les résultats", desc: "Les étudiants accèdent à leurs résultats en temps réel depuis leur dashboard." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-12 text-center text-primary-foreground sm:p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Prêt à moderniser votre gestion académique ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Rejoignez les universités qui font confiance à EduLedger pour gérer
                et publier leurs résultats académiques en toute sécurité.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" variant="secondary" className="h-12 bg-card text-foreground hover:bg-card/90 px-8 text-base font-semibold">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/70">
                {["Aucune carte requise", "Configuration en 5 min", "Support dédié"].map((text) => (
                  <span key={text} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">EduLedger</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduLedger. Plateforme de gestion des résultats académiques.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
