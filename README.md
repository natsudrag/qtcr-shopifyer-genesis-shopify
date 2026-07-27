# Qtcr Shopifyer Genesis Shopify

Initial foundation for a premium AI-ready personal-shopping concierge for shoppers buying from the U.S. into Costa Rica.

This is not a generic storefront. Shopify is expected to own customer accounts and checkout later. This product owns the concierge intake, structured shopping brief, quote preparation, and tracking workflow.

## Structure

- `frontend/` contains the responsive customer prototype and mock internal operations workspace surface.
- `backend/` contains the mocked request and operations workflow API contracts.
- `docs/` captures architecture and integration notes.

## Run Locally

Requirements: Node.js 18 or newer.

```bash
npm run dev:frontend
npm run dev:backend
```

Default local URLs:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:4201`

## Validate

```bash
npm run check
```

The current validation builds the static frontend into `frontend/dist/` and runs backend contract tests with Node's built-in test runner.

## Current Scope

Included:

- Premium responsive intake UI for URL, screenshot, and natural-language shopping requests.
- Mock protected shopper-operations workspace for team users.
- AI-style structured brief prototype with product extraction, clarifying questions, preliminary landed-cost range, risk/return guidance, and human verification.
- Backend API skeleton with mocked request creation, queue retrieval, missing-detail requests, transparent quote assembly, and status advancement.
- Documentation for architecture, API contracts, and next integration steps.

Operations lifecycle:

`New -> Needs Details -> Quoted -> Approved -> Purchased -> Received in U.S. -> In Transit -> Delivered`

Excluded by design:

- Live Shopify integration.
- Payment processing.
- External AI provider calls.
- Product scraping or marketplace automation.
- Durable database persistence.
- Production authentication.

## Mock Team Access

The frontend workspace includes a demo access screen. The backend operations endpoints require the mock header:

```bash
x-qtcr-team-token: QTCR-DEMO
```

This is a local prototype guard only, not production auth.
