# Architecture Notes

## Product Boundary

Qtcr Shopifyer Genesis Shopify is the concierge layer for U.S.-to-Costa-Rica shopping requests. It should help a shopper submit a product URL, screenshot, or plain-language request, then turn that input into a verified shopping brief and quote workflow.

Shopify remains the future system of record for customer account, cart, checkout, payments, and transactional order records. This application should avoid duplicating Shopify-owned capabilities.

## Frontend

Location: `frontend/`

The current frontend is a dependency-light static prototype. It emphasizes:

- A premium editorial brand surface without turning the app into a marketing landing page.
- A calm intake workflow centered on the primary customer action.
- A structured AI-ready shopping brief instead of an open-ended chat wall.
- Clear human verification, preliminary-cost labeling, and risk/return guidance.
- A mock protected internal workspace for operators to manage requests, quotes, missing details, and fulfillment stages.

Future frontend candidates:

- Keep as static/Vite-style shell while product direction stabilizes.
- Move to Remix, Next.js, or Shopify Hydrogen only when routing, auth, and backend integration needs justify it.

## Backend

Location: `backend/`

The backend is a Node HTTP skeleton with in-memory mocked data. It exposes:

- Health status.
- Intake template metadata.
- Concierge request creation.
- Concierge request retrieval.
- Mock team operations workspace records.
- Missing-detail prompts.
- Transparent quote drafting.
- Lifecycle advancement through `New -> Needs Details -> Quoted -> Approved -> Purchased -> Received in U.S. -> In Transit -> Delivered`.

The workflow module is intentionally isolated from HTTP handling so provider integrations can be swapped in behind stable contracts.

Operations endpoints use a mock `x-qtcr-team-token` header. This documents a protected boundary without introducing production authentication before the identity provider is selected.

## Future Integrations

- Shopify customer and checkout handoff after quote acceptance.
- AI extraction service that converts URL, screenshot OCR, and request text into structured product candidates.
- Optional product-page fetcher with explicit marketplace allowlists, rate limits, and terms compliance.
- Durable storage for requests, quotes, attachments, audit logs, and status history.
- Notification channels for quote updates and missing-information prompts.

## Data Principles

- Mark landed-cost estimates as preliminary until reviewed by a human.
- Store source input and extracted fields separately.
- Preserve an audit trail for human verification and quote revisions.
- Treat screenshots and product URLs as customer-provided evidence, not verified product truth.
