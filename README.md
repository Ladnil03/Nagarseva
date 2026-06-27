# 🏛️ NagarSeva (नगरसेवा)

NagarSeva is a state-of-the-art **Civic Issue Reporting, AI-Assisted Validation, and Community Resolution Platform** tailored for Indian municipalities. It empowers local citizens to raise, verify, and track public issues (such as potholes, streetlights, garbage, water leakage) transparently while giving municipal authorities an efficient desk to act upon and resolve them with full accountability.

---

## ⚡ Demo Credentials & Quick Access

To allow seamless evaluation and testing, **NagarSeva** comes with pre-configured demo ledgers for both citizens and municipal officers. 

You can use these credentials in the login page or simply click the **"Quick Fill"** buttons available on the portal interface:

### 👤 Citizen Demo Account
*   **Role:** Citizen (Reporting, verifying, earning rewards, tracking local ward health)
*   **Email:** `citizen@nagarseva.org`
*   **Password:** `citizen123`

### 👮 Municipal Officer Demo Account (Admin / Authority)
*   **Role:** Authority / Officer (Managing incoming reports, escalating issues, updating status, civic analytics)
*   **Email:** `officer@nagarseva.gov.in`
*   **Password:** `officer123`

---

## 🌟 Key Platform Features

### 1. 📋 Smart Civic Issue Reporting
*   **Step-by-step wizard** with intuitive field validation.
*   **Local Ward Selector** allowing fine-grained targeting of issues (e.g., *HAL 2nd Stage Ward 142*).
*   **Aesthetic UI & custom-crafted NagarSeva Seal** celebrating Indian civic identities.

### 2. 🗺️ Interactive Live Ward Radar
*   Real-time geospatial map highlighting pending, verified, and resolved grievances.
*   Filterable viewports based on categories (Sanitation, Roads, Electricity, etc.).

### 3. 🛡️ Citizen Verification & Crowdsourced Trust
*   Instead of relying on single reports, citizens can upvote, cross-verify, and validate neighbors' complaints.
*   Maintains a highly reliable **Citizen Trust Registry** to avoid spam.

### 4. 📈 Gamified Citizen Rewards (NagarPoints)
*   Earn **NagarPoints** by submitting valid complaints, verifying neighboring issues, and co-signing resolved items.
*   Unlock civic rank badges as your contribution level increases.

### 5. 👮 Municipal Officer Desk (Admin Control)
*   Central command board listing active grievances.
*   Change statuses in real-time (**Pending** ➔ **Assigned** ➔ **In Progress** ➔ **Resolved**).
*   Add administrative updates and escalation reasons for full public accountability.

---

## 🛠️ Technology Stack

*   **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite 6](https://vite.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (modern, high-contrast palette)
*   **Database & Auth:** [Firebase (Firestore & Authentication)](https://firebase.google.com/) with a built-in **Local Storage fallback** mechanism for offline/offline local sandboxes.
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Maps:** Interactive Leaflet GIS coordinates.

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
If you wish to use live cloud persistent databases and Firebase Auth, copy `.env.example` to `.env` and fill in your keys:
```env
VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT
# ...
```
*Note: If no keys are specified, NagarSeva runs in its elegant Local Storage sandbox mode automatically!*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm start
```

---

*“Towards more accountable, transparent, and beautiful cities.”*  
**NagarSeva Platform Team**
