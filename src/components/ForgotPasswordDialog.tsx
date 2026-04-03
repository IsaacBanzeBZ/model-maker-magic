import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "email" | "matricule";
}

export function ForgotPasswordDialog({ open, onOpenChange, type }: ForgotPasswordDialogProps) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) {
      toast({ title: "Erreur", description: type === "email" ? "Veuillez entrer votre adresse email." : "Veuillez entrer votre matricule.", variant: "destructive" });
      return;
    }
    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast({ title: "Erreur", description: "Adresse email invalide.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // TODO: Intégrer avec Lovable Cloud
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setValue("");
      setSent(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {sent ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-7 w-7 text-accent" />
            </div>
            <DialogTitle className="text-lg mb-2">Demande envoyée</DialogTitle>
            <DialogDescription className="mb-6">
              {type === "email"
                ? `Si un compte existe pour ${value}, vous recevrez un email avec les instructions de réinitialisation.`
                : `Votre demande de réinitialisation pour le matricule ${value} a été transmise à votre administrateur.`}
            </DialogDescription>
            <Button onClick={handleClose} className="w-full">Retour à la connexion</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Mot de passe oublié</DialogTitle>
              <DialogDescription>
                {type === "email"
                  ? "Entrez votre adresse email pour recevoir un lien de réinitialisation."
                  : "Entrez votre matricule pour demander la réinitialisation de votre mot de passe auprès de votre administrateur."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{type === "email" ? "Adresse email" : "Matricule"}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={type === "email" ? "email" : "text"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === "email" ? "votre@email.com" : "EL-2025-001"}
                    className="pl-10"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2 sm:flex-col">
              <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : "Réinitialiser le mot de passe"}
              </Button>
              <Button variant="ghost" onClick={handleClose} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
