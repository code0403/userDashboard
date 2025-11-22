# User Dashboard

A responsive and stylish **User Dashboard** built with **Next.js**, **Tailwind CSS**, **React Query**, and **Zustand**. This project allows you to **view, add, edit, and delete users**, along with a **dynamic activity log** and **dark/light mode toggle**.

---

## 🔗 Live Demo

- [Deployed Version](https://tinylink-pink.vercel.app)
- Local Development: `http://localhost:3000`

---

## 🛠 Tech Stack

- **Frontend:** Next.js 13 (App Router)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Data Fetching / Caching:** React Query
- **UI Components:** Radix UI (Dialog, AlertDialog, Switch, Select)
- **API:** Mock API via Axios

---

## 🌟 Features

### User Management

- View all users in a sortable and filterable table
- Add new users
- Edit existing users
- Delete users with confirmation
- Navigate to **User Detail Page** by clicking on a row
  - Shows Name, Email, Phone, Company, and Full Address

### Dark / Light Mode

- Toggle between dark and light themes globally
- Fully responsive with Tailwind dark mode (`class` strategy)

### Activity Log (Bonus Feature)

- Tracks **add, edit, delete** actions
- Accessible via an icon in the Navbar
- Slide-in sidebar with reverse chronological log
- Persisted across navigation using Zustand

---

## 🖥 Project Structure


app/
├─ components/
│ ├─ Navbar.tsx
│ ├─ Table.tsx
│ ├─ UserForm.tsx
│ ├─ DeleteDialog.tsx
│ └─ ActivitySidebar.tsx
├─ lib/
│ ├─ api.ts
│ ├─ store.ts
│ └─ types.ts
├─ users/
│ └─ [id]/page.tsx # Dynamic route for user details
├─ globals.css
└─ page.tsx # Main dashboar


---
## ⚡ How It Works

1. **Main Dashboard**
   - Lists all users in a table
   - Search by name, filter by company, sort by email
   - Click a row to go to `/users/[id]`

2. **User Detail Page**
   - Dynamic route using `Next.js App Router`
   - Fetches user data via React Query
   - Displays all user details

3. **Add/Edit User**
   - Modal form using Radix Dialog
   - Validates input fields
   - Updates the activity log automatically

4. **Delete User**
   - AlertDialog confirmation
   - Updates the activity log automatically

5. **Activity Log Sidebar**
   - Toggle via Navbar icon
   - Shows add/edit/delete actions with timestamps
   - Dark/light mode compatible

6. **Dark/Light Mode Toggle**
   - Switch in Navbar
   - Updates UI colors conditionally using Tailwind's `dark:` classes
---
## 💻 Installation

```bash
# Clone the repo
git clone <repo-url>
cd user-dashboard

# Install dependencies
npm install

# Run locally
npm run dev
```
