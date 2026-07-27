const REQUEST_TYPES = new Set(["url", "screenshot", "natural_language"]);

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

function createRequest(payload, store) {
  const normalized = normalizePayload(payload);
  const now = new Date();
  const request = {
    id: createRequestId(now, store.size + 1),
    status: "brief_ready",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    requestType: normalized.requestType,
    input: normalized.input,
    customer: normalized.customer,
    deliveryPreference: normalized.deliveryPreference,
    brief: createMockBrief(normalized)
  };

  store.set(request.id, request);
  return request;
}

function getRequest(id, store) {
  return store.get(id) || null;
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
        quantity: 1
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
      quantity: 1
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

function createRequestId(date, sequence) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `QTCR-${yyyy}${mm}${dd}-${String(sequence).padStart(4, "0")}`;
}

function createWorkflowError(code, message) {
  const error = new Error(message);
  error.code = code;
  error.status = 400;
  return error;
}

module.exports = {
  REQUEST_TYPES,
  createRequest,
  getIntakeTemplate,
  getRequest,
  normalizePayload
};
