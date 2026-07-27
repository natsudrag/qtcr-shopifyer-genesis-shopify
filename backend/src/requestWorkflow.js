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
    id: "private-edit",
    name: "The Private Edit",
    headline: "The U.S. find you want, made simple",
    startsAt: "2026-07-27",
    endsAt: "2026-08-16",
    status: "draft"
  },
  carouselSlides: [
    {
      id: "fashion-edit",
      type: "curated_product",
      eyebrow: "Fashion sourcing",
      title: "Occasion dressing, quoted before purchase",
      description: "A polished apparel request prepared with size, timing, substitution, and landed-cost assumptions clearly separated for review.",
      productName: "Contemporary dress request",
      priceLabel: "Preliminary quote model",
      category: "Fashion",
      imageSrc: "./assets/campaign-fashion-dress.png",
      imageAlt: "Editorial portrait of an adult model in an elegant warm ivory dress",
      imagePosition: "50% 35%"
    },
    {
      id: "beauty-edit",
      type: "curated_product",
      eyebrow: "Beauty sourcing",
      title: "Beauty requests with shade checks first",
      description: "Makeup and skincare requests stay structured around shade preferences, retailer verification, substitution rules, and return sensitivity.",
      productName: "Beauty and makeup brief",
      priceLabel: "Human verification required",
      category: "Beauty",
      imageSrc: "./assets/campaign-beauty-makeup.png",
      imageAlt: "Luxury beauty editorial portrait with refined makeup and warm champagne styling",
      imagePosition: "48% 42%"
    },
    {
      id: "fragrance-edit",
      type: "curated_product",
      eyebrow: "Fragrance sourcing",
      title: "Fragrance, handled with extra care",
      description: "Perfume and delicate beauty goods are flagged for carrier rules, packaging risk, and quote review before any checkout handoff.",
      productName: "Fragrance request",
      priceLabel: "Carrier rules reviewed",
      category: "Fragrance",
      imageSrc: "./assets/campaign-fragrance.png",
      imageAlt: "Unbranded luxury perfume bottle on ivory stone with champagne satin and adult model silhouette",
      imagePosition: "48% 58%"
    },
    {
      id: "feedback-edit",
      type: "customer_feedback",
      eyebrow: "Client feedback",
      title: "The quote felt transparent before I approved it.",
      description: "Mock testimonial for the Stream Buy Gen service experience: refined sourcing, human verification, and progress updates without live inventory claims.",
      productName: "Accessories request",
      priceLabel: "Delivered to Escazu",
      category: "Accessories",
      imageSrc: "./assets/campaign-accessories.png",
      imageAlt: "Luxury accessories editorial portrait with adult model, handbag, sunglasses, and jewelry",
      imagePosition: "50% 36%"
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
      input: "https://example.com/us-fashion-retailer/ivory-occasion-dress",
      deliveryPreference: "san-jose-pickup",
      title: "Ivory occasion dress",
      source: "U.S. fashion retailer link",
      priority: "high",
      dueBy: "Today 4:00 PM",
      brief: {
        product: {
          title: "Contemporary occasion dress candidate",
          source: "Customer-provided URL",
          variant: "Ivory, midi-to-floor length, refined evening silhouette",
          quantity: 1,
          retailerPrice: 295
        },
        questions: [
          "Confirm exact size and acceptable hem length.",
          "Choose speed versus lowest landed cost."
        ],
        riskGuidance: [
          "Fit-sensitive apparel may be difficult to return after import.",
          "Promotions and availability require human verification."
        ]
      },
      quoteLines: [
        quoteLine("retailer_item", "Retailer item", 295),
        quoteLine("us_tax", "U.S. tax estimate", 22),
        quoteLine("domestic_shipping", "U.S. domestic shipping", 0),
        quoteLine("import_reserve", "Import duty reserve", 54),
        quoteLine("freight_handling", "Freight and handling", 38),
        quoteLine("local_delivery", "Local delivery", 12),
        quoteLine("concierge_service", "Concierge service", 39)
      ],
      timeline: ["Request received from product URL", "Shopping brief prepared with fit and availability checks"]
    }),
    createSeedRequest({
      id: "SBG-20260726-0003",
      status: "needs_details",
      customer: { name: "Diego P.", email: "diego@example.com" },
      requestType: "screenshot",
      input: "Screenshot notes: soft blush beauty set from a U.S. retailer",
      deliveryPreference: "gam-courier",
      title: "Blush beauty set",
      source: "Customer screenshot from U.S. retailer",
      priority: "medium",
      dueBy: "Tomorrow",
      brief: {
        product: {
          title: "Beauty and makeup set candidate",
          source: "Customer-provided screenshot",
          variant: "Soft blush palette, brush, compact, shade family unconfirmed",
          quantity: 1,
          retailerPrice: 128
        },
        questions: ["Ask for shade preferences and sensitive ingredients.", "Confirm whether a comparable formulation is acceptable."],
        riskGuidance: ["Shade matching requires customer confirmation.", "Beauty returns may be limited once opened or imported."]
      },
      quoteLines: [
        quoteLine("retailer_item", "Retailer item", 128),
        quoteLine("us_tax", "U.S. tax estimate", 10),
        quoteLine("domestic_shipping", "U.S. domestic shipping", 8),
        quoteLine("import_reserve", "Import duty reserve", 24),
        quoteLine("freight_handling", "Freight and handling", 24),
        quoteLine("local_delivery", "Local delivery", 10),
        quoteLine("concierge_service", "Concierge service", 25)
      ],
      timeline: ["Screenshot request received", "Missing shade and substitution preference requested"]
    }),
    createSeedRequest({
      id: "SBG-20260726-0002",
      status: "quoted",
      customer: { name: "Sofia M.", email: "sofia@example.com" },
      requestType: "natural_language",
      input: "Need a warm floral fragrance sourced from a U.S. retailer with careful shipping review.",
      deliveryPreference: "gam-courier",
      title: "Signature fragrance",
      source: "Concierge sourced candidate",
      priority: "high",
      dueBy: "Quote expires Friday",
      brief: {
        product: {
          title: "Unbranded fragrance candidate from U.S. retailer",
          source: "Concierge sourced candidate",
          variant: "Warm floral profile, 50ml to 75ml, sealed packaging",
          quantity: 1,
          retailerPrice: 168
        },
        questions: ["Confirm preferred scent family.", "Confirm whether travel size is acceptable if full size is restricted."],
        riskGuidance: [
          "Fragrance shipping rules can affect carrier choice.",
          "Fragile packaging requires inspection on U.S. receipt."
        ]
      },
      quoteLines: [
        quoteLine("retailer_item", "Retailer item", 168),
        quoteLine("us_tax", "U.S. tax estimate", 13),
        quoteLine("domestic_shipping", "U.S. domestic shipping", 0),
        quoteLine("import_reserve", "Import duty reserve", 32),
        quoteLine("freight_handling", "Freight and handling", 36),
        quoteLine("local_delivery", "Local delivery", 9),
        quoteLine("concierge_service", "Concierge service", 34)
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
    category: stringOrFallback(slide.category, "Fashion"),
    imageSrc: stringOrFallback(slide.imageSrc, "./assets/campaign-fashion-dress.png"),
    imageAlt: stringOrFallback(slide.imageAlt, "Luxury editorial campaign image"),
    imagePosition: stringOrFallback(slide.imagePosition, "50% 50%")
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
