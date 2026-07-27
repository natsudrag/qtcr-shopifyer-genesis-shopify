# API Contract

Base path: `/api/concierge`

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
    "status": "brief_ready",
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

## Error Shape

```json
{
  "error": {
    "code": "invalid_request",
    "message": "input is required"
  }
}
```
