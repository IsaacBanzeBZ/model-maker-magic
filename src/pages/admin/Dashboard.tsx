import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, FileSpreadsheet, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Étudiants", value: "1,248", icon: Users, change: "+12%", color: "text-primary" },
  { label: "Promotions", value: "18", icon: GraduationCap, change: "+2", color: "text-accent-foreground" },
  { label: "Matières", value: "64", icon: BookOpen, change: "+5", color: "text-primary" },
  { label: "Imports", value: "32", icon: FileSpreadsheet, change: "Ce mois", color: "text-muted-foreground" },
];

const quickActions = [
  { title: "Gérer les étudiants", description: "Ajouter, modifier ou rechercher des étudiants", icon: Users, url: "/admin/students" },
  { title: "Gérer les promotions", description: "Créer et organiser les promotions", icon: GraduationCap, url: "/admin/promotions" },
  { title: "Importer des notes", description: "Importer un fichier Excel de notes", icon: FileSpreadsheet, url: "/admin/import" },
  { title: "Publier les résultats", description: "Consulter et publier les résultats", icon: BookOpen, url: "/admin/results" },
  { title: "Années académiques", description: "Gérer les années académiques", icon: Calendar, url: "/admin/academic-years" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de votre université</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span>{s.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Accès rapide</h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {quickActions.map((a) => (
            <motion.div key={a.title} variants={item}>
              <Card
                className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
                onClick={() => navigate(a.url)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <a.icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base">{a.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{a.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
