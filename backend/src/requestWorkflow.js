const REQUEST_TYPES = new Set(["url", "screenshot", "natural_language"]);
const REQUEST_STATUSES = [
  "new",
  "needs_details",
  "quoted",
  "approved",
  "purchased",
  "received_us",
  "in_transit",
  "delivered"
];

const statusLabels = {
  new: "New",
  needs_details: "Needs Details",
  quoted: "Quoted",
  approved: "Approved",
  purchased: "Purchased",
  received_us: "Received in U.S.",
  in_transit: "In Transit",
  delivered: "Delivered"
};

const deliveryOptions = [
  {
    id: "san-jose-pickup",
    label: "San Jose pickup",
    description: "Quote assumes central pickup after import processing."
  },
  {
    id: "gam-courier",
    label: "GAM courier",
    description: "Quote includes a local courier estimate inside the Greater Metropolitan Area."
  },
  {
    id: "outside-gam-quote",
    label: "Outside GAM quote",
    description: "Concierge confirms final-mile cost before checkout handoff."
  }
];

const defaultQuoteLines = [
  { id: "retailer_item", label: "Retailer item", amount: 118 },
  { id: "us_tax", label: "U.S. tax estimate", amount: 9 },
  { id: "domestic_shipping", label: "U.S. domestic shipping", amount: 0 },
  { id: "import_reserve", label: "Import duty reserve", amount: 24 },
  { id: "freight_handling", label: "Freight and handling", amount: 31 },
  { id: "local_delivery", label: "Local delivery", amount: 10 },
  { id: "concierge_service", label: "Concierge service", amount: 22 }
];

const defaultMarketingContent = {
  campaignWindow: {
    id: "summer-travel-drop",
    name: "Summer travel drop",
    headline: "The U.S. find you want, made simple",
    startsAt: "2026-07-27",
    endsAt: "2026-08-16",
    status: "draft"
  },
  carouselSlides: [
    {
      id: "carry-on",
      type: "curated_product",
      eyebrow: "Curated find",
      title: "Cherry carry-on, Costa Rica-ready",
      description: "A verified luggage request with color fallback, freight checks, and a clear landed-cost range.",
      productName: "Expandable carry-on",
      priceLabel: "Estimate $451 - $490 landed",
      accent: "cherry"
    },
    {
      id: "headphones",
      type: "curated_product",
      eyebrow: "Verified quote",
      title: "Travel headphones without checkout surprises",
      description: "Sourced from a U.S. retailer, checked for warranty risk, battery shipping rules, and local delivery.",
      productName: "Noise-canceling headphones",
      priceLabel: "Estimate $462 - $514 landed",
      accent: "emerald"
    },
    {
      id: "feedback",
      type: "customer_feedback",
      eyebrow: "Customer note",
      title: "They made the total clear before I said yes.",
      description: "Mock testimonial highlighting quote transparency, human verification, and delivery progress updates.",
      productName: "Beauty bundle",
      priceLabel: "Delivered to Escazu",
      accent: "lilac"
    }
  ],
  testimonials: [
    {
      id: "clear-total",
      customerName: "Sofia M.",
      quote: "Stream Buy Gen showed the product price, import reserve, handling, and delivery before checkout.",
      requestId: "SBG-20260726-0002",
      approvedForCarousel: true
    },
    {
      id: "found-size",
      customerName: "Diego P.",
      quote: "The team asked the right sizing question before buying, which saved a return problem.",
      requestId: "SBG-20260726-0003",
      approvedForCarousel: false
    }
  ]
};

function getIntakeTemplate() {
  return {
    requestTypes: [
      { id: "url", label: "Product URL" },
      { id: "screenshot", label: "Screenshot" },
      { id: "natural_language", label: "Natural-language request" }
    ],
    deliveryOptions,
    requiredFields: ["requestType", "input", "deliveryPreference"],
    optionalFields: ["customer", "budgetTarget", "attachments"]
  };
}

function getOpsConfig() {
  return {
    statuses: REQUEST_STATUSES.map((id, index) => ({
      id,
      label: statusLabels[id],
      sequence: index + 1
    })),
    quoteLineDefaults: defaultQuoteLines,
    auth: {
      mode: "mock_header",
      header: "x-stream-buy-gen-team-token"
    }
  };
}

function getMarketingContent() {
  return clone(defaultMarketingContent);
}

function updateMarketingContent(payload = {}) {
  const content = getMarketingContent();

  if (payload.campaignWindow) {
    content.campaignWindow = {
      ...content.campaignWindow,
      ...pickCampaignFields(payload.campaignWindow)
    };
  }

  if (Array.isArray(payload.carouselSlides)) {
    content.carouselSlides = payload.carouselSlides.map(normalizeCarouselSlide);
  }

  if (Array.isArray(payload.testimonials)) {
    content.testimonials = payload.testimonials.map(normalizeTestimonial);
  }

  return {
    ...content,
    updatedAt: new Date().toISOString(),
    persistence: "mock_only"
  };
}

function seedOperationsStore(store) {
  if (store.size > 0) {
    return store;
  }

  const seeded = [
    createSeedRequest({
      id: "SBG-20260726-0004",
      status: "new",
      customer: { name: "Mariana R.", email: "mariana@example.com" },
      requestType: "url",
      input: "https://www.awaytravel.com/suitcases/bigger-carry-on-flex",
      deliveryPreference: "san-jose-pickup",
      title: "Cherry red Away carry-on",
      source: "awaytravel.com",
      priority: "high",
      dueBy: "Today 4:00 PM",
      brief: {
        product: {
          title: "Away Bigger Carry-On Flex",
          source: "Customer-provided URL",
          variant: "Cherry red, carry-on size, expandable hard shell",
          quantity: 1,
          retailerPrice: 295
        },
        questions: [
          "Confirm if comparable red is acceptable if limited edition color is gone.",
          "Choose speed versus lowest landed cost."
        ],
        riskGuidance: [
          "Dimensional weight can affect freight.",
          "Retailer return window may close before Costa Rica delivery."
        ]
      },
      quoteLines: [
        quoteLine("retailer_item", "Retailer item", 295),
        quoteLine("us_tax", "U.S. tax estimate", 22),
        quoteLine("domestic_shipping", "U.S. domestic shipping", 0),
        quoteLine("import_reserve", "Import duty reserve", 54),
        quoteLine("freight_handling", "Freight and handling", 68),
        quoteLine("local_delivery", "Local delivery", 12),
        quoteLine("concierge_service", "Concierge service", 39)
      ],
      timeline: ["Request received from product URL", "AI brief prepared with low confidence on color availability"]
    }),
    createSeedRequest({
      id: "SBG-20260726-0003",
      status: "needs_details",
      customer: { name: "Diego P.", email: "diego@example.com" },
      requestType: "screenshot",
      input: "Screenshot notes: ivory platform sandals from Nordstrom",
      deliveryPreference: "gam-courier",
      title: "Ivory platform sandals",
      source: "Screenshot from Nordstrom",
      priority: "medium",
      dueBy: "Tomorrow",
      brief: {
        product: {
          title: "Designer platform sandal candidate",
          source: "Customer-provided screenshot",
          variant: "Ivory, size not visible, block heel",
          quantity: 1,
          retailerPrice: 128
        },
        questions: ["Ask for shoe size and acceptable heel height.", "Confirm whether a similar brand is acceptable."],
        riskGuidance: ["Footwear fit returns are difficult after import.", "Screenshot price needs live source verification."]
      },
      quoteLines: [
        quoteLine("retailer_item", "Retailer item", 128),
        quoteLine("us_tax", "U.S. tax estimate", 10),
        quoteLine("domestic_shipping", "U.S. domestic shipping", 8),
        quoteLine("import_reserve", "Import duty reserve", 24),
        quoteLine("freight_handling", "Freight and handling", 31),
        quoteLine("local_delivery", "Local delivery", 10),
        quoteLine("concierge_service", "Concierge service", 25)
      ],
      timeline: ["Screenshot request received", "Missing size and substitute preference requested"]
    }),
    createSeedRequest({
      id: "SBG-20260726-0002",
      status: "quoted",
      customer: { name: "Sofia M.", email: "sofia@example.com" },
      requestType: "natural_language",
      input: "Need premium noise-canceling headphones for travel under $350 landed.",
      deliveryPreference: "gam-courier",
      title: "Noise-canceling headphones",
      source: "Concierge sourced",
      priority: "high",
      dueBy: "Quote expires Friday",
      brief: {
        product: {
          title: "Sony WH-1000XM5",
          source: "Concierge sourced",
          variant: "Black, new, U.S. warranty",
          quantity: 1,
          retailerPrice: 328
        },
        questions: ["Confirm black over silver.", "Confirm U.S. warranty tradeoff."],
        riskGuidance: [
          "Electronics warranty service may require U.S. return routing.",
          "Battery shipping rules can affect carrier choice."
        ]
      },
      quoteLines: [
        quoteLine("retailer_item", "Retailer item", 328),
        quoteLine("us_tax", "U.S. tax estimate", 25),
        quoteLine("domestic_shipping", "U.S. domestic shipping", 0),
        quoteLine("import_reserve", "Import duty reserve", 48),
        quoteLine("freight_handling", "Freight and handling", 42),
        quoteLine("local_delivery", "Local delivery", 9),
        quoteLine("concierge_service", "Concierge service", 36)
      ],
      timeline: ["Natural-language request normalized", "Quote assembled and waiting for customer approval"]
    })
  ];

  seeded.forEach((request) => store.set(request.id, request));
  return store;
}

function createRequest(payload, store) {
  const normalized = normalizePayload(payload);
  const now = new Date();
  const request = {
    id: createRequestId(now, store.size + 1),
    status: "new",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    requestType: normalized.requestType,
    input: normalized.input,
    customer: normalized.customer,
    deliveryPreference: normalized.deliveryPreference,
    title: createRequestTitle(normalized),
    source: normalized.requestType === "url" ? normalized.input : "Customer-provided intake",
    priority: "normal",
    dueBy: "Unscheduled",
    brief: createMockBrief(normalized),
    quote: createQuote(defaultQuoteLines, "draft"),
    missingDetails: [],
    timeline: [
      timelineEntry("new", "Request captured and queued for concierge review.", now)
    ]
  };

  store.set(request.id, request);
  return request;
}

function listRequests(store, filters = {}) {
  const requests = Array.from(store.values());
  if (!filters.status) {
    return requests;
  }

  return requests.filter((request) => request.status === filters.status);
}

function getRequest(id, store) {
  return store.get(id) || null;
}

function requestMissingDetails(id, payload, store) {
  const request = requireExistingRequest(id, store);
  const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
  if (!prompt) {
    throw createWorkflowError("invalid_request", "prompt is required");
  }

  request.missingDetails.push({
    id: `DETAIL-${String(request.missingDetails.length + 1).padStart(3, "0")}`,
    prompt,
    status: "open",
    createdAt: new Date().toISOString()
  });
  request.brief.questions.unshift(prompt);
  setRequestStatus(request, "needs_details", `Operator requested missing details: ${prompt}`);
  return request;
}

function assembleQuote(id, payload, store) {
  const request = requireExistingRequest(id, store);
  const lines = Array.isArray(payload?.lines) && payload.lines.length > 0 ? payload.lines : request.quote.lines;
  request.quote = createQuote(lines, "ready_for_review", payload?.notes || request.quote.notes);
  setRequestStatus(request, "quoted", "Transparent quote assembled for shopper approval.");
  return request;
}

function advanceRequest(id, payload, store) {
  const request = requireExistingRequest(id, store);
  const nextStatus = payload?.status;
  if (!REQUEST_STATUSES.includes(nextStatus)) {
    throw createWorkflowError("invalid_status", "status is not part of the concierge lifecycle");
  }

  if (!canMoveToStatus(request.status, nextStatus)) {
    throw createWorkflowError("invalid_transition", `Cannot move from ${request.status} to ${nextStatus}`);
  }

  setRequestStatus(request, nextStatus, payload?.note || `Status advanced to ${statusLabels[nextStatus]}.`);
  return request;
}

function canMoveToStatus(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) {
    return true;
  }

  if (nextStatus === "needs_details") {
    return ["new", "quoted"].includes(currentStatus);
  }

  const currentIndex = REQUEST_STATUSES.indexOf(currentStatus);
  const nextIndex = REQUEST_STATUSES.indexOf(nextStatus);
  return nextIndex === currentIndex + 1;
}

function normalizePayload(payload = {}) {
  const requestType = payload.requestType;
  if (!REQUEST_TYPES.has(requestType)) {
    throw createWorkflowError("invalid_request_type", "requestType must be url, screenshot, or natural_language");
  }

  if (!payload.input || typeof payload.input !== "string" || !payload.input.trim()) {
    throw createWorkflowError("invalid_request", "input is required");
  }

  if (!payload.deliveryPreference || typeof payload.deliveryPreference !== "string") {
    throw createWorkflowError("invalid_request", "deliveryPreference is required");
  }

  return {
    requestType,
    input: payload.input.trim(),
    customer: payload.customer || null,
    deliveryPreference: payload.deliveryPreference,
    budgetTarget: payload.budgetTarget || null
  };
}

function createMockBrief(payload) {
  const base = {
    sourceInput: {
      type: payload.requestType,
      value: payload.input
    },
    landedCost: {
      currency: "USD",
      label: "Preliminary landed-cost range",
      min: 118,
      max: 186,
      confidence: "low_until_human_verified",
      assumptions: [
        "Retailer price and availability are not yet verified.",
        "Import duties, freight, handling, and local delivery require review."
      ]
    },
    verification: {
      required: true,
      owner: "concierge_team",
      nextAction: "Confirm availability, variant, import constraints, and quote expiration."
    }
  };

  if (payload.requestType === "natural_language") {
    return {
      ...base,
      product: {
        title: "Product candidate from customer brief",
        source: "Needs concierge sourcing",
        variant: "To be selected",
        quantity: 1,
        retailerPrice: null
      },
      questions: [
        "Which brands or stores should be excluded?",
        "Is fastest arrival or best landed price more important?"
      ],
      riskGuidance: [
        "Source selection can materially change return options.",
        "Quote remains preliminary until a specific product is verified."
      ]
    };
  }

  return {
    ...base,
    product: {
      title: "Product extracted from customer source",
      source: payload.requestType === "url" ? "Customer-provided URL" : "Customer-provided screenshot",
      variant: "Needs size, color, and availability verification",
      quantity: 1,
      retailerPrice: null
    },
    questions: [
      "Is a comparable substitute acceptable if the exact item sells out?",
      "Should the quote optimize for speed or landed cost?"
    ],
    riskGuidance: [
      "Marketplace price, promotions, and shipping availability may change.",
      "Returns require human review before quote acceptance."
    ]
  };
}

function createSeedRequest(config) {
  const now = new Date().toISOString();
  return {
    id: config.id,
    status: config.status,
    createdAt: now,
    updatedAt: now,
    requestType: config.requestType,
    input: config.input,
    customer: config.customer,
    deliveryPreference: config.deliveryPreference,
    title: config.title,
    source: config.source,
    priority: config.priority,
    dueBy: config.dueBy,
    brief: {
      ...createMockBrief(config),
      ...config.brief,
      landedCost: createLandedCost(config.quoteLines),
      verification: {
        required: true,
        owner: "concierge_team",
        nextAction: "Human review required before quote is customer-final."
      }
    },
    quote: createQuote(config.quoteLines, config.status === "quoted" ? "ready_for_customer" : "draft"),
    missingDetails: [],
    timeline: config.timeline.map((entry) => timelineEntry(config.status, entry))
  };
}

function createQuote(lines, status, notes = "Mock quote draft. No payments or Shopify checkout are active.") {
  const normalizedLines = lines.map((line) => quoteLine(line.id, line.label, Number(line.amount || 0)));
  const subtotal = normalizedLines.reduce((sum, line) => sum + line.amount, 0);
  return {
    status,
    currency: "USD",
    lines: normalizedLines,
    subtotal,
    customerTotal: subtotal,
    transparencyLabel: "Preliminary until human verified",
    notes
  };
}

function createLandedCost(lines) {
  const quote = createQuote(lines, "draft");
  return {
    currency: "USD",
    label: "Preliminary landed-cost range",
    min: Math.max(0, Math.round(quote.customerTotal * 0.94)),
    max: Math.round(quote.customerTotal * 1.08),
    confidence: "low_until_human_verified",
    assumptions: [
      "Retailer price and availability are not yet verified.",
      "Import duties, freight, handling, and local delivery require review."
    ]
  };
}

function quoteLine(id, label, amount) {
  return { id, label, amount };
}

function setRequestStatus(request, status, note) {
  request.status = status;
  request.updatedAt = new Date().toISOString();
  request.timeline.unshift(timelineEntry(status, note));
}

function timelineEntry(status, note, date = new Date()) {
  return {
    status,
    label: statusLabels[status],
    note,
    at: date instanceof Date ? date.toISOString() : date
  };
}

function requireExistingRequest(id, store) {
  const request = getRequest(id, store);
  if (!request) {
    throw createWorkflowError("not_found", "Concierge request not found", 404);
  }

  return request;
}

function createRequestTitle(payload) {
  if (payload.requestType === "url") {
    return "Product URL request";
  }

  if (payload.requestType === "screenshot") {
    return "Screenshot shopping request";
  }

  return "Concierge sourcing request";
}

function createRequestId(date, sequence) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `SBG-${yyyy}${mm}${dd}-${String(sequence).padStart(4, "0")}`;
}

function createWorkflowError(code, message, status = 400) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}

module.exports = {
  REQUEST_STATUSES,
  REQUEST_TYPES,
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
};

function pickCampaignFields(campaignWindow) {
  return {
    id: stringOrFallback(campaignWindow.id, defaultMarketingContent.campaignWindow.id),
    name: stringOrFallback(campaignWindow.name, defaultMarketingContent.campaignWindow.name),
    headline: stringOrFallback(campaignWindow.headline, defaultMarketingContent.campaignWindow.headline),
    startsAt: stringOrFallback(campaignWindow.startsAt, defaultMarketingContent.campaignWindow.startsAt),
    endsAt: stringOrFallback(campaignWindow.endsAt, defaultMarketingContent.campaignWindow.endsAt),
    status: stringOrFallback(campaignWindow.status, defaultMarketingContent.campaignWindow.status)
  };
}

function normalizeCarouselSlide(slide = {}) {
  if (!slide.id || !slide.title) {
    throw createWorkflowError("invalid_marketing_content", "carousel slide id and title are required");
  }

  return {
    id: String(slide.id),
    type: slide.type === "customer_feedback" ? "customer_feedback" : "curated_product",
    eyebrow: stringOrFallback(slide.eyebrow, "Curated find"),
    title: String(slide.title),
    description: stringOrFallback(slide.description, "Mock carousel story for a verified concierge request."),
    productName: stringOrFallback(slide.productName, "Curated product"),
    priceLabel: stringOrFallback(slide.priceLabel, "Preliminary quote"),
    accent: ["cherry", "emerald", "lilac", "orange"].includes(slide.accent) ? slide.accent : "cherry"
  };
}

function normalizeTestimonial(testimonial = {}) {
  if (!testimonial.id || !testimonial.quote) {
    throw createWorkflowError("invalid_marketing_content", "testimonial id and quote are required");
  }

  return {
    id: String(testimonial.id),
    customerName: stringOrFallback(testimonial.customerName, "Stream Buy Gen customer"),
    quote: String(testimonial.quote),
    requestId: stringOrFallback(testimonial.requestId, "SBG-MOCK"),
    approvedForCarousel: Boolean(testimonial.approvedForCarousel)
  };
}

function stringOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
