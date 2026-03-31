import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Edit, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Promotion {
  id: number;
  name: string;
  level: string;
  studentCount: number;
}

const initialPromotions: Promotion[] = [
  { id: 1, name: "L1 Informatique", level: "Licence 1", studentCount: 45 },
  { id: 2, name: "L2 Informatique", level: "Licence 2", studentCount: 38 },
  { id: 3, name: "L3 Informatique", level: "Licence 3", studentCount: 32 },
  { id: 4, name: "L1 Gestion", level: "Licence 1", studentCount: 52 },
  { id: 5, name: "L2 Gestion", level: "Licence 2", studentCount: 41 },
  { id: 6, name: "L1 Droit", level: "Licence 1", studentCount: 65 },
];

export default function Promotions() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [form, setForm] = useState({ name: "", level: "" });
  const { toast } = useToast();

  const handleSave = () => {
    if (!form.name || !form.level) {
      toast({ title: "Erreur", description: "Remplissez tous les champs", variant: "destructive" });
      return;
    }
    if (editingPromo) {
      setPromotions(promotions.map((p) => (p.id === editingPromo.id ? { ...p, ...form } : p)));
      toast({ title: "Promotion modifiée", description: form.name });
    } else {
      setPromotions([...promotions, { id: Date.now(), ...form, studentCount: 0 }]);
      toast({ title: "Promotion créée", description: form.name });
    }
    setForm({ name: "", level: "" });
    setEditingPromo(null);
    setDialogOpen(false);
  };

  const openEdit = (p: Promotion) => {
    setEditingPromo(p);
    setForm({ name: p.name, level: p.level });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingPromo(null);
    setForm({ name: "", level: "" });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPromotions(promotions.filter((p) => p.id !== id));
    toast({ title: "Promotion supprimée" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des promotions</h1>
          <p className="text-muted-foreground text-sm mt-1">{promotions.length} promotions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Nouvelle promotion</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPromo ? "Modifier la promotion" : "Créer une promotion"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom de la promotion</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: L1 Informatique" />
              </div>
              <div className="space-y-2">
                <Label>Niveau</Label>
                <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Ex: Licence 1" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editingPromo ? "Enregistrer" : "Créer"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{p.level}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{p.studentCount} étudiants</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
