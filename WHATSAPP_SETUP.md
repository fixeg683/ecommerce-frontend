# WhatsApp customer messaging setup

The storefront now has a floating **WhatsApp us** button, and product pages include a product-specific enquiry button. Both open WhatsApp with a pre-filled message; customers review and send it themselves.

## Configure the store's WhatsApp number

1. In your frontend hosting dashboard (for example, Vercel), open the project settings and add an environment variable:
   - **Name:** `VITE_WHATSAPP_NUMBER`
   - **Value:** your business WhatsApp number in international format, digits only (Kenya example format: `2547XXXXXXXX`). Do not include `+`, spaces, or hyphens.
2. Redeploy the frontend after saving the variable. Vite environment variables are embedded during the build.
3. Test the floating button on the homepage and the product enquiry button on a product detail page, on both desktop and mobile.

If the variable is missing, the general button opens WhatsApp's share/chat chooser with the message, but it will not target the business directly. Set the business number before publishing.

## What this integration does

- Uses WhatsApp's click-to-chat link; no WhatsApp API credentials or backend endpoint are required.
- Pre-fills a general support message from the floating button.
- Pre-fills a product name and displayed price from product detail pages.
- Does not send messages automatically or expose customer messages to the site backend.

For automated messaging, message templates, delivery webhooks, or shared team inbox integration, use the official WhatsApp Business Platform separately.
