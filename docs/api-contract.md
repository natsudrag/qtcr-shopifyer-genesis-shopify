# API Contract

Base path: `/api/concierge`

Operations base path: `/api/ops`

## `GET /health`

Returns service status.

```json
{
  "status": "ok",
  "service": "qtcr-concierge-api"
}
```

## `GET /api/concierge/intake-template`

Returns allowed request modes, delivery presets, and field expectations for the frontend intake.

## `GET /api/concierge/marketing-content`

Returns public mock content for the customer-facing carousel.

```json
{
  "content": {
    "campaignWindow": {
      "headline": "The U.S. find you want, made simple",
      "startsAt": "2026-07-27",
      "endsAt": "2026-08-16",
      "status": "draft"
    },
    "carouselSlides": [
      {
        "id": "carry-on",
        "type": "curated_product",
        "title": "Cherry carry-on, Costa Rica-ready",
        "productName": "Expandable carry-on",
        "priceLabel": "Estimate $451 - $490 landed",
        "accent": "cherry"
      }
    ],
    "testimonials": []
  }
}
```

## Operations Auth

All `/api/ops/*` endpoints require this mock header in local development:

```http
x-qtcr-team-token: QTCR-DEMO
```

This is not production authentication.

## `POST /api/concierge/requests`

Creates a mocked concierge request.

Request body:

```json
{
  "requestType": "url",
  "input": "https://example.com/product",
  "customer": {
    "name": "Ari",
    "email": "ari@example.com"
  },
  "deliveryPreference": "san-jose-pickup"
}
```

Allowed `requestType` values:

- `url`
- `screenshot`
- `natural_language`

Response body:

```json
{
  "request": {
    "id": "QTCR-20260726-0001",
    "status": "new",
    "brief": {
      "product": {},
      "questions": [],
      "landedCost": {},
      "riskGuidance": [],
      "verification": {}
    }
  }
}
```

## `GET /api/concierge/requests/:id`

Returns a request from the in-memory store.

## `GET /api/ops/workspace`

Returns operation configuration, seeded active requests, and mock marketing content for the manager content area.

```json
{
  "config": {
    "statuses": [
      { "id": "new", "label": "New", "sequence": 1 },
      { "id": "needs_details", "label": "Needs Details", "sequence": 2 },
      { "id": "quoted", "label": "Quoted", "sequence": 3 },
      { "id": "approved", "label": "Approved", "sequence": 4 },
      { "id": "purchased", "label": "Purchased", "sequence": 5 },
      { "id": "received_us", "label": "Received in U.S.", "sequence": 6 },
      { "id": "in_transit", "label": "In Transit", "sequence": 7 },
      { "id": "delivered", "label": "Delivered", "sequence": 8 }
    ]
  },
  "requests": [],
  "marketingContent": {}
}
```

## `GET /api/ops/marketing-content`

Returns the same mock carousel, campaign, and testimonial content through the protected team boundary.

## `PUT /api/ops/marketing-content`

Validates and echoes updated mock manager content. This does not persist to durable storage.

```json
{
  "campaignWindow": {
    "headline": "Weekly verified finds"
  },
  "carouselSlides": [
    {
      "id": "headphones",
      "type": "curated_product",
      "title": "Travel headphones without checkout surprises",
      "productName": "Noise-canceling headphones",
      "priceLabel": "Estimate $462 - $514 landed",
      "accent": "emerald"
    }
  ],
  "testimonials": [
    {
      "id": "clear-total",
      "customerName": "Sofia M.",
      "quote": "Qtcr showed the product price, import reserve, handling, and delivery before checkout.",
      "approvedForCarousel": true
    }
  ]
}
```

## `GET /api/ops/requests`

Lists requests. Optional query: `?status=quoted`.

## `POST /api/ops/requests/:id/missing-details`

Moves the request to `needs_details`, records the prompt, and adds it to the shopping brief questions.

```json
{
  "prompt": "Please confirm size and acceptable substitute color."
}
```

## `POST /api/ops/requests/:id/quote`

Saves transparent quote lines and moves the request to `quoted`.

```json
{
  "lines": [
    { "id": "retailer_item", "label": "Retailer item", "amount": 128 },
    { "id": "freight_handling", "label": "Freight and handling", "amount": 31 },
    { "id": "concierge_service", "label": "Concierge service", "amount": 25 }
  ],
  "notes": "Reviewed by operator."
}
```

## `POST /api/ops/requests/:id/advance`

Advances a request through the lifecycle. The mock workflow allows one forward step at a time, with `needs_details` allowed from `new` or `quoted`.

```json
{
  "status": "approved",
  "note": "Customer approved quote by email."
}
```

## Error Shape

```json
{
  "error": {
    "code": "invalid_request",
    "message": "input is required"
  }
}
```
