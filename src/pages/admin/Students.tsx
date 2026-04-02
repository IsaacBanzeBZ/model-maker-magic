import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Plus, MoreHorizontal, Edit, Power, KeyRound, Download, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: number;
  matricule: string;
  nom: string;
  postnom: string;
  prenom: string;
  promotion: string;
  status: "active" | "inactive";
  downloadBlocked: boolean;
}

const initialStudents: Student[] = [
  { id: 1, matricule: "ETU-2025-0001", nom: "Mukendi", postnom: "Kabila", prenom: "Jean", promotion: "L1 Informatique", status: "active", downloadBlocked: false },
  { id: 2, matricule: "ETU-2025-0002", nom: "Tshimanga", postnom: "Mwamba", prenom: "Marie", promotion: "L2 Informatique", status: "active", downloadBlocked: false },
  { id: 3, matricule: "ETU-2025-0003", nom: "Kalala", postnom: "Ngoy", prenom: "Pierre", promotion: "L1 Informatique", status: "active", downloadBlocked: false },
  { id: 4, matricule: "ETU-2025-0004", nom: "Ilunga", postnom: "Kasongo", prenom: "Sophie", promotion: "L3 Informatique", status: "inactive", downloadBlocked: false },
  { id: 5, matricule: "ETU-2025-0005", nom: "Kabongo", postnom: "Mutombo", prenom: "David", promotion: "L2 Informatique", status: "active", downloadBlocked: true },
  { id: 6, matricule: "ETU-2025-0006", nom: "Mbuyi", postnom: "Tshilumba", prenom: "Claire", promotion: "L1 Informatique", status: "active", downloadBlocked: false },
  { id: 7, matricule: "ETU-2025-0007", nom: "Ngandu", postnom: "Kazembe", prenom: "Paul", promotion: "L3 Informatique", status: "active", downloadBlocked: false },
  { id: 8, matricule: "ETU-2025-0008", nom: "Kalonji", postnom: "Mwilambwe", prenom: "Anne", promotion: "L2 Informatique", status: "inactive", downloadBlocked: false },
];

const promotions = ["Toutes", "L1 Informatique", "L2 Informatique", "L3 Informatique"];

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [promoFilter, setPromoFilter] = useState("Toutes");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ nom: "", postnom: "", prenom: "", promotion: "L1 Informatique" });
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<Student | null>(null);
  const { toast } = useToast();

  const filtered = students.filter((s) => {
    const matchSearch = `${s.nom} ${s.postnom} ${s.prenom} ${s.matricule}`.toLowerCase().includes(search.toLowerCase());
    const matchPromo = promoFilter === "Toutes" || s.promotion === promoFilter;
    return matchSearch && matchPromo;
  });

  const handleSave = () => {
    if (!form.nom || !form.postnom || !form.prenom) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    if (editingStudent) {
      setStudents(students.map((s) => (s.id === editingStudent.id ? { ...s, ...form } : s)));
      toast({ title: "Étudiant modifié", description: `${form.nom} ${form.prenom}` });
    } else {
      const id = students.length + 1;
      const matricule = `ETU-2025-${String(id).padStart(4, "0")}`;
      setStudents([...students, { id, matricule, ...form, status: "active", downloadBlocked: false }]);
      toast({ title: "Étudiant ajouté", description: `Matricule: ${matricule}` });
    }
    setForm({ nom: "", postnom: "", prenom: "", promotion: "L1 Informatique" });
    setEditingStudent(null);
    setDialogOpen(false);
  };

  const openEdit = (s: Student) => {
    setEditingStudent(s);
    setForm({ nom: s.nom, postnom: s.postnom, prenom: s.prenom, promotion: s.promotion });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingStudent(null);
    setForm({ nom: "", postnom: "", prenom: "", promotion: "L1 Informatique" });
    setDialogOpen(true);
  };

  const toggleStatus = (id: number) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s)));
    const student = students.find((s) => s.id === id);
    toast({ title: student?.status === "active" ? "Étudiant désactivé" : "Étudiant activé" });
  };

  const toggleDownload = (id: number) => {
    setStudents(students.map((s) => {
      if (s.id === id) {
        const blocked = !s.downloadBlocked;
        // Persist per-student blocks
        const stored = JSON.parse(localStorage.getItem("dl_students") || "{}");
        stored[s.matricule] = blocked;
        localStorage.setItem("dl_students", JSON.stringify(stored));
        return { ...s, downloadBlocked: blocked };
      }
      return s;
    }));
    const student = students.find((s) => s.id === id);
    const wasBlocked = student?.downloadBlocked;
    toast({
      title: wasBlocked ? "Téléchargement autorisé" : "Téléchargement bloqué",
      description: `${student?.nom} ${student?.prenom} (${student?.matricule})`,
    });
  };

  const handleResetPassword = () => {
    if (!resetTarget) return;
    toast({
      title: "Mot de passe réinitialisé",
      description: `Le mot de passe de ${resetTarget.nom} ${resetTarget.prenom} (${resetTarget.matricule}) a été réinitialisé au mot de passe par défaut.`,
    });
    setResetDialogOpen(false);
    setResetTarget(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des étudiants</h1>
          <p className="text-muted-foreground text-sm mt-1">{students.length} étudiants enregistrés</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Ajouter un étudiant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Modifier l'étudiant" : "Nouvel étudiant"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Nom" />
              </div>
              <div className="space-y-2">
                <Label>Post-nom</Label>
                <Input value={form.postnom} onChange={(e) => setForm({ ...form, postnom: e.target.value })} placeholder="Post-nom" />
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} placeholder="Prénom" />
              </div>
              <div className="space-y-2">
                <Label>Promotion</Label>
                <Select value={form.promotion} onValueChange={(v) => setForm({ ...form, promotion: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {promotions.filter((p) => p !== "Toutes").map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editingStudent ? "Enregistrer" : "Ajouter"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par nom, matricule..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={promoFilter} onValueChange={setPromoFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {promotions.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom complet</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Téléchargement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.matricule}</TableCell>
                  <TableCell className="font-medium">{s.nom} {s.postnom} {s.prenom}</TableCell>
                  <TableCell><Badge variant="secondary">{s.promotion}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Badge variant={s.status === "active" ? "default" : "destructive"} className={s.status === "active" ? "bg-accent text-accent-foreground" : ""}>
                      {s.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={s.downloadBlocked ? "destructive" : "default"} className={!s.downloadBlocked ? "bg-accent text-accent-foreground" : ""}>
                      {s.downloadBlocked ? "Bloqué" : "Autorisé"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(s)}>
                          <Edit className="h-4 w-4 mr-2" />Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(s.id)}>
                          <Power className="h-4 w-4 mr-2" />{s.status === "active" ? "Désactiver" : "Activer"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleDownload(s.id)}>
                          {s.downloadBlocked ? (
                            <><Download className="h-4 w-4 mr-2" />Autoriser téléchargement</>
                          ) : (
                            <><DownloadOff className="h-4 w-4 mr-2" />Bloquer téléchargement</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setResetTarget(s); setResetDialogOpen(true); }}>
                          <KeyRound className="h-4 w-4 mr-2" />Réinitialiser mdp
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Aucun étudiant trouvé</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Le mot de passe de <span className="font-medium text-foreground">{resetTarget?.nom} {resetTarget?.prenom}</span> ({resetTarget?.matricule}) sera réinitialisé au mot de passe par défaut.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleResetPassword}>Réinitialiser</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
