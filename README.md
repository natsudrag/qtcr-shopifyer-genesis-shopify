# Qtcr Shopifyer Genesis Shopify

Initial foundation for a premium AI-ready personal-shopping concierge for shoppers buying from the U.S. into Costa Rica.

This is not a generic storefront. Shopify is expected to own customer accounts and checkout later. This product owns the concierge intake, structured shopping brief, quote preparation, and tracking workflow.

## Structure

- `frontend/` contains the responsive product prototype.
- `backend/` contains the mocked request workflow API and contracts.
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
- AI-style structured brief prototype with product extraction, clarifying questions, preliminary landed-cost range, risk/return guidance, and human verification.
- Backend API skeleton with mocked request creation, retrieval, and quote status.
- Documentation for architecture, API contracts, and next integration steps.

Excluded by design:

- Live Shopify integration.
- Payment processing.
- External AI provider calls.
- Product scraping or marketplace automation.
- Durable database persistence.

## GitHub Repository Status

The connected GitHub capability available in this session supports repository lookup and file operations, but it does not expose a create-repository action. This project has been initialized locally with Git. To finish remote setup, create an empty GitHub repository and then run:

```bash
git remote add origin <repository-url>
git push -u origin main
```
