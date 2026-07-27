# Architecture Notes

## Product Boundary

Stream Buy With Gen is the concierge layer for U.S.-to-Costa-Rica shopping requests. It should help a shopper submit a product URL, screenshot, or plain-language request, then turn that input into a verified shopping brief and quote workflow.

Shopify remains the future system of record for customer account, cart, checkout, payments, and transactional order records. This application should avoid duplicating Shopify-owned capabilities.

## Frontend

Location: `frontend/`

The current frontend is a dependency-light static prototype. It emphasizes:

- A premium editorial brand surface without turning the app into a marketing landing page.
- A timeless luxury fashion and beauty editorial surface using a local Stream Buy With Gen emblem and original local campaign imagery.
- A customer-facing carousel for curated fashion, beauty, fragrance, accessories, and verified feedback stories.
- A calm intake workflow centered on the primary customer action.
- A structured shopping brief instead of an open-ended chat wall.
- Clear human verification, preliminary-cost labeling, risk/return guidance, and emerald order progress.
- A mock protected internal workspace for operators to manage requests, quotes, missing details, and fulfillment stages.
- A manager content curation area for campaign windows, luxury carousel stories, and approved testimonials.

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
- Mock marketing content for customer carousel and manager curation.
- Missing-detail prompts.
- Transparent quote drafting.
- Lifecycle advancement through `New -> Needs Details -> Quoted -> Approved -> Purchased -> Received in U.S. -> In Transit -> Delivered`.

The workflow module is intentionally isolated from HTTP handling so provider integrations can be swapped in behind stable contracts.

Operations endpoints use a mock `x-stream-buy-with-gen-team-token` header. This documents a protected boundary without introducing production authentication before the identity provider is selected.

Carousel and testimonial records are mock-only. They are shaped as future CMS or admin records but do not persist beyond the in-memory/local prototype. Campaign imagery is original generated artwork copied into `frontend/assets`; no third-party hotlinks are used.

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
