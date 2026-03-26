import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Search, MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface University {
  id: string;
  name: string;
  code: string;
  email: string;
  students: number;
  admins: number;
  status: "active" | "inactive";
  createdAt: string;
}

const mockUniversities: University[] = [
  { id: "1", name: "Université de Kinshasa", code: "UNIKIN", email: "admin@unikin.cd", students: 4200, admins: 8, status: "active", createdAt: "2024-09-01" },
  { id: "2", name: "Université de Lubumbashi", code: "UNILU", email: "admin@unilu.cd", students: 3100, admins: 6, status: "active", createdAt: "2024-09-15" },
  { id: "3", name: "Université Catholique du Congo", code: "UCC", email: "admin@ucc.cd", students: 2800, admins: 5, status: "active", createdAt: "2024-10-01" },
  { id: "4", name: "Institut Supérieur de Commerce", code: "ISC", email: "admin@isc.cd", students: 1900, admins: 4, status: "inactive", createdAt: "2024-11-01" },
];

export default function Universities() {
  const [search, setSearch] = useState("");
  const [universities, setUniversities] = useState<University[]>(mockUniversities);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUniv, setEditingUniv] = useState<University | null>(null);
  const [form, setForm] = useState({ name: "", code: "", email: "" });
  const { toast } = useToast();

  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.code || !form.email) {
      toast({ title: "Erreur", description: "Tous les champs sont requis.", variant: "destructive" });
      return;
    }
    if (editingUniv) {
      setUniversities((prev) =>
        prev.map((u) => (u.id === editingUniv.id ? { ...u, ...form } : u))
      );
      toast({ title: "Université modifiée" });
    } else {
      const newUniv: University = {
        id: Date.now().toString(),
        ...form,
        students: 0,
        admins: 0,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUniversities((prev) => [...prev, newUniv]);
      toast({ title: "Université créée" });
    }
    setDialogOpen(false);
    setEditingUniv(null);
    setForm({ name: "", code: "", email: "" });
  };

  const toggleStatus = (id: string) => {
    setUniversities((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
      )
    );
    toast({ title: "Statut mis à jour" });
  };

  const openEdit = (u: University) => {
    setEditingUniv(u);
    setForm({ name: u.name, code: u.code, email: u.email });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingUniv(null);
    setForm({ name: "", code: "", email: "" });
    setDialogOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Universités</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérer toutes les universités de la plateforme</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle université
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUniv ? "Modifier l'université" : "Nouvelle université"}</DialogTitle>
              <DialogDescription>
                {editingUniv ? "Modifiez les informations." : "Remplissez les informations pour créer une université."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Université de..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input id="code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="UNIKIN" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@universite.cd" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editingUniv ? "Enregistrer" : "Créer"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher une université..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Université</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Code</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Étudiants</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Admins</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Créée le</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono">{u.code}</td>
                    <td className="p-4 text-foreground">{u.students.toLocaleString()}</td>
                    <td className="p-4 text-foreground">{u.admins}</td>
                    <td className="p-4">
                      <Badge variant={u.status === "active" ? "default" : "secondary"} className={u.status === "active" ? "bg-accent text-accent-foreground" : ""}>
                        {u.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{u.createdAt}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(u)}>
                            <Pencil className="h-4 w-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(u.id)}>
                            <Power className="h-4 w-4 mr-2" /> {u.status === "active" ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Aucune université trouvée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
