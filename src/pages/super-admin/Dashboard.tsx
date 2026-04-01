import { motion } from "framer-motion";
import { Building2, Users, UserCog, BookOpen, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from "recharts";

const stats = [
  { label: "Universités", value: "12", icon: Building2, change: "+3 ce mois", color: "text-secondary" },
  { label: "Étudiants totaux", value: "15,420", icon: Users, change: "+8%", color: "text-primary" },
  { label: "Administrateurs", value: "34", icon: UserCog, change: "+5", color: "text-primary" },
  { label: "Notes enregistrées", value: "128,350", icon: BookOpen, change: "+12%", color: "text-accent" },
];

const studentsPerUniversity = [
  { name: "UNIKIN", students: 4200 },
  { name: "UNILU", students: 3100 },
  { name: "UCC", students: 2800 },
  { name: "UPC", students: 2100 },
  { name: "ISC", students: 1900 },
  { name: "ISTM", students: 1320 },
];

const monthlyGrowth = [
  { month: "Jan", universities: 8, students: 11200, notes: 85000 },
  { month: "Fév", universities: 8, students: 11800, notes: 90000 },
  { month: "Mar", universities: 9, students: 12400, notes: 95000 },
  { month: "Avr", universities: 10, students: 13100, notes: 102000 },
  { month: "Mai", universities: 11, students: 14200, notes: 115000 },
  { month: "Jun", universities: 12, students: 15420, notes: 128350 },
];

const universityStatus = [
  { name: "Actives", value: 10, color: "hsl(var(--primary))" },
  { name: "Inactives", value: 2, color: "hsl(var(--muted-foreground))" },
];

const activityByType = [
  { name: "Imports", value: 45, color: "hsl(var(--primary))" },
  { name: "Connexions", value: 120, color: "hsl(var(--accent))" },
  { name: "Publications", value: 32, color: "hsl(210, 70%, 55%)" },
  { name: "Créations", value: 18, color: "hsl(var(--muted-foreground))" },
];

const recentUniversities = [
  { name: "Université de Kinshasa", students: 4200, admins: 8, status: "active" },
  { name: "Université de Lubumbashi", students: 3100, admins: 6, status: "active" },
  { name: "Université Catholique du Congo", students: 2800, admins: 5, status: "active" },
  { name: "Institut Supérieur de Commerce", students: 1900, admins: 4, status: "inactive" },
  { name: "Université Protestante au Congo", students: 2100, admins: 5, status: "active" },
];

const recentActivity = [
  { action: "Import Excel", university: "Univ. Kinshasa", time: "Il y a 5 min", type: "import" },
  { action: "Nouvel admin créé", university: "Univ. Lubumbashi", time: "Il y a 20 min", type: "admin" },
  { action: "Résultats publiés", university: "UCC", time: "Il y a 1h", type: "publish" },
  { action: "Nouvelle université", university: "ISC Kinshasa", time: "Il y a 3h", type: "university" },
  { action: "Connexion admin", university: "UPC", time: "Il y a 4h", type: "login" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function SuperAdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Global</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de la plateforme EduLedger</p>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={container} initial="hidden" animate="show">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  <span>{s.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Étudiants par université</CardTitle>
              <CardDescription>Répartition des effectifs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={studentsPerUniversity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Croissance mensuelle</CardTitle>
              <CardDescription>Évolution des étudiants et notes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Area type="monotone" dataKey="students" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" name="Étudiants" />
                  <Area type="monotone" dataKey="notes" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.15)" name="Notes" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statut des universités</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={universityStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {universityStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activités par type</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={activityByType} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {activityByType.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nouvelles universités</CardTitle>
              <CardDescription>Évolution mensuelle</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Line type="monotone" dataKey="universities" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Universités récentes</CardTitle>
              <CardDescription>Aperçu des universités sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUniversities.map((u) => (
                  <div key={u.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.students} étudiants · {u.admins} admins</p>
                      </div>
                    </div>
                    <Badge variant={u.status === "active" ? "default" : "secondary"} className={u.status === "active" ? "bg-accent text-accent-foreground" : ""}>
                      {u.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activité récente</CardTitle>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                      <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.university} · {a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
