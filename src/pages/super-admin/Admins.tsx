import { useState } from "react";
import { motion } from "framer-motion";
import { UserCog, Plus, Search, MoreHorizontal, Pencil, KeyRound, Power, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  name: string;
  email: string;
  university: string;
  universityCode: string;
  status: "active" | "inactive";
  lastLogin: string;
}

const mockAdmins: Admin[] = [
  { id: "1", name: "Jean Mukendi", email: "j.mukendi@unikin.cd", university: "Université de Kinshasa", universityCode: "UNIKIN", status: "active", lastLogin: "2025-03-25" },
  { id: "2", name: "Marie Kabila", email: "m.kabila@unilu.cd", university: "Université de Lubumbashi", universityCode: "UNILU", status: "active", lastLogin: "2025-03-24" },
  { id: "3", name: "Paul Tshisekedi", email: "p.tshisekedi@ucc.cd", university: "Université Catholique du Congo", universityCode: "UCC", status: "active", lastLogin: "2025-03-20" },
  { id: "4", name: "Sophie Lukaku", email: "s.lukaku@isc.cd", university: "Institut Supérieur de Commerce", universityCode: "ISC", status: "inactive", lastLogin: "2025-02-15" },
];

const universities = ["UNIKIN", "UNILU", "UCC", "ISC"];

export default function Admins() {
  const [search, setSearch] = useState("");
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [form, setForm] = useState({ name: "", email: "", universityCode: "" });
  const { toast } = useToast();

  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.universityCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.email || !form.universityCode) {
      toast({ title: "Erreur", description: "Tous les champs sont requis.", variant: "destructive" });
      return;
    }
    if (editingAdmin) {
      setAdmins((prev) => prev.map((a) => (a.id === editingAdmin.id ? { ...a, ...form } : a)));
      toast({ title: "Administrateur modifié" });
    } else {
      const newAdmin: Admin = {
        id: Date.now().toString(),
        ...form,
        university: form.universityCode,
        status: "active",
        lastLogin: "-",
      };
      setAdmins((prev) => [...prev, newAdmin]);
      toast({ title: "Administrateur créé" });
    }
    setDialogOpen(false);
    setEditingAdmin(null);
    setForm({ name: "", email: "", universityCode: "" });
  };

  const toggleStatus = (id: string) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a)));
    toast({ title: "Statut mis à jour" });
  };

  const resetPassword = (admin: Admin) => {
    toast({ title: "Mot de passe réinitialisé", description: `Un email a été envoyé à ${admin.email}` });
  };

  const openEdit = (a: Admin) => {
    setEditingAdmin(a);
    setForm({ name: a.name, email: a.email, universityCode: a.universityCode });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingAdmin(null);
    setForm({ name: "", email: "", universityCode: "" });
    setDialogOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administrateurs</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérer les administrateurs des universités</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" /> Nouvel admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAdmin ? "Modifier l'admin" : "Nouvel administrateur"}</DialogTitle>
              <DialogDescription>
                {editingAdmin ? "Modifiez les informations." : "Créez un administrateur pour une université."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Mukendi" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@universite.cd" />
              </div>
              <div className="space-y-2">
                <Label>Université</Label>
                <Select value={form.universityCode} onValueChange={(v) => setForm({ ...form, universityCode: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {universities.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editingAdmin ? "Enregistrer" : "Créer"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher un admin..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Administrateur</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Université</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Dernière connexion</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-secondary/10 flex items-center justify-center">
                          <UserCog className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-muted-foreground">{a.universityCode}</td>
                    <td className="p-4">
                      <Badge variant={a.status === "active" ? "default" : "secondary"} className={a.status === "active" ? "bg-accent text-accent-foreground" : ""}>
                        {a.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{a.lastLogin}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(a)}>
                            <Pencil className="h-4 w-4 mr-2" /> Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => resetPassword(a)}>
                            <KeyRound className="h-4 w-4 mr-2" /> Réinitialiser MDP
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(a.id)}>
                            <Power className="h-4 w-4 mr-2" /> {a.status === "active" ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => {
                            toggleStatus(a.id);
                            toast({ title: "Admin banni", description: `${a.name} a été banni de la plateforme.` });
                          }}>
                            <Ban className="h-4 w-4 mr-2" /> Bannir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun administrateur trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
