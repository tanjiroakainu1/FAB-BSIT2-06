# Food Ordering Hermanas

Standalone TypeScript + React + Tailwind food ordering app with **Admin**, **Kitchen**, **Delivery**, and **Customer** areas. All data is stored in the browser (localStorage)—no backend or database required.

## Development team

| Name | Role |
|------|------|
| Andrey Decipulo | Database Manager |
| Joshua Millado | Database Manager |
| Jefferson Llarenas | Project Manager |
| RonaJane Delo Santos | Frontend Developer |
| Raminder Jangao | Backend Developer |

The team credits appear in the footer on all layouts (Customer, Admin, Kitchen, Delivery). Data is defined in `src/shared/constants/team.ts`.

## User stories

See **[USER_STORIES.md](./USER_STORIES.md)** for the full list of user stories (Customer, Kitchen, Delivery, Admin) in table format.

## Getting started

1. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```
2. Open the app in your browser (e.g. http://localhost:5173). Data persists in localStorage for the current browser.

## Auth & navigation

- **Single login** at **`/login`** for all roles:
  - **Admin:** admin@gmail.com / admin123 → `/admin`
  - **Kitchen:** kitchen@gmail.com / kitchen123 → `/kitchen`
  - **Delivery:** deliveryguy@gmail.com / deliveryguy123 → `/delivery`
  - **Customer:** register at `/register` or use an account created by Admin in User management.
- **First visit:** `/` redirects to **`/home`**. Non-users see **Home**, **Login**, **Register**. Customers see **Home**, **Menu**, **Cart**, **Order history**, **Logout**. Admin routes require admin login (redirect to `/login` if not authenticated).
- **Community chat:** Admin, Kitchen, and Delivery share one chat channel. Admin: **`/admin/chat`**. Kitchen: **`/kitchen/chat`**. Delivery: **`/delivery/chat`**. All see the same messages; sender is shown as Admin, Kitchen, or Delivery.

## Stack

- **React 18** + **TypeScript**
- **Vite** for build and dev server
- **Tailwind CSS v4**
- **React Router v6**
- **Theme:** White background with red diamond accents; floating red diamond particles and subtle effects (see `src/index.css` and `ParticlesBackground`).
- **Currency:** Philippine Peso (₱) — all prices use `formatPrice()` from `@shared/utils`.
- **Seed data:** On first load (or empty storage), the app loads sample categories and menu items (e.g. Chicken Adobo, Halo-Halo, Lumpia) with open-source product images (Unsplash). All data is stored in localStorage.

## Structure

```
src/
├── admin/
│   ├── AdminLayout.tsx
│   ├── routes.tsx
│   └── pages/
│       ├── AdminDashboard.tsx
│       ├── AdminCategories.tsx
│       ├── AdminProducts.tsx
│       ├── AdminOrders.tsx
│       ├── AdminUserManagement.tsx
│       └── AdminChat.tsx
│   └── system-charts/
├── kitchen/
│   ├── KitchenLayout.tsx
│   ├── routes.tsx
│   ├── pages/
│   │   ├── KitchenOrders.tsx
│   │   └── KitchenChat.tsx
│   └── system-charts/
├── delivery/
│   ├── DeliveryLayout.tsx
│   ├── routes.tsx
│   ├── pages/
│   │   ├── DeliveryOrders.tsx
│   │   └── DeliveryChat.tsx
│   └── system-charts/
├── customer/
│   ├── CustomerLayout.tsx
│   ├── routes.tsx
│   └── pages/
│       ├── HomePage.tsx
│       ├── MenuPage.tsx
│       ├── CartPage.tsx
│       ├── CheckoutPage.tsx
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
│   └── system-charts/
├── shared/
│   ├── constants/
│   │   └── team.ts
│   ├── types/index.ts
│   ├── utils/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── AppDataContext.tsx
│   │   ├── CartContext.tsx
│   │   └── index.ts
│   └── components/
├── App.tsx
├── main.tsx
└── index.css
```

## Path aliases

- `@/*` → `src/*`
- `@admin/*` → `src/admin/*`
- `@customer/*` → `src/customer/*`
- `@shared/*` → `src/shared/*`

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Admin features

- **Category management** (`/admin/categories`): Add, edit, and delete categories.
- **Product management** (`/admin/products`): Add, edit, delete products; set **available** or **not available**.
- **Orders** (`/admin/orders`): View all orders (search by ID, customer name, email). Update order status, payment status, and delivery status.
- **User management** (`/admin/users`): Add Kitchen and Delivery users (stored locally). These users can log in with the credentials you set.

## Customer checkout

- **Checkout:** Payment method (Cash/GCash), delivery option (Delivery/Pickup), contact number, delivery address, event type. All stored in localStorage and visible in admin orders and customer order history.

## Routes

- **Default:** `/` → redirects to `/home`.
- **Public:** `/home`, `/login`, `/register`.
- **Customer (login required):** `/menu`, `/cart`, `/checkout`, `/orders`, `/system-charts`.
- **Admin (login required):** `/admin`, `/admin/categories`, `/admin/products`, `/admin/orders`, `/admin/users`, `/admin/chat`, `/admin/system-charts`.
- **Kitchen / Delivery:** `/kitchen/system-charts`, `/delivery/system-charts` (System Charts page for each role).
