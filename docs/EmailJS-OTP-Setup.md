# EmailJS OTP setup for registration (email confirmation)

This app sends a **6-digit OTP** to the user’s email when they register. The user must enter the OTP to confirm their email and complete registration.

---

## 1. EmailJS dashboard

- **Dashboard:** [https://dashboard.emailjs.com](https://dashboard.emailjs.com)
- **Email History:** [https://dashboard.emailjs.com/admin/history](https://dashboard.emailjs.com/admin/history)

Use the **left sidebar** to configure **Email Services** and **Email Templates**.

---

## 2. Email Service (how emails are sent)

1. Go to **Email Services** in the sidebar.
2. Click **Add New Service**.
3. Choose a provider (e.g. **Gmail**) and connect your account so EmailJS can send from your email.
4. After saving, copy the **Service ID** (e.g. `service_xxxxx`). You will need it for `.env`.

---

## 3. Email Template (OTP content)

1. Go to **Email Templates** in the sidebar.
2. Click **Create New Template** (or use the **One-Time Password** template if available).
3. Set:
   - **To Email:** set to **`{{email}}`** (required). The app sends the user’s email in this variable. If this is wrong or empty, you’ll see “The recipients address is corrupted”.
   - **Subject:** e.g. `Your verification code - Food Ordering Hermanas`
   - **Content (Body):** use `{{passcode}}` for the 6-digit OTP and `{{time}}` for expiry, e.g.  
     `Your verification code is: {{passcode}}` (valid until {{time}}).
4. The app sends these template variables:
   - `email` / `to_email` — recipient address (use **To Email** = `{{email}}`)
   - `passcode` — 6-digit OTP
   - `time` — when the OTP expires (e.g. "2:30 PM")
5. After saving, copy the **Template ID** (e.g. `template_xxxxx`). You will need it for `.env`.

---

## 4. Public key (and private key)

- **Public key** is used in the **browser** (this app). Find it in **Account** → **General** (or where your API keys are shown).
- **Private key** must **not** be used in the frontend. Use it only in a secure server if you ever send email from the backend.

---

## 5. Environment variables (this project)

Create a `.env` file in the project root (same folder as `package.json`):

```env
# EmailJS – OTP for registration (email confirmation)
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

Replace:

- `your_public_key_here` — your EmailJS **public key** (from Account in the dashboard). Example: `c3J0GEK0xVI0MXkz8`.
- `your_service_id_here` — **Service ID** from step 2 (e.g. `service_xxxxx`).
- `your_template_id_here` — **Template ID** from step 3 (e.g. `template_xxxxx`).

**Important:** Use only the **public key** in the app. Do not put the private key in `.env` or in the frontend.

**Optional – second OTP destination:** Same **public key and private key**; only the 2nd **Service ID** and **Template ID** are different. To have the same OTP also sent to the second email service (Gmail), add:

```env
VITE_EMAILJS_SERVICE_ID_2=service_eaof3q6
VITE_EMAILJS_TEMPLATE_ID_2=template_lvd4xfi
```

- **Gmail Service ID:** `service_eaof3q6`
- **One-Time Password Template ID:** `template_lvd4xfi`

The default config above is used first; if the 2nd service and template IDs are set, the same OTP is sent there too. Do not remove the default keys.

Restart the dev server (`npm run dev`) after changing `.env`.

**Your configuration:**

- **Public Key:** `c3J0GEK0xVI0MXkz8` (use in `.env` only; never commit private key to the app).
- **Private Key:** `G8cjAOhLdz4yyTx-7nYki` — **do not** put this in `.env` or in the frontend; use only on a secure server if needed.
- **Service:** Gmail (Gmail_API), 500 emails/day, connected as raminderjangao100@gmail.com.
- **Service ID:** `service_ycweqza`.

**Example `.env`:**

```env
VITE_EMAILJS_PUBLIC_KEY=c3J0GEK0xVI0MXkz8
VITE_EMAILJS_SERVICE_ID=service_ycweqza
VITE_EMAILJS_TEMPLATE_ID=your_otp_template_id
```

Replace `your_otp_template_id` with the **Template ID** from the **One-Time Password** template in EmailJS (e.g. `template_xxxxx`). Use **Send test email** in the dashboard to verify.

---

## 6. Flow in the app

1. User fills **Full name**, **Email**, **Password** and clicks **Register & send OTP**.
2. App generates a 6-digit OTP and sends it to the given email via EmailJS (using your template).
3. User sees: *“We sent a 6-digit verification code to your@email.com”* and an input for the code.
4. User enters the OTP and clicks **Confirm & register**.
5. If the OTP matches, the account is created and the success popup is shown; user can then log in.

If EmailJS is not configured (missing env vars), the app shows an error asking you to set `VITE_EMAILJS_*` in `.env`.

---

## 6.1. "The recipients address is corrupted"

This error means EmailJS didn’t get a valid **To** address. Fix it in the template:

1. Open **Email Templates** → your **One-Time Password** template (e.g. `template_dmsxfno`).
2. In the right-hand **Settings** panel, find **To Email**.
3. Set **To Email** to exactly **`{{email}}`** (double curly braces, no spaces). The app sends the recipient in the `email` and `to_email` variables.
4. Save the template.

If **To Email** is empty, a literal address, or a variable name the app doesn’t send, you’ll see this error. After setting it to `{{email}}`, try **Register & send OTP** again. The app also shows a short hint when this error occurs.

---

## 7. Optional: `.env.example`

You can add a `.env.example` (without real keys) and commit it so others know which variables to set:

```env
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
# Optional 2nd OTP (Gmail): VITE_EMAILJS_SERVICE_ID_2=service_eaof3q6, VITE_EMAILJS_TEMPLATE_ID_2=template_lvd4xfi
```

Do **not** commit `.env` (it should be in `.gitignore`) so your real keys stay private.

---

## 8. Ready-made template HTML

See **[EmailJS-Template-HTML.md](./EmailJS-Template-HTML.md)** for copy-paste HTML for:
- **OTP / One-Time Password** — verification code email (uses `{{otp}}`, `{{to_email}}`), branded for Food Ordering Hermanas.
- **Welcome** — welcome email with brand primary color `#D32F2F` and company name.
