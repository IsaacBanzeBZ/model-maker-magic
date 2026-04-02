import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, Search, Filter, LogIn, Upload, UserPlus, Eye, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type LogType = "login" | "import" | "create" | "publish" | "settings";

interface AuditLog {
  id: string;
  action: string;
  type: LogType;
  user: string;
  university: string;
  details: string;
  timestamp: string;
  ip: string;
}

const typeIcons: Record<LogType, typeof LogIn> = {
  login: LogIn,
  import: Upload,
  create: UserPlus,
  publish: Eye,
  settings: Settings,
};

const typeLabels: Record<LogType, string> = {
  login: "Connexion",
  import: "Import",
  create: "Création",
  publish: "Publication",
  settings: "Paramètres",
};

const typeColors: Record<LogType, string> = {
  login: "bg-primary/10 text-primary",
  import: "bg-accent/10 text-accent",
  create: "bg-secondary/10 text-secondary",
  publish: "bg-highlight/10 text-highlight-foreground",
  settings: "bg-muted text-muted-foreground",
};

const mockLogs: AuditLog[] = [
  { id: "1", action: "Connexion réussie", type: "login", user: "Jean Mukendi", university: "UNIKIN", details: "Connexion admin", timestamp: "2025-03-26 14:32:05", ip: "192.168.1.45" },
  { id: "2", action: "Import Excel (245 notes)", type: "import", user: "Marie Kabila", university: "UNILU", details: "Fichier: notes_L2_2025.xlsx", timestamp: "2025-03-26 14:15:22", ip: "10.0.0.12" },
  { id: "3", action: "Création étudiant", type: "create", user: "Paul Tshisekedi", university: "UCC", details: "Étudiant: Kabongo Marc", timestamp: "2025-03-26 13:50:10", ip: "172.16.0.8" },
  { id: "4", action: "Résultats publiés", type: "publish", user: "Jean Mukendi", university: "UNIKIN", details: "Promotion L1 - Semestre 1", timestamp: "2025-03-26 12:30:00", ip: "192.168.1.45" },
  { id: "5", action: "Modification paramètres", type: "settings", user: "Super Admin", university: "Système", details: "MDP par défaut modifié", timestamp: "2025-03-26 10:00:00", ip: "10.0.0.1" },
  { id: "6", action: "Connexion échouée", type: "login", user: "Inconnu", university: "UNIKIN", details: "Email: test@unikin.cd", timestamp: "2025-03-26 09:45:30", ip: "203.0.113.5" },
  { id: "7", action: "Import Excel (120 notes)", type: "import", user: "Paul Tshisekedi", university: "UCC", details: "Fichier: exam_L3.xlsx", timestamp: "2025-03-25 16:20:00", ip: "172.16.0.8" },
  { id: "8", action: "Création admin", type: "create", user: "Super Admin", university: "ISC", details: "Admin: Sophie Lukaku", timestamp: "2025-03-25 14:00:00", ip: "10.0.0.1" },
];

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = mockLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.university.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Logs d'audit</h1>
        <p className="text-muted-foreground text-sm mt-1">Suivi de toutes les activités sur la plateforme</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="login">Connexions</SelectItem>
            <SelectItem value="import">Imports</SelectItem>
            <SelectItem value="create">Créations</SelectItem>
            <SelectItem value="publish">Publications</SelectItem>
            <SelectItem value="settings">Paramètres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Utilisateur</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Université</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Détails</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date & Heure</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const Icon = typeIcons[log.type];
                  return (
                    <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${typeColors[log.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </td>
                      <td className="p-4 font-medium text-foreground">{log.action}</td>
                      <td className="p-4 text-foreground">{log.user}</td>
                      <td className="p-4 font-mono text-muted-foreground">{log.university}</td>
                      <td className="p-4 text-muted-foreground text-xs max-w-[200px] truncate">{log.details}</td>
                      <td className="p-4 text-muted-foreground text-xs whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{log.ip}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Aucun log trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
