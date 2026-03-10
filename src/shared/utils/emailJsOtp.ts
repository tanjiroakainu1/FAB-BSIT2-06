/**
 * Send OTP email via EmailJS (https://www.emailjs.com/).
 * Configure in dashboard: Email Services, Email Templates (e.g. One-Time Password).
 * Primary: VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID.
 * Optional 2nd (same public key; only Service ID + Template ID differ): VITE_EMAILJS_SERVICE_ID_2, VITE_EMAILJS_TEMPLATE_ID_2 (Gmail: service_eaof3q6, template_lvd4xfi).
 */
import emailjs from '@emailjs/browser'

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined
const SERVICE_ID_2 = import.meta.env.VITE_EMAILJS_SERVICE_ID_2 as string | undefined
const TEMPLATE_ID_2 = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_2 as string | undefined

let initialized = false

function init() {
  if (initialized) return
  if (PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY)
    initialized = true
  }
}

/**
 * Send OTP to the given email. Template can use {{email}}, {{passcode}}, {{time}}, or {{to_email}}/{{otp}}/{{code}}.
 * Returns { ok: true } on success, { ok: false, error } on failure.
 */
export async function sendOtpEmail(toEmail: string, otp: string): Promise<{ ok: boolean; error?: string }> {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    return { ok: false, error: 'OTP is configured for private use. Use the demo account to log in: customer@gmail.com / customer123.' }
  }
  const recipient = toEmail.trim().toLowerCase()
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  init()
  const validUntil = new Date(Date.now() + 15 * 60 * 1000)
  const timeStr = validUntil.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  // Official EmailJS One-Time Password template expects: email, passcode, time.
  // Template Settings → "To Email" in dashboard must be set to {{email}} (or {{to_email}}).
  const templateParams = {
    email: recipient,
    to_email: recipient,
    passcode: otp,
    time: timeStr,
  }
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
    if (SERVICE_ID_2 && TEMPLATE_ID_2) {
      emailjs.send(SERVICE_ID_2, TEMPLATE_ID_2, templateParams).catch((e) => {
        console.warn('Second OTP email (Gmail) send failed:', e)
      })
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'OTP is for private use. Use the demo account to log in: customer@gmail.com / customer123.' }
  }
}
