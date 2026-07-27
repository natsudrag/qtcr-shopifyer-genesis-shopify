const test = require("node:test");
const assert = require("node:assert/strict");
const {
  REQUEST_STATUSES,
  advanceRequest,
  assembleQuote,
  createRequest,
  getIntakeTemplate,
  getMarketingContent,
  getOpsConfig,
  getRequest,
  listRequests,
  normalizePayload,
  requestMissingDetails,
  seedOperationsStore,
  updateMarketingContent
} = require("../src/requestWorkflow");

test("intake template exposes supported request modes", () => {
  const template = getIntakeTemplate();

  assert.deepEqual(
    template.requestTypes.map((type) => type.id),
    ["url", "screenshot", "natural_language"]
  );
  assert.ok(template.deliveryOptions.length >= 3);
});

test("ops config exposes the full concierge lifecycle in order", () => {
  const config = getOpsConfig();

  assert.deepEqual(
    config.statuses.map((status) => status.id),
    REQUEST_STATUSES
  );
  assert.equal(config.statuses[0].label, "New");
  assert.equal(config.statuses.at(-1).label, "Delivered");
});

test("marketing content exposes carousel slides and testimonials", () => {
  const content = getMarketingContent();

  assert.equal(content.campaignWindow.headline, "The U.S. find you want, made simple");
  assert.ok(content.carouselSlides.some((slide) => slide.type === "curated_product"));
  assert.ok(content.carouselSlides.some((slide) => slide.type === "customer_feedback"));
  assert.ok(content.testimonials.some((testimonial) => testimonial.approvedForCarousel));
});

test("updateMarketingContent validates manager carousel content", () => {
  const content = updateMarketingContent({
    campaignWindow: {
      headline: "Weekly verified finds"
    },
    carouselSlides: [
      {
        id: "sample-slide",
        title: "Verified jacket request",
        category: "Fashion",
        imageSrc: "./assets/campaign-fashion-dress.png"
      }
    ],
    testimonials: [
      {
        id: "sample-testimonial",
        quote: "The quote was easy to understand.",
        approvedForCarousel: true
      }
    ]
  });

  assert.equal(content.campaignWindow.headline, "Weekly verified finds");
  assert.equal(content.carouselSlides[0].category, "Fashion");
  assert.equal(content.carouselSlides[0].imageSrc, "./assets/campaign-fashion-dress.png");
  assert.equal(content.testimonials[0].customerName, "Stream Buy With Gen customer");
  assert.equal(content.persistence, "mock_only");
});

test("updateMarketingContent rejects incomplete carousel slides", () => {
  assert.throws(
    () => updateMarketingContent({ carouselSlides: [{ id: "missing-title" }] }),
    /carousel slide id and title are required/
  );
});

test("createRequest stores a new structured operations request", () => {
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

  assert.match(request.id, /^SBWG-\d{8}-0001$/);
  assert.equal(request.status, "new");
  assert.equal(request.brief.verification.required, true);
  assert.equal(request.brief.landedCost.confidence, "low_until_human_verified");
  assert.equal(request.quote.transparencyLabel, "Preliminary until human verified");
  assert.equal(getRequest(request.id, store), request);
});

test("seedOperationsStore creates realistic dashboard records", () => {
  const store = seedOperationsStore(new Map());
  const requests = listRequests(store);

  assert.ok(requests.length >= 3);
  assert.ok(requests.some((request) => request.status === "needs_details"));
  assert.ok(requests.every((request) => request.quote.lines.length >= 7));
});

test("requestMissingDetails records a customer follow-up and moves status", () => {
  const store = seedOperationsStore(new Map());
  const request = requestMissingDetails(
    "SBWG-20260726-0004",
    { prompt: "Please confirm exact suitcase color fallback." },
    store
  );

  assert.equal(request.status, "needs_details");
  assert.equal(request.missingDetails[0].status, "open");
  assert.equal(request.brief.questions[0], "Please confirm exact suitcase color fallback.");
});

test("assembleQuote stores transparent quote lines and marks request quoted", () => {
  const store = seedOperationsStore(new Map());
  const request = assembleQuote(
    "SBWG-20260726-0004",
    {
      lines: [
        { id: "retailer_item", label: "Retailer item", amount: 100 },
        { id: "concierge_service", label: "Concierge service", amount: 20 }
      ],
      notes: "Reviewed by operator."
    },
    store
  );

  assert.equal(request.status, "quoted");
  assert.equal(request.quote.customerTotal, 120);
  assert.equal(request.quote.notes, "Reviewed by operator.");
});

test("advanceRequest enforces lifecycle progression", () => {
  const store = seedOperationsStore(new Map());
  const request = advanceRequest("SBWG-20260726-0002", { status: "approved" }, store);

  assert.equal(request.status, "approved");
  assert.throws(
    () => advanceRequest("SBWG-20260726-0002", { status: "delivered" }, store),
    /Cannot move from approved to delivered/
  );
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
