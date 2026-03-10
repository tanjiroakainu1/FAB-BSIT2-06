# EmailJS template HTML — Food Ordering Hermanas

Use these in [EmailJS → Email Templates](https://dashboard.emailjs.com/admin/templates).  
**Brand primary red:** `#D32F2F` (from [Brand-Style-Guide.md](./Brand-Style-Guide.md)).

---

## Your EmailJS configuration (for reference)

| Item | Value | Use in |
|------|--------|--------|
| **Public Key** | `c3J0GEK0xVI0MXkz8` | `.env` as `VITE_EMAILJS_PUBLIC_KEY` (frontend only) |
| **Private Key** | `G8cjAOhLdz4yyTx-7nYki` | **Do not use in the app or .env** — server-side only if needed |
| **Service** | Gmail (Gmail_API) | 500 emails/day, personal service |
| **Service ID** | `service_ycweqza` | `.env` as `VITE_EMAILJS_SERVICE_ID` |
| **Connected as** | raminderjangao100@gmail.com | Sends “on your behalf” |

**Send test email** in the EmailJS dashboard to verify configuration before going live.

---

## 1. OTP / One-Time Password (registration verification)

Use this for the **new** [One-Time Password template](https://dashboard.emailjs.com/admin/templates/new). The app sends **`{{email}}`**, **`{{passcode}}`** (the 6-digit OTP), and **`{{time}}`** (valid-until time, 15 minutes from send).

**In EmailJS:** set **To Email** to **`{{email}}`** so the OTP is sent to the address the user entered on the registration form.

**Subject (suggested):** `OTP for your Food Ordering Hermanas authentication`

**Content — paste this into the template:**

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px">
  <a style="text-decoration: none; outline: none" href="#" target="_blank">
    <img style="height: 32px; vertical-align: middle" height="32px" src="cid:logo.png" alt="logo" />
  </a>
  <p style="padding-top: 14px; border-top: 1px solid #eaeaea">
    To authenticate, please use the following One Time Password (OTP):
  </p>
  <p style="font-size: 22px; color: #D32F2F"><strong>{{passcode}}</strong></p>
  <p>This OTP will be valid for 15 minutes till <strong>{{time}}</strong>.</p>
  <p>
    Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this
    email.<br />Food Ordering Hermanas will never contact you about this email or ask for any login codes or
    links. Beware of phishing scams.
  </p>
  <p>Thanks for visiting Food Ordering Hermanas!</p>
</div>
```

**Template variables the app sends:** `email`, `to_email` (recipient), `passcode` (OTP), `time` (e.g. "2:02 AM" = 15 min from send). In the template **Settings**, set **To Email** to **`{{email}}`**.

---

## 2. Welcome (after registration / general welcome)

Paste this into the **Welcome** template editor. Replace `[Website Link]` and `[Company Email]` with your site URL and support email, or use EmailJS variables if you have them.

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="[Website Link]" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="cid:logo.png"
        alt="logo"
      />
    </a>
    <p>Welcome to the Food Ordering Hermanas family! We're excited to have you on board.</p>
    <p>
      Your account has been successfully created, and you're now ready to explore our menu, place orders, and enjoy your favorite dishes.
    </p>
    <p>
      <a
        style="
          display: inline-block;
          text-decoration: none;
          outline: none;
          color: #fff;
          background-color: #D32F2F;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
        "
        href="[Website Link]"
        target="_blank"
      >
        Open Food Ordering Hermanas
      </a>
    </p>
    <p>
      If you have any questions or need help getting started, our support team is just an email away at
      <a href="mailto:[Company Email]" style="text-decoration: none; outline: none; color: #D32F2F; font-weight: 500">[Company Email]</a>.
      We're here to assist you every step of the way!
    </p>
    <p>Best regards,<br />The Food Ordering Hermanas Team</p>
  </div>
</div>
```

**Changes from your original:**
- **Company name:** Food Ordering Hermanas everywhere.
- **Primary red:** `#D32F2F` (brand) instead of `#fc0038` for button and link.
- **Copy:** Short line about menu and orders for a food app.
- **Button:** Slightly larger padding and border-radius; same structure.

Replace in the template:
- `[Website Link]` → e.g. `https://yoursite.com` or your app URL.
- `[Company Email]` → e.g. `support@yourdomain.com` or raminderjangao100@gmail.com.

If you use a logo attachment, keep `cid:logo.png`; otherwise you can remove the `<img>` or use a hosted image URL.

---

## .env (what the app needs)

Create a `.env` in the project root with:

```env
VITE_EMAILJS_PUBLIC_KEY=c3J0GEK0xVI0MXkz8
VITE_EMAILJS_SERVICE_ID=service_ycweqza
VITE_EMAILJS_TEMPLATE_ID=template_dmsxfno
# 2nd OTP – same public key; only Service ID + Template ID differ (Gmail)
VITE_EMAILJS_SERVICE_ID_2=service_eaof3q6
VITE_EMAILJS_TEMPLATE_ID_2=template_lvd4xfi
```

Use your **One-Time Password** template ID (e.g. `template_dmsxfno`). Then run **Send test email** in the dashboard to verify, and restart `npm run dev`. The 2nd OTP uses the same public/private key; only Gmail Service ID `service_eaof3q6` and Template ID `template_lvd4xfi` are different.
