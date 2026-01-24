# 🌌 CONTEXT.md - ARCHITECTURE "RECEPTION AI" (VERSION GOLD)

> **RÈGLE SUPRÊME :** Ce fichier est la source de vérité absolue. Aucune déviation autorisée. Respecte scrupuleusement les routes, les plans et le design.

## 1. 🔐 IDENTIFIANTS & ACCÈS DÉMO
Ces comptes sont les seuls autorisés pour la démonstration et l'administration.

* **👑 SUPER ADMIN (Toi)**
    * **Email :** `rayanebendaho0@gmail.com`
    * **Password :** `rayane2008.`
    * **Rôle :** Accès total, Gestion des Restaurants, Vue "Inbox Support" (/admin/tickets).

* **🏛️ CLIENT DEMO (Fouquet's)**
    * **Email :** `contact@fouquets-paris.fr`
    * **Password :** `rayane2008.`
    * **Plan :** `ENTERPRISE` (KDS + Stock + Omnicanal).

## 2. 🗺️ STRUCTURE DES ROUTES (SITEMAP)

### 📱 Landing Page (Public)
* `/` : Page d'accueil (Hero, Features, "Technologie NeuralVoice™", PAS de prix affichés).
* `/login` : Connexion client.
* `/contact` : **Formulaire Support Uniquement** (Envoie vers table `support_tickets`). Aucune info de contact visible.
* `/legal/*` : Mentions légales & Confidentialité (Pas d'email visible).

### 🎛️ Dashboard Client (`/dashboard/*`)
* `/dashboard` : **Vue d'ensemble** (Stats rapides).
* `/dashboard/agenda` : **Calendrier** (Interactif : Clic pour ajouter/modifier RDV). *[Tous Plans]*
* `/dashboard/menu` : **La Carte** (CRUD Complet : Ajouter/Modifier/Supprimer). *[Tous Plans]*
* `/dashboard/calls` : **Journal** (Statuts : Réservé, Abandon). *[Tous Plans]*
* `/dashboard/promos` : **Marketing** (Créer/Activer des offres). *[Plan PRO+]*
* `/dashboard/kitchen` : **KDS Cuisine** (Écran temps réel 🔵🟡🟠). *[Plan ENTERPRISE]*
* `/dashboard/support` : **Support Client** (Système de tickets, Chat avec Admin). *[NOUVEAU]*
* `/dashboard/settings` : **Paramètres** (Horaires, Jours Fériés, Identité).

### 👑 Admin Panel (`/admin/*`)
* `/admin` : Vue d'ensemble (MRR, Total Appels).
* `/admin/tickets` : **Inbox Support** (Centralisation de toutes les demandes).
* `/admin/clients` : Gestion des Restaurants (Créer, Modifier Plan, "Simuler Connexion").

## 3. FONCTIONNALITÉS PAR PLAN (MATRICE STRICTE)

### 🐣 PLAN FREE (L'IA Illimitée & Aveugle)
* **IA Active :**
  * ✅ Elle décroche **TOUT LE TEMPS** (Appels illimités).
  * ✅ Elle prend les réservations et les note dans l'Agenda.
  * ✅ Elle répond aux questions basiques (Horaires, Adresse).
* **Limitations (L'argument de vente) :**
  * ❌ **Pas de Mode 86 (Stock) :** L'IA ne gère pas les ruptures. Elle vend même si le stock est vide.
  * ❌ **Pas de Marketing :** L'IA ne propose jamais de promos spontanément.
  * ❌ **Pas d'Écran Cuisine.**

### 🥈 PLAN PRO (Le Contrôle & La Vente)
* **Tout le Free + :**
  * ✅ **Mode 86 (Stock) :** Bouton ON/OFF dans le menu. Si OFF, l'IA dit "Désolé, c'est en rupture".
  * ✅ **Marketing :** L'IA propose activement les promos définies ("Happy Hour", "Menu Midi").
  * ✅ **Personnalisation :** Voix spécifique et message d'accueil custom.

### 🏆 PLAN ENTERPRISE (L'Indépendance Totale)
* **Tout le Pro + :**
  * ✅ **KDS (Écran Cuisine Temps Réel) :**
    * 🔵 **Bleu :** Sur place.
    * 🟡 **Jaune :** À emporter (Click & Collect téléphone).
    * 🟠 **Orange :** Livraison (Par les livreurs du resto).
  * ✅ **Base de Connaissance Riche :** Allergènes, Parking, Histoire (JSON complet).
  * 🚫 **Pas d'Uber/Deliveroo :** L'IA favorise la commande directe (0% commission).

## 4. DESIGN SYSTEM (AGENCY LOOK)
* **Background :** `#050505` (Noir absolu).
* **Accent Primary :** `#00f2ff` (Cyan - Tech).
* **Accent Alert :** `#ff4d00` (Orange - Action).
* **Composants :** Glassmorphism (`bg-white/5` translucide).
* **Interdictions Visuelles :**
  * Pas de violet.
  * Pas de logos "Retell" ou "Vapi".
  * Pas de mentions "Médical" ou "Juridique".

## 5. RÈGLES MÉTIER SPÉCIFIQUES
1.  **Support Bunker :** Aucun email ou téléphone n'est visible publiquement. Tout passe par l'onglet `/dashboard/support`.
2.  **Appels "Abandon" :** Si le client raccroche vite, le statut est "Abandon", pas "Manqué" (car l'IA décroche toujours).
3.  **Jours Fériés :** Le client peut configurer une fermeture ou un message spécial (ex: Noël) dans les Paramètres.