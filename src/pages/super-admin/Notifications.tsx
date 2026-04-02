import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, Building2, UserCog, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const sentNotifications = [
  { id: 1, target: "Toutes les universités", channel: "Email", subject: "Maintenance planifiée", date: "2026-03-28", status: "envoyé" },
  { id: 2, target: "Admin — UNIKIN", channel: "SMS", subject: "Rappel import notes", date: "2026-03-25", status: "envoyé" },
  { id: 3, target: "UNILU", channel: "Email", subject: "Nouveau module disponible", date: "2026-03-20", status: "envoyé" },
  { id: 4, target: "Tous les admins", channel: "Email", subject: "Mise à jour conditions", date: "2026-03-15", status: "envoyé" },
];

const universities = [
  { code: "UNIKIN", name: "Université de Kinshasa" },
  { code: "UNILU", name: "Université de Lubumbashi" },
  { code: "UCC", name: "Université Catholique du Congo" },
  { code: "ISC", name: "Institut Supérieur de Commerce" },
];

const admins = [
  { id: "1", name: "Jean Mukendi", email: "j.mukendi@unikin.cd", university: "UNIKIN" },
  { id: "2", name: "Marie Kabila", email: "m.kabila@unilu.cd", university: "UNILU" },
  { id: "3", name: "Paul Tshisekedi", email: "p.tshisekedi@ucc.cd", university: "UCC" },
];

export default function SuperAdminNotifications() {
  const { toast } = useToast();
  const [targetType, setTargetType] = useState<"all_universities" | "one_university" | "all_admins" | "one_admin">("all_universities");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message || (channel === "email" && !subject)) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs requis.", variant: "destructive" });
      return;
    }
    const targetLabel =
      targetType === "all_universities" ? "toutes les universités" :
      targetType === "one_university" ? universities.find(u => u.code === selectedUniversity)?.name :
      targetType === "all_admins" ? "tous les admins" :
      admins.find(a => a.id === selectedAdmin)?.name;

    toast({ title: "Notification envoyée", description: `${channel === "email" ? "Email" : "SMS"} envoyé à ${targetLabel}` });
    setSubject("");
    setMessage("");
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">Envoyer des notifications aux universités et administrateurs</p>
      </motion.div>

      <Tabs defaultValue="envoyer">
        <TabsList>
          <TabsTrigger value="envoyer">Envoyer</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="envoyer" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Send className="h-4 w-4" />Nouvelle notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Destinataire</Label>
                <RadioGroup value={targetType} onValueChange={(v) => setTargetType(v as typeof targetType)} className="grid grid-cols-2 gap-3">
                  {[
                    { value: "all_universities", label: "Toutes les universités", icon: Building2 },
                    { value: "one_university", label: "Une université", icon: Building2 },
                    { value: "all_admins", label: "Tous les admins", icon: UserCog },
                    { value: "one_admin", label: "Un admin", icon: UserCog },
                  ].map((opt) => (
                    <Label key={opt.value} htmlFor={opt.value} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${targetType === opt.value ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <opt.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {targetType === "one_university" && (
                <div className="space-y-2">
                  <Label>Sélectionner l'université</Label>
                  <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>
                      {universities.map((u) => <SelectItem key={u.code} value={u.code}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {targetType === "one_admin" && (
                <div className="space-y-2">
                  <Label>Sélectionner l'admin</Label>
                  <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>
                      {admins.map((a) => <SelectItem key={a.id} value={a.id}>{a.name} ({a.university})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Channel */}
              <div className="space-y-2">
                <Label>Canal d'envoi</Label>
                <div className="flex gap-3">
                  <Button variant={channel === "email" ? "default" : "outline"} size="sm" onClick={() => setChannel("email")}>
                    <Mail className="h-4 w-4 mr-2" />Email
                  </Button>
                  <Button variant={channel === "sms" ? "default" : "outline"} size="sm" onClick={() => setChannel("sms")}>
                    <MessageSquare className="h-4 w-4 mr-2" />SMS
                  </Button>
                </div>
              </div>

              {/* Message */}
              {channel === "email" && (
                <div className="space-y-2">
                  <Label>Objet</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Objet du message..." />
                </div>
              )}

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message..." rows={5} />
              </div>

              <Button onClick={handleSend} className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />Envoyer la notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notifications envoyées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sentNotifications.map((n) => (
                  <div key={n.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        {n.channel === "Email" ? <Mail className="h-4 w-4 text-primary" /> : <MessageSquare className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.subject}</p>
                        <p className="text-xs text-muted-foreground">{n.target} · {n.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{n.channel}</Badge>
                      <Badge className="bg-accent text-accent-foreground">{n.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
