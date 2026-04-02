import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, CheckCircle2, Clock, Archive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "closed" | "upcoming";
  studentCount: number;
  gradeCount: number;
}

const initialYears: AcademicYear[] = [
  { id: 1, name: "2025-2026", startDate: "2025-09-01", endDate: "2026-07-31", status: "active", studentCount: 1248, gradeCount: 8420 },
  { id: 2, name: "2024-2025", startDate: "2024-09-01", endDate: "2025-07-31", status: "closed", studentCount: 1180, gradeCount: 12350 },
  { id: 3, name: "2023-2024", startDate: "2023-09-01", endDate: "2024-07-31", status: "closed", studentCount: 1050, gradeCount: 11200 },
];

const statusConfig = {
  active: { label: "Active", icon: CheckCircle2, className: "bg-accent text-accent-foreground" },
  closed: { label: "Clôturée", icon: Archive, className: "bg-muted text-muted-foreground" },
  upcoming: { label: "À venir", icon: Clock, className: "bg-primary/10 text-primary" },
};

export default function AcademicYears() {
  const [years, setYears] = useState(initialYears);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "" });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!form.name || !form.startDate || !form.endDate) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs.", variant: "destructive" });
      return;
    }
    const newYear: AcademicYear = {
      id: Date.now(),
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      status: "upcoming",
      studentCount: 0,
      gradeCount: 0,
    };
    setYears([newYear, ...years]);
    setForm({ name: "", startDate: "", endDate: "" });
    setDialogOpen(false);
    toast({ title: "Année créée", description: `${form.name} a été ajoutée.` });
  };

  const activate = (id: number) => {
    setYears(years.map((y) => ({
      ...y,
      status: y.id === id ? "active" : y.status === "active" ? "closed" : y.status,
    })));
    toast({ title: "Année activée", description: "L'année académique a été activée. L'ancienne année a été clôturée." });
  };

  const closeYear = (id: number) => {
    setYears(years.map((y) => (y.id === id ? { ...y, status: "closed" as const } : y)));
    toast({ title: "Année clôturée" });
  };

  const activeYear = years.find((y) => y.status === "active");

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Années académiques</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Année active : <span className="font-medium text-foreground">{activeYear?.name ?? "Aucune"}</span>
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nouvelle année</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une année académique</DialogTitle>
              <DialogDescription>Définissez la période de la nouvelle année académique.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom (ex: 2026-2027)</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="2026-2027" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.map((year, i) => {
          const config = statusConfig[year.status];
          const StatusIcon = config.icon;
          return (
            <motion.div key={year.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`hover:shadow-md transition-shadow ${year.status === "active" ? "border-primary/50 ring-1 ring-primary/20" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${year.status === "active" ? "bg-primary/10" : "bg-muted"}`}>
                        <Calendar className={`h-5 w-5 ${year.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{year.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{year.startDate} → {year.endDate}</p>
                      </div>
                    </div>
                    <Badge className={config.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold text-foreground">{year.studentCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Étudiants</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-xl font-bold text-foreground">{year.gradeCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Notes</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {year.status === "upcoming" && (
                      <Button size="sm" className="flex-1" onClick={() => activate(year.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" />Activer
                      </Button>
                    )}
                    {year.status === "active" && (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => closeYear(year.id)}>
                        <Archive className="h-4 w-4 mr-1" />Clôturer
                      </Button>
                    )}
                    {year.status === "closed" && (
                      <Button size="sm" variant="ghost" className="flex-1 text-muted-foreground" disabled>
                        <Archive className="h-4 w-4 mr-1" />Archivée
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
