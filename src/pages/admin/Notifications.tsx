import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Users, GraduationCap, Mail, MessageSquare, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const promotions = ["L1 Informatique", "L2 Informatique", "L3 Informatique"];

const students = [
  { matricule: "ETU-2025-0001", name: "Mukendi Jean", promotion: "L1 Informatique" },
  { matricule: "ETU-2025-0002", name: "Tshimanga Marie", promotion: "L2 Informatique" },
  { matricule: "ETU-2025-0003", name: "Kalala Pierre", promotion: "L1 Informatique" },
];

const sentNotifications = [
  { id: 1, target: "Tous les étudiants", channel: "Email", subject: "Dates des examens", date: "2026-03-28", status: "envoyé" },
  { id: 2, target: "L1 Informatique", channel: "SMS", subject: "Rappel TP", date: "2026-03-25", status: "envoyé" },
  { id: 3, target: "Mukendi Jean", channel: "Email", subject: "Convocation", date: "2026-03-20", status: "envoyé" },
];

export default function AdminNotifications() {
  const { toast } = useToast();
  const [targetType, setTargetType] = useState<"all" | "promotion" | "individual">("all");
  const [selectedPromotion, setSelectedPromotion] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message || (channel === "email" && !subject)) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs requis.", variant: "destructive" });
      return;
    }
    const targetLabel = targetType === "all" ? "tous les étudiants" : targetType === "promotion" ? selectedPromotion : students.find(s => s.matricule === selectedStudent)?.name;
    toast({ title: "Notification envoyée", description: `${channel === "email" ? "Email" : "SMS"} envoyé à ${targetLabel}` });
    setSubject(""); setMessage("");
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Notifications étudiants</h1>
        <p className="text-muted-foreground text-sm mt-1">Envoyer des notifications par email ou SMS</p>
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
              <div className="space-y-3">
                <Label>Destinataire</Label>
                <RadioGroup value={targetType} onValueChange={(v) => setTargetType(v as typeof targetType)} className="grid grid-cols-3 gap-3">
                  {[
                    { value: "all", label: "Tous les étudiants", icon: Users },
                    { value: "promotion", label: "Par promotion", icon: GraduationCap },
                    { value: "individual", label: "Un étudiant", icon: User },
                  ].map((opt) => (
                    <Label key={opt.value} htmlFor={`admin-${opt.value}`} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${targetType === opt.value ? "border-primary bg-primary/5" : "border-border"}`}>
                      <RadioGroupItem value={opt.value} id={`admin-${opt.value}`} />
                      <opt.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{opt.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {targetType === "promotion" && (
                <div className="space-y-2">
                  <Label>Promotion</Label>
                  <Select value={selectedPromotion} onValueChange={setSelectedPromotion}>
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>
                      {promotions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {targetType === "individual" && (
                <div className="space-y-2">
                  <Label>Étudiant</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => <SelectItem key={s.matricule} value={s.matricule}>{s.name} ({s.matricule})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Canal</Label>
                <div className="flex gap-3">
                  <Button variant={channel === "email" ? "default" : "outline"} size="sm" onClick={() => setChannel("email")}><Mail className="h-4 w-4 mr-2" />Email</Button>
                  <Button variant={channel === "sms" ? "default" : "outline"} size="sm" onClick={() => setChannel("sms")}><MessageSquare className="h-4 w-4 mr-2" />SMS</Button>
                </div>
              </div>

              {channel === "email" && (
                <div className="space-y-2">
                  <Label>Objet</Label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Objet..." />
                </div>
              )}

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message..." rows={5} />
              </div>

              <Button onClick={handleSend}><Send className="h-4 w-4 mr-2" />Envoyer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Historique</CardTitle></CardHeader>
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
