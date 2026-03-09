# Use Case Diagram Prompt for Food Ordering System

Copy the text below and paste it into Gemini (or another AI) to generate a use case diagram for our Food Ordering System.

---

## Prompt text (copy from here)

Create a **Use Case Diagram** for a **Food Ordering System** with the following specification.

### System boundary
- One large rectangle enclosing all use cases, labeled **"Food Ordering System"**.

### Actors
1. **Guest** (or **Non-user**) — visitor who is not logged in.
2. **Customer** — logged-in customer (you can show a generalization: Customer extends Guest if they share some use cases).
3. **Admin** — administrator (staff).
4. **Kitchen Staff** — kitchen role.
5. **Delivery Staff** — delivery role.

*(Optional: you can add **System** or **Database** as an actor if the diagram shows system-level use cases like "Persist order" or "Load menu".)*

### Use cases (by actor)

**Guest / Non-user**
- View home
- Browse menu
- Search products (by name or description)
- Forgot password monitoring (enter email, optionally submit proof, check request status, change password after approval)
- Login
- Register

**Customer** (inherits or also has: View home, Browse menu, Search products, Login)
- Authenticate (login / logout)
- View product details (modal with recommendations and add-ons)
- Add to cart (with optional half/full tray and notes)
- Add add-ons to cart (with half/full tray when product allows)
- View cart
- Checkout (order notes, payment method, payment reference e.g. cash/GCash)
- Place order

**Admin**
- Authenticate
- Manage categories (add, edit, delete)
- Manage products (add, edit, delete/archive, restore from archive; set product type single/combo and half tray option)
- Manage archive (restore product, permanently delete)
- Manage orders (view, update status, payment status, delivery status, called status, kitchen status)
- Manage forgot password requests (view list, view proof of ownership, approve, reject)
- Chat (group chat and direct chat with kitchen and delivery staff)
- View dashboard / reports

**Kitchen Staff**
- Authenticate
- View kitchen orders
- Update kitchen status (mark order ready)
- Chat (with admin, group chat)

**Delivery Staff**
- Authenticate
- View active deliveries
- Mark order done (delivered or picked up)
- View delivery history
- Chat (with admin, group chat)

### Relationships to show (optional)
- **Include:** e.g. "Place order" <<include>> "Checkout"; "Checkout" <<include>> "View cart".
- **Extend:** e.g. "Add to cart" <<extend>> "Choose half or full tray" when product supports it.
- **Generalization:** Customer —|> Guest (if Guest is the base actor).

Use standard UML use case diagram notation: stick figures for actors, ovals for use cases, system boundary rectangle, and arrows for include/extend/generalization as needed.

---

## End of prompt

---

## Short version (single copy-paste for Gemini)

```
Create a Use Case Diagram for a "Food Ordering System".

Actors: Guest (non-logged-in), Customer (logged-in), Admin, Kitchen Staff, Delivery Staff.

Use cases:
- Guest: View home, Browse menu, Search products, Forgot password monitoring, Login, Register.
- Customer: Authenticate, View product details, Add to cart (half/full tray, notes), Add add-ons (half/full when available), View cart, Checkout, Place order.
- Admin: Authenticate, Manage categories, Manage products (add/edit/archive/restore, single/combo, half tray), Manage archive, Manage orders, Manage forgot password requests (view, approve, reject), Chat (group + direct), View dashboard.
- Kitchen Staff: Authenticate, View kitchen orders, Update kitchen status, Chat.
- Delivery Staff: Authenticate, View active deliveries, Mark order done, View delivery history, Chat.

Show system boundary "Food Ordering System" around all use cases. Use UML notation: actors as stick figures, use cases as ovals, include/extend/generalization where appropriate.
```
