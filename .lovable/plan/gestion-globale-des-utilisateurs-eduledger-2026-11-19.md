# Gestion globale des utilisateurs EduLedger

## Objectif
Donner au Super Admin une vue centralisée des étudiants, administrateurs et universités, ainsi que des commandes de modération et de mise à jour des coordonnées de connexion.

## Expérience prévue
- Ajouter une rubrique « Étudiants » au Super Admin, avec sélection/recherche par université, promotion et statut, et une liste des matricules et coordonnées disponibles.
- Ajouter des actions par utilisateur pour modifier les coordonnées de connexion, activer/bannir puis réactiver un étudiant, ou désactiver un administrateur.
- Afficher les commandes utilisateur aussi depuis les fiches pertinentes, avec confirmation pour le bannissement et journal d’audit.
- Conserver les données historiques : le bannissement désactive l’accès au compte sans effacer l’étudiant ni ses notes.

## Sécurité et portée
- Les changements d’accès, identifiants et rôles doivent être validés côté serveur; aucune permission Super Admin ne doit dépendre du navigateur ou de localStorage.
- Les données de connexion sensibles ne sont jamais affichées; un changement de mot de passe est une réinitialisation protégée, pas la lecture du mot de passe actuel.
- Cette version du projet ne possède actuellement aucun stockage/authentification réelle : activer Lovable Cloud sera nécessaire pour livrer les opérations persistantes et sécurisées. Les écrans actuels reposent sur des exemples locaux.

## Technique
- Activer Lovable Cloud avant d’ajouter les opérations persistantes.
- Concevoir les tables et règles d’accès avec rôles séparés et RLS, en appliquant la portée multi-université côté serveur.
- Ajouter les pages/routes et contrôles Super Admin, les opérations protégées et le journal; relier les comptes d’authentification aux dossiers étudiants/admins sans exposer secrets ni mots de passe.
- Vérifier le parcours de consultation, modification, bannissement/réactivation et audit avec un compte Super Admin authentifié.

## Hors périmètre
Les changements de mot de passe en clair, l’effacement définitif des étudiants, et les actions de messagerie externe (courriel/SMS).