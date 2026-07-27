const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createRequest,
  getIntakeTemplate,
  getRequest,
  normalizePayload
} = require("../src/requestWorkflow");

test("intake template exposes supported request modes", () => {
  const template = getIntakeTemplate();

  assert.deepEqual(
    template.requestTypes.map((type) => type.id),
    ["url", "screenshot", "natural_language"]
  );
  assert.ok(template.deliveryOptions.length >= 3);
});

test("createRequest stores a structured brief with preliminary quote guidance", () => {
  const store = new Map();
  const request = createRequest(
    {
      requestType: "url",
      input: "https://example.com/item",
      deliveryPreference: "san-jose-pickup",
      customer: { name: "Ari", email: "ari@example.com" }
    },
    store
  );

  assert.match(request.id, /^QTCR-\d{8}-0001$/);
  assert.equal(request.status, "brief_ready");
  assert.equal(request.brief.verification.required, true);
  assert.equal(request.brief.landedCost.confidence, "low_until_human_verified");
  assert.equal(getRequest(request.id, store), request);
});

test("normalizePayload rejects unsupported request types", () => {
  assert.throws(
    () => normalizePayload({ requestType: "chat", input: "Find this", deliveryPreference: "gam-courier" }),
    /requestType must be url, screenshot, or natural_language/
  );
});

test("normalizePayload requires input", () => {
  assert.throws(
    () => normalizePayload({ requestType: "natural_language", deliveryPreference: "gam-courier" }),
    /input is required/
  );
});
