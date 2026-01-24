# 🌌 CONTEXT.md - ARCHITECTURE "RECEPTION AI" (VERSION GOLD)

> **RÈGLE SUPRÊME :** Ce fichier est la source de vérité absolue. Respecte scrupuleusement les routes, les couleurs et les fonctionnalités par plan.

---

## 1. 🔐 IDENTIFIANTS & ACCÈS

Ces comptes sont les seuls autorisés pour la démonstration et l'administration.

### 👑 SUPER ADMIN (Toi)
- **Email :** `rayanebendaho0@gmail.com`
- **Password :** `rayane2008.`
- **Rôle :** Accès total, Gestion des Clients, Vue "Inbox Support".

### 🏛️ CLIENT DEMO (Fouquet's)
- **Email :** `contact@fouquets-paris.fr`
- **Password :** `rayane2008.`
- **Plan :** ENTERPRISE (KDS + Omnicanal activés).

---

## 2. 🗺️ STRUCTURE DES ROUTES (SITEMAP)

### 📱 Landing Page (Public)
| Route | Description |
|-------|-------------|
| `/` | Page d'accueil (Hero, Features, PAS de prix affichés). |
| `/login` | Connexion client. |
| `/contact` | Formulaire Support Uniquement (Envoie vers `support_tickets`). Aucune info de contact visible. |
| `/legal/*` | Mentions légales & Confidentialité. |

### 🎛️ Dashboard Client (`/dashboard/*`)
| Route | Description | Plan |
|-------|-------------|------|
| `/dashboard` | Vue d'ensemble (Live Feed, Stats rapides). | Tous |
| `/dashboard/agenda` | Calendrier (Vue Jour/Semaine, Ajout manuel). | Tous |
| `/dashboard/menu` | La Carte (CRUD Complet : Ajouter/Modifier/Supprimer/Stock 86). | Tous |
| `/dashboard/calls` | Journal (Historique simple : Appelant, Heure, Statut). | Tous |
| `/dashboard/promos` | Marketing (Créer/Activer des offres). | PRO+ |
| `/dashboard/kitchen` | KDS Cuisine (Écran temps réel 🔵🟡🟠). | ENTERPRISE |
| `/dashboard/settings` | Paramètres (Horaires, Infos, Bouton "Demande Support"). | Tous |

### 👑 Admin Panel (`/admin/*`)
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard global. |
| `/admin/tickets` | Inbox Support (Centralisation de toutes les demandes). |
| `/admin/clients` | Gestion des comptes restaurants (Tenants). |

---

## 3. 🎨 DESIGN SYSTEM (AGENCY LOOK)

| Élément | Valeur |
|---------|--------|
| **Background** | `#050505` (Noir absolu, pas de gris). |
| **Accent Primary** | `#00f2ff` (Neon Blue - Pour la Tech/Action). |
| **Accent Alert** | `#ff4d00` (Sunset Orange - Pour la Cuisine/Alertes). |
| **Composants** | Glassmorphism obligatoire (`bg-white/5 backdrop-blur-md border-white/10`). |
| **Icônes** | Lucide-React uniquement. |

---

## 4. FONCTIONNALITÉS PAR PLAN (MATRICE)

| Fonctionnalité | 🐣 FREE | 🥈 PRO | 🏆 ENTERPRISE |
|----------------|---------|--------|---------------|
| Accès Dashboard | ✅ | ✅ | ✅ |
| Agenda & Menu | ✅ | ✅ | ✅ |
| Mode 86 (Stock) | ❌ (Inactif) | ✅ (Actif) | ✅ (Actif) |
| Marketing (Promos) | ❌ | ✅ | ✅ |
| KDS (Écran Cuisine) | ❌ | ❌ | ✅ |
| Support | Ticket Standard | Ticket Prioritaire | Account Manager |

---

## 5. RÈGLES MÉTIER SPÉCIFIQUES

- **Support Bunker :** Aucun email ou téléphone n'est visible publiquement. Tout passe par la table `support_tickets`.
- **KDS Colors :**
  - 🔵 Bleu : Sur place.
  - 🟡 Jaune : À emporter.
  - 🟠 Orange : Livraison.
- **Menu Autonome :** Le client a un CRUD complet sur ses plats. Il ne doit pas contacter le support pour changer un prix.