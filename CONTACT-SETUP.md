# Contact form: EmailJS + Google Form setup (no credit card, no Google Cloud Console)

The contact form on `contact.html` runs entirely in the browser — no
serverless function, no billing, no cloud console. It does two things on
submit:

1. Sends two emails via **EmailJS** — one to you with the message, one
   auto-reply to whoever filled out the form.
2. Logs the submission as a new row in a **Google Sheet**, via a normal
   Google Form's submit endpoint (no API key needed).

Both run independently. All the IDs go into [script.js](script.js) near the
top, in the `CONTACT_CONFIG` object.

---

## 1. EmailJS (both emails)

1. Sign up free at [emailjs.com](https://www.emailjs.com/) — email/Google
   login only, no card.
2. **Email Services → Add New Service** → choose Gmail (or Outlook/other) →
   connect your own inbox via OAuth. Copy the **Service ID**.
3. **Account → General** → copy your **Public Key**.
4. **Email Templates → Create New Template** — make two templates:
   - **Owner notification** (sent to you): use variables `{{from_name}}`,
     `{{from_email}}`, `{{message}}` in the body, and set the template's
     "To email" field to your own address (e.g.
     `clarklindleysuan@gmail.com`). Copy this template's **Template ID**.
   - **Auto-reply** (sent to the visitor): use variables `{{to_name}}`,
     `{{message}}`, and set "To email" to `{{to_email}}` so it goes back to
     whoever submitted the form. Copy its **Template ID**.
5. Free tier: 200 emails/month, no card required.

## 2. Google Form (the spreadsheet log)

1. Go to [forms.google.com](https://forms.google.com) → create a new form
   with three short-answer questions, in this order: **Name**, **Email**,
   **Message**.
2. Click the **Responses** tab → the green Sheets icon → **Create a new
   spreadsheet**. Every submission will now land there automatically.
3. Get the form's submit URL and field IDs:
   - Open the live form (**Send → link icon**), open it in a new tab.
   - Right-click → **View Page Source** (or press `Ctrl+U`).
   - Search for `"FB_PUBLIC_LOAD_DATA_"` — inside it, each question has an
     `entry.XXXXXXXXX` number. Match them in order to Name / Email / Message.
     (Simpler alternative: fill out the live form once with placeholder
     text, hit Submit, then check your browser's Network tab for the POST
     request to `formResponse` — its form-data payload shows each
     `entry.XXXXXXXXX` key next to the value you typed.)
   - The submit URL is the same page's URL with `/viewform` replaced by
     `/formResponse`.

## 3. Fill in `script.js`

Open [script.js](script.js) — near the top there's:

```js
const CONTACT_CONFIG = {
  emailjs: {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    ownerTemplateId: "YOUR_EMAILJS_OWNER_TEMPLATE_ID",
    autoreplyTemplateId: "YOUR_EMAILJS_AUTOREPLY_TEMPLATE_ID",
  },
  googleForm: {
    actionUrl: "YOUR_GOOGLE_FORM_RESPONSE_URL",
    nameField: "YOUR_NAME_ENTRY_ID",
    emailField: "YOUR_EMAIL_ENTRY_ID",
    messageField: "YOUR_MESSAGE_ENTRY_ID",
  },
};
```

Replace each `YOUR_...` placeholder with the real values from steps 1–2.
`nameField` etc. should look like `entry.123456789`.

Until these are filled in, the form runs in demo mode (shows a friendly
message but doesn't actually send anything) — same as before.

## 4. Test it

Submit the form on the live site and check:
- A new row appears in the linked Google Sheet.
- You receive the notification email.
- The address you typed receives the auto-reply.

If the auto-reply doesn't arrive, double check the auto-reply template's
"To email" field is set to `{{to_email}}`, not a fixed address.
