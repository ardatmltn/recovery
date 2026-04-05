# Adversarial Code Review Report

## Scope

Repo-wide adversarial review of the current Recoverly codebase, with emphasis on:

- auth and session handling
- Iyzico webhook processing
- multi-tenant boundaries
- n8n workflow correctness
- dashboard/settings behavior
- recent pricing page change

## Findings

### 1. [P1] Webhook route accepts unsigned requests and still creates payment events

- File: `src/app/api/webhook/iyzico/route.ts:41-56`

#### Problem

Webhook signature validation only runs when a signature is present:

- `const receivedSignature = request.headers.get('x-iyz-signature') ?? payload.token ?? ''`
- `if (receivedSignature && secretKey) { ...verify... }`

If the request arrives without `x-iyz-signature` and without `payload.token`, the route skips verification entirely and continues processing the event.

#### Impact

An attacker can send arbitrary failed-payment payloads and make the app:

- create customers
- create payment events
- trigger recovery workflows

This is a direct trust-boundary failure on a public webhook endpoint.

#### Recommendation

Reject the request unless a valid signature is present. Missing signature should return `400`, not silently bypass verification.

---

### 2. [P1] Multi-tenant Iyzico secrets saved in the dashboard are ignored during webhook verification

- Files:
  - `src/app/actions.ts:37-58`
  - `src/app/api/webhook/iyzico/route.ts:42-55`

#### Problem

Organizations save their own Iyzico credentials into the `organizations` table, but the webhook route verifies every incoming webhook with the single global environment variable `process.env.IYZICO_SECRET_KEY`.

That means verification is not using the tenant's stored secret at all.

#### Impact

In a real multi-tenant deployment:

- only the merchant that matches the global env secret can verify successfully
- all other tenants' legitimate webhooks will fail verification
- the integration settings page gives a false sense that per-org credentials are actually in use

This breaks the product's core multi-tenant payment ingestion model.

#### Recommendation

Look up the organization by merchant identifier first, then verify the signature against that org's stored secret.

---

### 3. [P1] Tenant-specific n8n webhook URLs are never used; the app always triggers the global env URL

- Files:
  - `src/app/actions.ts:86-96`
  - `src/app/api/webhook/iyzico/route.ts:153-168`

#### Problem

The dashboard stores `organizations.n8n_webhook_url`, but the webhook route does not read it. Instead it always sends recovery events to `process.env.N8N_WEBHOOK_URL`.

So the per-tenant integration setting is effectively ignored.

#### Impact

In a multi-tenant or customer-hosted automation model:

- tenant-specific automation endpoints never receive events
- all events get routed to one global endpoint instead
- integrations page behavior does not match runtime behavior

This is both a functional bug and an architecture violation for tenant isolation.

#### Recommendation

Fetch and use the matched organization's stored `n8n_webhook_url` when dispatching the recovery trigger.

---

### 4. [P1] Scheduled executor routes recovery attempts to the wrong workflow

- File: `n8n/workflows/03-scheduled-executor.json:25-69`

#### Problem

The `Route by Type` switch checks only whether `type === "auto_retry"`, but its outputs are wired like this:

- output 1 -> `Trigger Email Sender`
- output 2 -> `Trigger SMS Sender`

As written, `auto_retry` attempts are sent to the email workflow, and non-matching attempts fall through to the SMS workflow.

That means normal email attempts are not routed to the email sender at all.

#### Impact

The recovery engine will execute the wrong channel logic:

- auto-retry attempts can be misrouted into email sending
- email attempts can be misrouted into SMS sending
- attempts can fail unexpectedly because required fields for the chosen channel do not exist

This breaks the core recovery orchestration path.

#### Recommendation

Route explicitly by all supported types:

- `auto_retry` -> retry handler
- `email` -> email workflow
- `sms` -> SMS workflow

Do not rely on a one-condition switch with a default branch for business-critical channel selection.

---

### 5. [P1] Notification settings forms overwrite each other's fields

- Files:
  - `src/app/dashboard/settings/notifications/page.tsx:30-80`
  - `src/app/actions.ts:141-156`

#### Problem

There are two separate forms on the page:

- one for email/slack-related toggles and notification email
- one for Slack webhook only

But both post to the same `saveNotificationSettings` action, which performs a full upsert and sets every field from `formData`.

For fields that are not included in the submitted form, the action writes fallback values:

- missing switches become `false`
- missing text inputs become `null`

#### Impact

Saving one section silently clears the other section.

Examples:

- saving Slack webhook turns all email toggles off and clears `notification_email`
- saving email preferences clears `slack_webhook_url`

This is a destructive settings bug and will be very confusing in production.

#### Recommendation

Either:

1. split the action into separate partial-update actions, or
2. load the current row first and merge only the submitted fields

---

### 6. [P2] Pricing plan selection is mouse-only and no longer keyboard/screen-reader accessible

- File: `src/app/(marketing)/pricing/page.tsx:162-165`

#### Problem

The pricing cards became clickable via `onClick`, but they are still plain `div` elements with:

- no button/radio semantics
- no keyboard support
- no selected-state accessibility metadata

#### Impact

Keyboard users and assistive-technology users cannot change the selected plan, even though the selected state now drives:

- shader focus position
- selected card emphasis
- CTA styling

This is a real interaction regression, not just a polish issue.

#### Recommendation

Use semantic buttons or a proper radio-group pattern with keyboard support and selected-state ARIA.

## Additional Notes

### Static verification

`npm run lint` is currently not usable as configured in this environment. Running it resolves to:

- `Invalid project directory provided, no such directory: ...\\recoverly\\lint`

Direct ESLint execution on `src` produced additional lint issues:

- `src/app/(marketing)/page.tsx:5` unused `Check` import
- `src/app/dashboard/page.tsx:123` unescaped apostrophes
- `src/components/dashboard/setup-guide.tsx:5` unused `Circle` import
- `src/components/marketing/language-switcher.tsx:26` raw `<img>` warning
- `src/components/ui/glowy-waves-hero-shadcnui.tsx:133` unused-expression lint error

These are mostly lower-priority cleanup items, but the broken `npm run lint` script is a tooling gap worth fixing so CI and local verification are trustworthy.

## Summary

The most serious problems are concentrated in the core payment-recovery path:

- webhook authentication can be bypassed when signature data is missing
- webhook verification and automation dispatch do not actually honor tenant-specific configuration
- scheduled recovery attempts are routed to the wrong workflow
- notification settings overwrite each other destructively

Separately, the pricing page change introduced an accessibility regression in plan selection.
