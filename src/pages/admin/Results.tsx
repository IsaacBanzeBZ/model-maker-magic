import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Eye, EyeOff, Search, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Grade {
  id: number;
  student: string;
  matricule: string;
  subject: string;
  grade: number;
  type: "TP" | "Interrogation" | "Examen";
  promotion: string;
}

interface Publication {
  id: number;
  promotion: string;
  subject: string;
  published: boolean;
  date: string;
  count: number;
}

const initialGrades: Grade[] = [
  { id: 1, student: "Mukendi Jean", matricule: "ETU-2025-0001", subject: "Algorithmique", grade: 16, type: "Examen", promotion: "L1 Info" },
  { id: 2, student: "Tshimanga Marie", matricule: "ETU-2025-0002", subject: "Algorithmique", grade: 14, type: "Examen", promotion: "L1 Info" },
  { id: 3, student: "Kalala Pierre", matricule: "ETU-2025-0003", subject: "Base de données", grade: 12, type: "TP", promotion: "L1 Info" },
  { id: 4, student: "Mukendi Jean", matricule: "ETU-2025-0001", subject: "Réseaux", grade: 15, type: "Interrogation", promotion: "L2 Info" },
  { id: 5, student: "Kabongo David", matricule: "ETU-2025-0005", subject: "Algorithmique", grade: 8, type: "Examen", promotion: "L1 Info" },
];

const initialPublications: Publication[] = [
  { id: 1, promotion: "L1 Informatique", subject: "Algorithmique", published: true, date: "15/01/2026", count: 45 },
  { id: 2, promotion: "L1 Informatique", subject: "Base de données", published: false, date: "", count: 38 },
  { id: 3, promotion: "L2 Informatique", subject: "Réseaux", published: true, date: "12/01/2026", count: 32 },
];

export default function Results() {
  const [grades] = useState(initialGrades);
  const [publications, setPublications] = useState(initialPublications);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({ student: "", subject: "", grade: "", type: "Examen" as Grade["type"] });
  const { toast } = useToast();

  const filteredGrades = grades.filter((g) => {
    const matchSearch = `${g.student} ${g.matricule} ${g.subject}`.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || g.type === typeFilter;
    return matchSearch && matchType;
  });

  const togglePublish = (id: number) => {
    setPublications(publications.map((p) =>
      p.id === id ? { ...p, published: !p.published, date: !p.published ? new Date().toLocaleDateString("fr-FR") : "" } : p
    ));
    const pub = publications.find((p) => p.id === id);
    toast({
      title: pub?.published ? "Publication retirée" : "Résultats publiés",
      description: `${pub?.subject} — ${pub?.promotion}`,
    });
  };

  const avgByPromo = (promo: string) => {
    const promoGrades = grades.filter((g) => g.promotion === promo);
    if (promoGrades.length === 0) return 0;
    return (promoGrades.reduce((s, g) => s + g.grade, 0) / promoGrades.length).toFixed(1);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Résultats & Notes</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestion des notes et publication des résultats</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Moy. L1 Info</p>
            <p className="text-2xl font-bold text-foreground">{avgByPromo("L1 Info")}/20</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Moy. L2 Info</p>
            <p className="text-2xl font-bold text-foreground">{avgByPromo("L2 Info")}/20</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total notes</p>
            <p className="text-2xl font-bold text-foreground">{grades.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grades">
        <TabsList>
          <TabsTrigger value="grades">Notes</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-base">Liste des notes</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-full sm:w-[200px]" />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="TP">TP</SelectItem>
                      <SelectItem value="Interrogation">Interrogation</SelectItem>
                      <SelectItem value="Examen">Examen</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Ajouter une note</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Étudiant</Label><Input placeholder="Nom de l'étudiant" /></div>
                        <div className="space-y-2"><Label>Matière</Label><Input placeholder="Matière" /></div>
                        <div className="space-y-2"><Label>Note (/20)</Label><Input type="number" min={0} max={20} placeholder="15" /></div>
                        <div className="space-y-2">
                          <Label>Type d'évaluation</Label>
                          <Select defaultValue="Examen">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TP">TP</SelectItem>
                              <SelectItem value="Interrogation">Interrogation</SelectItem>
                              <SelectItem value="Examen">Examen</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                        <Button onClick={() => { setDialogOpen(false); toast({ title: "Note ajoutée" }); }}>Ajouter</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead className="text-center">Note</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Promotion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell className="font-medium">{g.student}</TableCell>
                      <TableCell className="font-mono text-sm">{g.matricule}</TableCell>
                      <TableCell>{g.subject}</TableCell>
                      <TableCell className={`text-center font-bold ${g.grade >= 10 ? "text-accent" : "text-destructive"}`}>{g.grade}/20</TableCell>
                      <TableCell><Badge variant="outline">{g.type}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{g.promotion}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gestion des publications</CardTitle>
              <CardDescription>Publiez ou retirez les résultats visibles par les étudiants</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promotion</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead className="text-center">Étudiants</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publications.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.promotion}</TableCell>
                      <TableCell>{p.subject}</TableCell>
                      <TableCell className="text-center">{p.count}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={p.published ? "default" : "secondary"} className={p.published ? "bg-accent text-accent-foreground" : ""}>
                          {p.published ? "Publié" : "Non publié"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">{p.date || "—"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant={p.published ? "outline" : "default"} size="sm" onClick={() => togglePublish(p.id)}>
                          {p.published ? <><EyeOff className="h-4 w-4 mr-1" />Retirer</> : <><Eye className="h-4 w-4 mr-1" />Publier</>}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
