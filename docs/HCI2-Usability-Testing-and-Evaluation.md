# Human Computer Interaction 2  
## Usability Testing and Evaluation

**Project:** Food Ordering Hermanas — Food Ordering System  
**Subject:** HCI 2 (Usability Testing and Evaluation)  
**Focus:** User-centered design, prototyping, documentation, usability testing, evaluation and improvement (not system development or coding).

---

## Project Objective

To evaluate and improve the existing Food Ordering System using usability testing methods and proper HCI documentation.

---

## Phase 1: Understanding the Proposed System

### 1.1 System Overview

| Item | Description |
|------|-------------|
| **System name** | Food Ordering Hermanas |
| **Brief description** | A web-based food ordering system where customers browse a menu, add items (including half/full tray options and add-ons), place orders, and pay; staff (admin, kitchen, delivery) manage products, orders, and communication. |
| **Target users** | (1) **Guests** — visitors browsing the menu; (2) **Customers** — registered users who place orders; (3) **Admin** — staff managing menu, categories, orders, and forgot-password requests; (4) **Kitchen staff** — staff updating order readiness; (5) **Delivery staff** — staff managing deliveries and marking orders done. |
| **Purpose** | To allow customers to order food (with options like half/full tray and add-ons) and allow the business to manage menu, orders, and internal communication in one place. |
| **Main features** | Browse menu; search products; category filters; product details (recommendations, add-ons, half/full tray, notes); cart (main items vs add-ons, images); checkout (order notes, payment method, reference); forgot password monitoring (proof, status, change password); admin: categories, products, archive, orders, forgot-password requests, chat; kitchen: orders, status, chat; delivery: active deliveries, mark done, history, chat. |

### 1.2 Problem Identification

**Usability problems users might experience**

- **Discoverability:** Add-ons are in a collapsible section under each product; new users may not notice they can add extras.
- **Clarity of pricing:** Half vs full tray and add-on prices can be confusing if not clearly labeled on menu and cart.
- **Workflow length:** Multiple steps (menu → product modal → add-ons → cart → checkout) may feel long for quick orders.
- **Mobile vs desktop:** Layout and touch targets (e.g. quantity, Remove, Add-on toggle) must work well on small screens.
- **Feedback:** Users need clear confirmation when adding to cart, updating quantity, and after placing an order.
- **Error recovery:** Forgot-password flow (proof upload, status check, change password) must be easy to follow and give clear error messages.
- **Staff roles:** Admin, kitchen, and delivery need distinct, consistent navigation and clear labels so they don’t mix up tasks.

**User needs to prioritize**

1. **Customers:** Fast, clear path from “see dish” to “in cart” with correct price (half/full, add-ons); visible cart and clear checkout.
2. **Guests:** Easy browsing and search without account; clear path to register or login when ready to order.
3. **Admin:** Efficient product and category management; easy review of orders and forgot-password requests; reliable chat with staff.
4. **Kitchen/Delivery:** Quick view of relevant orders and one-tap actions (e.g. mark ready, mark done) with minimal confusion.

---

## Phase 2: User-Centered Design Documentation

### 2.1 User Personas (at least 2)

#### Persona 1: Maria — Busy Customer

| Attribute | Detail |
|-----------|--------|
| **Name** | Maria Santos |
| **Age** | 34 |
| **Occupation** | Office worker, orders lunch for the team occasionally |
| **Goals** | Order food quickly, choose half/full tray and add-ons without mistakes, see total before paying, get order confirmation. |
| **Frustrations** | Unclear prices (half vs full), hard-to-find add-ons, slow or confusing checkout, no summary before submitting. |
| **Technical skills** | Uses smartphone daily; comfortable with apps and websites; prefers simple, clear labels and few steps. |

#### Persona 2: Carlo — Kitchen Staff

| Attribute | Detail |
|-----------|--------|
| **Name** | Carlo Reyes |
| **Age** | 28 |
| **Occupation** | Kitchen staff, prepares orders and marks them ready |
| **Goals** | See pending orders at a glance, mark orders ready without errors, get messages from admin or delivery when needed. |
| **Frustrations** | Too many clicks to find “kitchen” tasks, unclear which orders are pending, chat mixed with order list. |
| **Technical skills** | Uses tablet or phone in the kitchen; prefers large buttons and clear “pending” vs “ready” states. |

#### Persona 3 (optional): Admin — Liza

| Attribute | Detail |
|-----------|--------|
| **Name** | Liza Cruz |
| **Age** | 40 |
| **Occupation** | Restaurant manager / admin |
| **Goals** | Update menu and categories, handle orders and forgot-password requests, communicate with kitchen and delivery. |
| **Frustrations** | Too many menus, hard to find “archive” or “forgot password” requests, unclear which orders need action. |
| **Technical skills** | Uses laptop; comfortable with forms and tables; expects consistent navigation. |

### 2.2 User Stories

**Customer**

- As a **customer**, I want to **search the menu by name or description** so that **I can find dishes quickly**.
- As a **customer**, I want to **see product images and half/full tray prices on the menu** so that **I know what I’m ordering and how much it costs**.
- As a **customer**, I want to **add a product with optional half tray and notes** so that **my order matches my preference**.
- As a **customer**, I want to **add add-ons (with half/full when available)** so that **I can order combos or extras in one go**.
- As a **customer**, I want to **see main items and add-ons in separate sections in the cart with images** so that **I can review my order clearly**.
- As a **customer**, I want to **enter order notes and payment reference at checkout** so that **special requests and payment proof are recorded**.
- As a **customer**, I want to **get clear feedback after adding to cart and after placing an order** so that **I’m sure the system received my order**.

**Guest**

- As a **guest**, I want to **browse the menu and search without logging in** so that **I can decide before creating an account**.
- As a **guest**, I want to **see a simple path to register or login** so that **I can place an order when ready**.

**Admin**

- As an **admin**, I want to **manage categories and products (including combo and half tray)** so that **the menu is up to date**.
- As an **admin**, I want to **see forgot-password requests and proof** so that **I can approve or reject fairly**.
- As an **admin**, I want to **chat with kitchen and delivery** so that **we coordinate without leaving the system**.

**Kitchen / Delivery**

- As **kitchen staff**, I want to **see pending orders and mark them ready** so that **delivery knows what to pick up**.
- As **delivery staff**, I want to **see active deliveries and mark them done** so that **orders are closed correctly**.

### 2.3 User Journey Map (Customer: Place an order)

| Step | User action | Thoughts | Emotions | Pain points |
|------|-------------|----------|----------|-------------|
| 1 | Opens site, sees home | “Is this the right place to order?” | Curious, slightly unsure | Hero and “View menu” must be obvious |
| 2 | Clicks “View menu” or “Menu” | “I want to see what’s available.” | Focused | — |
| 3 | Uses search or category filter | “I want adobo / main dishes.” | In control | Search and filters must be visible |
| 4 | Clicks a product card | “What options do I have?” | Interested | — |
| 5 | In modal: chooses half/full, notes, add-ons | “I want half tray and a drink.” | Deciding | Add-ons could be missed if collapsed |
| 6 | Clicks “Add to cart” | “Did it add? What’s my total?” | Expectant | Need clear feedback and cart count |
| 7 | Goes to Cart | “Is everything correct? Main vs add-ons?” | Checking | Sections and images reduce confusion |
| 8 | Clicks “Proceed to checkout” | “I’ll pay and add notes.” | Ready to pay | — |
| 9 | Fills order notes, payment, reference | “I need to put the reference number.” | Careful | Reference field must be obvious for cash/GCash |
| 10 | Places order | “I hope it went through.” | Anxious then relieved | Success message and next steps must be clear |

### 2.4 Task Flow Diagram (Place order — high level)

```
[Start] → [Open site] → [View menu]
    → [Search or filter by category]
    → [Click product]
    → [Product modal: select half/full, notes, add-ons]
    → [Add to cart] → [Feedback: item added]
    → (Repeat for more items?)
    → [Go to Cart]
    → [Review main items & add-ons]
    → [Proceed to checkout]
    → [Enter order notes]
    → [Select payment method]
    → [Enter reference if Cash/GCash]
    → [Place order]
    → [Confirmation]
[End]
```

---

## Phase 3: Prototype / Mockup

### 3.1 Screens to Document (5–7 screens)

The following screens should be reflected in wireframes or mockups and evaluated for HCI principles:

| # | Screen | Purpose | HCI focus |
|---|--------|--------|-----------|
| 1 | **Home (guest)** | Landing: hero, “View menu,” “Sign in,” search, menu preview, Forgot password link | Visibility, simplicity, clear CTAs |
| 2 | **Menu** | List/grid of products, search, category filters, product cards (image, name, price, half/full), collapsible “Add-ons” per product | Consistency, feedback (e.g. “Add-ons (N)”), clarity of pricing |
| 3 | **Product modal** | Detail, image, half/full choice, notes, add-ons list (Half/Full buttons), “Add to cart” with total | Feedback, visibility of options, simplicity |
| 4 | **Cart** | Two sections: “Main items” and “Add-ons,” each with image, name, price, quantity, Remove | Consistency, visibility (images, separation), error prevention |
| 5 | **Checkout** | Order summary, order notes, payment method, reference number, “Place order” | Simplicity, visibility, feedback before submit |
| 6 | **Admin — Products** | List of products, type (Single/Combo), category, price; form for add/edit (name, category, type, included meals for combo, half tray, image) | Consistency, visibility, match to real-world concepts (combo, half tray) |
| 7 | **Kitchen / Delivery** | Order list (pending/ready or active/done), clear actions (e.g. Mark ready, Done), chat entry | Consistency, visibility, minimal steps |

### 3.2 HCI Principles Applied

- **Consistency:** Same header/nav pattern across customer, admin, kitchen, delivery; same button styles and card layout for products.
- **Visibility:** Important actions (Add to cart, Proceed to checkout, Mark ready) visible; cart count and section labels (Main items, Add-ons) clear.
- **Feedback:** Confirmations when adding to cart, after place order; clear success/error messages in forgot-password flow.
- **Simplicity:** Short paths (e.g. menu → product → add to cart); collapsible add-ons to reduce clutter; one primary action per screen where possible.
- **Error prevention:** Cart review before checkout; clear labels for half/full and add-on prices; optional but visible reference for cash/GCash.

---

## Phase 4: Usability Testing

### 4.1 Testing Plan

| Item | Detail |
|------|--------|
| **Participants** | 3–5 users (mix: 2–3 customers, 1 admin/staff, 1 kitchen or delivery if available). |
| **Tasks** | (1) Find a product using search; (2) Add a product with half tray and one add-on to cart; (3) Review cart and go to checkout; (4) Place an order with notes and payment reference; (5) [Staff] Find pending orders and mark one ready or done. |
| **Method** | **Observation** + **Think-aloud**: user performs tasks while verbalizing thoughts; facilitator observes and notes errors, time, confusion, and comments. Optional short **survey** (SUS or custom) after tasks. |
| **Environment** | Quiet room; same device/browser for all (e.g. laptop or phone) or match real use (e.g. phone for customers, tablet for kitchen). |
| **Duration** | ~15–20 minutes per participant. |

### 4.2 Conduct Testing

**What to record**

- **Errors:** Wrong button (e.g. Half vs Full for add-on), forgot to add reference, couldn’t find add-ons or cart.
- **Time:** Time to complete each task (e.g. “Add product with add-on to cart” from opening menu to seeing it in cart).
- **Confusion:** Where they hesitated, asked questions, or said “I don’t know where to…”.
- **Comments:** Quotes about clarity, ease, or frustration (e.g. “I didn’t see add-ons at first.”).

**Example observation sheet (summary row per participant)**

| Participant | Task 1 (search) | Task 2 (add + add-on) | Task 3 (cart → checkout) | Task 4 (place order) | Errors / confusion |
|-------------|-----------------|------------------------|---------------------------|-----------------------|---------------------|
| P1 | 30 s | 1 min 20 s; didn’t open add-ons at first | OK | Forgot reference once | Add-ons not obvious |
| P2 | … | … | … | … | … |

### 4.3 Evaluation & Recommendations

**Typical usability issues to look for**

1. **Add-ons not discovered** — Users don’t expand “Add-ons (N products)” or don’t understand Half/Full for add-ons.  
   **Improvement:** Make the add-on section more visible (e.g. short label “Add extras” or one example); keep Half/Full labels next to prices.  
   **HCI:** Visibility, affordance (collapsible section still looks clickable).

2. **Cart unclear** — Users don’t distinguish main items from add-ons or miss wrong quantity.  
   **Improvement:** Keep separate “Main items” and “Add-ons” sections and show product images; consider a short summary line (“X main, Y add-ons”).  
   **HCI:** Consistency with menu concepts; visibility.

3. **Checkout friction** — Users forget order notes or payment reference.  
   **Improvement:** Clear labels (“Order notes,” “Reference number (Cash/GCash)”); optional placeholder or short hint.  
   **HCI:** Visibility, feedback (e.g. “Reference saved”).

4. **Staff screens** — Kitchen/delivery confuse “pending” vs “ready” or “done.”  
   **Improvement:** Consistent terms and colors (e.g. pending = orange, ready/done = green); one primary action per row.  
   **HCI:** Consistency, simplicity.

5. **Mobile** — Buttons too small or add-on section hard to tap.  
   **Improvement:** Touch-friendly targets (min 44px); ensure collapse/expand works well on touch.  
   **HCI:** Accessibility, consistency across devices.

**How improvements follow HCI principles**

- **Visibility:** Labels, sections, and feedback make system state and next steps obvious.
- **Consistency:** Same patterns (e.g. Main vs Add-ons, Half/Full) from menu to cart to checkout reduce cognitive load.
- **Feedback:** Confirmations and clear messages increase trust and reduce repeated actions.
- **Simplicity:** Fewer steps and clear primary actions make tasks faster and less error-prone.
- **Error prevention:** Clear pricing, review before submit, and optional but visible reference field help avoid mistakes.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | (Your date) | (Your name/group) | Initial HCI 2 usability testing and evaluation document |

---

*This document is for HCI 2 (Usability Testing and Evaluation) and is based on the proposed Food Ordering Hermanas system. It does not replace development documentation but supports user-centered design and usability improvement.*
