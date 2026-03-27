import { motion } from "framer-motion";
import { TrendingUp, Award, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const semesterData = [
  {
    name: "Semestre 1",
    average: 14.8,
    credits: 28,
    totalCredits: 30,
    subjects: [
      { name: "Algorithmique", avg: 16, status: "Validé" },
      { name: "Base de données", avg: 14, status: "Validé" },
      { name: "Mathématiques", avg: 15, status: "Validé" },
      { name: "Anglais", avg: 17, status: "Validé" },
    ],
  },
  {
    name: "Semestre 2",
    average: 12.5,
    credits: 14,
    totalCredits: 30,
    subjects: [
      { name: "Réseaux", avg: 12, status: "Validé" },
      { name: "Systèmes d'exploitation", avg: 13, status: "Validé" },
      { name: "Génie logiciel", avg: 12, status: "Validé" },
      { name: "Physique appliquée", avg: 9.5, status: "Échec" },
    ],
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function StudentPerformance() {
  const totalAvg = (semesterData.reduce((s, sem) => s + sem.average, 0) / semesterData.length).toFixed(1);
  const totalCredits = semesterData.reduce((s, sem) => s + sem.credits, 0);
  const maxCredits = semesterData.reduce((s, sem) => s + sem.totalCredits, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Ma performance</h1>
        <p className="text-muted-foreground text-sm mt-1">Suivi de votre progression académique</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moyenne générale</p>
                <p className="text-2xl font-bold text-foreground">{totalAvg}/20</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crédits validés</p>
                <p className="text-2xl font-bold text-foreground">{totalCredits}/{maxCredits}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut global</p>
                <Badge className="mt-1 bg-accent text-accent-foreground">Admis</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="space-y-6">
        {semesterData.map((sem, i) => (
          <motion.div key={sem.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{sem.name}</CardTitle>
                    <CardDescription>Moyenne : {sem.average}/20 — {sem.credits}/{sem.totalCredits} crédits</CardDescription>
                  </div>
                  <Badge variant={sem.average >= 10 ? "default" : "destructive"} className={sem.average >= 10 ? "bg-accent text-accent-foreground" : ""}>
                    {sem.average >= 10 ? "Validé" : "Non validé"}
                  </Badge>
                </div>
                <Progress value={(sem.credits / sem.totalCredits) * 100} className="h-2 mt-3" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sem.subjects.map((sub) => (
                    <div key={sub.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${sub.avg >= 10 ? "text-accent" : "text-destructive"}`}>
                          {sub.avg}/20
                        </span>
                        <Badge variant={sub.status === "Validé" ? "default" : "destructive"} className={`text-xs ${sub.status === "Validé" ? "bg-accent text-accent-foreground" : ""}`}>
                          {sub.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
