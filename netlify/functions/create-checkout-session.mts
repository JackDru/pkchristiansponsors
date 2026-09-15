import type { Context, Config } from "@netlify/functions";

// Creates a Stripe Checkout Session for an arbitrary donor-chosen amount
// (one-time or monthly) and returns the hosted checkout URL to redirect to.
// Requires STRIPE_SECRET_KEY to be set as a Netlify environment variable.

export default async (req: Request, context: Context) => {
  var isDebug = new URL(req.url).searchParams.get("debug") === "1";

  if (req.method !== "POST" && !isDebug) {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (isDebug) {
    return new Response(JSON.stringify({
      viaNetlifyEnv: !!Netlify.env.get("STRIPE_SECRET_KEY"),
      viaContextEnv: !!context.env?.get?.("STRIPE_SECRET_KEY"),
      viaProcessEnv: !!process.env.STRIPE_SECRET_KEY,
      allEnvKeysContainingStripe: Object.keys(process.env).filter(function (k) { return k.toUpperCase().indexOf("STRIPE") !== -1; }),
      totalProcessEnvKeyCount: Object.keys(process.env).length,
      netlifyAutoVars: {
        URL: Netlify.env.get("URL") || process.env.URL || null,
        DEPLOY_ID: Netlify.env.get("DEPLOY_ID") || process.env.DEPLOY_ID || null,
        CONTEXT: Netlify.env.get("CONTEXT") || process.env.CONTEXT || null,
        SITE_NAME: Netlify.env.get("SITE_NAME") || process.env.SITE_NAME || null,
      },
      sampleProcessEnvKeys: Object.keys(process.env).slice(0, 20),
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  let body: { amount?: unknown; frequency?: unknown; items?: unknown; email?: unknown; name?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const amount = Number(body.amount);
  const isMonthly = body.frequency === "monthly";
  const items = typeof body.items === "string" ? body.items.slice(0, 300) : "";
  const email = typeof body.email === "string" ? body.email.slice(0, 320) : "";
  const name = typeof body.name === "string" ? body.name.slice(0, 200) : "";

  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
    return new Response(JSON.stringify({ error: "Please enter an amount between $1 and $100,000." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const secretKey = Netlify.env.get("STRIPE_SECRET_KEY") || context.env?.get?.("STRIPE_SECRET_KEY") || process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return new Response(JSON.stringify({ error: "Payments are not configured yet. Please try again later." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const siteUrl = Netlify.env.get("URL") || new URL(req.url).origin;
  const unitAmountCents = Math.round(amount * 100);
  const productName = isMonthly
    ? "PK Christian Sponsors — Monthly Sponsorship"
    : "PK Christian Sponsors — One-Time Gift";

  const params = new URLSearchParams();
  params.set("mode", isMonthly ? "subscription" : "payment");
  params.set("success_url", `${siteUrl}/thank-you.html?donated=1&amount=${encodeURIComponent(String(amount))}`);
  params.set("cancel_url", `${siteUrl}/donate.html`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(unitAmountCents));
  params.set("line_items[0][price_data][product_data][name]", productName);
  if (items) {
    params.set("line_items[0][price_data][product_data][description]", items);
  }
  if (isMonthly) {
    params.set("line_items[0][price_data][recurring][interval]", "month");
  } else {
    // submit_type is only valid in payment mode
    params.set("submit_type", "donate");
  }
  if (email) {
    params.set("customer_email", email);
  }
  if (items) {
    params.set("metadata[items]", items);
  }
  if (name) {
    params.set("metadata[donor_name]", name);
  }

  let stripeRes: Response;
  try {
    stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not reach Stripe. Please try again." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = await stripeRes.json();

  if (!stripeRes.ok) {
    return new Response(JSON.stringify({ error: session?.error?.message || "Stripe declined the request." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/create-checkout-session",
};
