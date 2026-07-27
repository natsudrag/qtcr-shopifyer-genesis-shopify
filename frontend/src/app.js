const statuses = [
  { id: "new", label: "New" },
  { id: "needs_details", label: "Needs Details" },
  { id: "quoted", label: "Quoted" },
  { id: "approved", label: "Approved" },
  { id: "purchased", label: "Purchased" },
  { id: "received_us", label: "Received in U.S." },
  { id: "in_transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" }
];

const marketingContent = {
  campaignWindow: {
    name: "The Private Edit",
    headline: "The U.S. find you want, made simple",
    startsAt: "Jul 27",
    endsAt: "Aug 16",
    status: "Draft"
  },
  carouselSlides: [
    {
      id: "fashion-edit",
      type: "curated_product",
      eyebrow: "Fashion sourcing",
      title: "Occasion dressing, quoted before purchase",
      description:
        "A polished apparel request prepared with size, timing, substitution, and landed-cost assumptions clearly separated for review.",
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
      description:
        "Makeup and skincare requests stay structured around shade preferences, retailer verification, substitution rules, and return sensitivity.",
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
      description:
        "Perfume and delicate beauty goods are flagged for carrier rules, packaging risk, and quote review before any checkout handoff.",
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
      description:
        "Mock testimonial for the Stream Buy With Gen service experience: refined sourcing, human verification, and progress updates without live inventory claims.",
      productName: "Accessories request",
      priceLabel: "Delivered to Costa Rica",
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
      quote: "Stream Buy With Gen showed the product price, import reserve, handling, and delivery before checkout.",
      approvedForCarousel: true
    },
    {
      id: "found-size",
      customerName: "Diego P.",
      quote: "The team asked the right sizing question before buying, which saved a return problem.",
      approvedForCarousel: false
    }
  ]
};

const requests = [
  {
    id: "SBWG-20260726-0004",
    customer: "Mariana R.",
    channel: "URL",
    status: "new",
    dueBy: "Today 4:00 PM",
    title: "Ivory occasion dress",
    source: "U.S. fashion retailer link",
    delivery: "San Jose pickup",
    brief: {
      product: "Contemporary occasion dress candidate",
      variant: "Ivory, midi-to-floor length, refined evening silhouette",
      retailerPrice: "$295.00",
      extractedFrom: "Customer URL",
      questions: ["Confirm exact size and acceptable hem length.", "Choose speed versus lowest landed cost."],
      risks: ["Fit-sensitive apparel may be difficult to return after import.", "Promotions and availability require human verification."]
    },
    quote: [
      ["Retailer item", 295],
      ["U.S. tax estimate", 22],
      ["U.S. domestic shipping", 0],
      ["Import duty reserve", 54],
      ["Freight and handling", 38],
      ["Local delivery", 12],
      ["Concierge service", 39]
    ],
    timeline: ["Request received from product URL", "Shopping brief prepared with fit and availability checks"]
  },
  {
    id: "SBWG-20260726-0003",
    customer: "Diego P.",
    channel: "Screenshot",
    status: "needs_details",
    dueBy: "Tomorrow",
    title: "Blush beauty set",
    source: "Customer screenshot from U.S. retailer",
    delivery: "GAM courier",
    brief: {
      product: "Beauty and makeup set candidate",
      variant: "Soft blush palette, brush, compact, shade family unconfirmed",
      retailerPrice: "$128.00",
      extractedFrom: "Customer screenshot",
      questions: ["Ask for shade preferences and sensitive ingredients.", "Confirm whether a comparable formulation is acceptable."],
      risks: ["Shade matching requires customer confirmation.", "Beauty returns may be limited once opened or imported."]
    },
    quote: [
      ["Retailer item", 128],
      ["U.S. tax estimate", 10],
      ["U.S. domestic shipping", 8],
      ["Import duty reserve", 24],
      ["Freight and handling", 24],
      ["Local delivery", 10],
      ["Concierge service", 25]
    ],
    timeline: ["Screenshot request received", "Missing shade and substitution preference requested"]
  },
  {
    id: "SBWG-20260726-0002",
    customer: "Sofia M.",
    channel: "Request",
    status: "quoted",
    dueBy: "Quote expires Friday",
    title: "Signature fragrance",
    source: "Concierge sourced candidate",
    delivery: "Escazu courier",
    brief: {
      product: "Unbranded fragrance candidate from U.S. retailer",
      variant: "Warm floral profile, 50ml to 75ml, sealed packaging",
      retailerPrice: "$168.00",
      extractedFrom: "Natural-language request",
      questions: ["Confirm preferred scent family.", "Confirm whether travel size is acceptable if full size is restricted."],
      risks: ["Fragrance shipping rules can affect carrier choice.", "Fragile packaging requires inspection on U.S. receipt."]
    },
    quote: [
      ["Retailer item", 168],
      ["U.S. tax estimate", 13],
      ["U.S. domestic shipping", 0],
      ["Import duty reserve", 32],
      ["Freight and handling", 36],
      ["Local delivery", 9],
      ["Concierge service", 34]
    ],
    timeline: ["Natural-language request normalized", "Quote assembled and waiting for customer approval"]
  },
  {
    id: "SBWG-20260725-0009",
    customer: "Andres V.",
    channel: "URL",
    status: "in_transit",
    dueBy: "ETA Aug 2",
    title: "Leather accessory set",
    source: "U.S. accessories retailer link",
    delivery: "San Jose pickup",
    brief: {
      product: "Leather accessory set candidate",
      variant: "Warm taupe, structured case and small travel accessories",
      retailerPrice: "$184.95",
      extractedFrom: "Customer URL",
      questions: ["No open shopper questions."],
      risks: ["Finish and color should be inspected on U.S. receipt."]
    },
    quote: [
      ["Retailer item", 185],
      ["U.S. tax estimate", 15],
      ["U.S. domestic shipping", 0],
      ["Import duty reserve", 35],
      ["Freight and handling", 28],
      ["Local delivery", 0],
      ["Concierge service", 28]
    ],
    timeline: ["Purchased in U.S.", "Received at Miami consolidation point", "Dispatched to Costa Rica"]
  }
];

let selectedId = requests[0].id;
let activeFilter = "all";
let activeSlideIndex = 0;
let sampleProgressIndex = statuses.findIndex((status) => status.id === "quoted");

const dashboard = document.querySelector("#dashboard");
const accessForm = document.querySelector("#access-form");
const lockButton = document.querySelector("#lock-button");
const requestList = document.querySelector("#request-list");
const statusFilter = document.querySelector("#status-filter");
const statusSelect = document.querySelector("#status-select");

function statusLabel(statusId) {
  return statuses.find((status) => status.id === statusId)?.label || statusId;
}

function selectedRequest() {
  return requests.find((request) => request.id === selectedId) || requests[0];
}

function enterWorkspace() {
  dashboard.classList.remove("hidden");
  dashboard.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  renderWorkspace();
}

function lockWorkspace() {
  dashboard.classList.add("hidden");
  document.querySelector("#team-access").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function renderCarousel() {
  const tabs = document.querySelector("#carousel-tabs");
  const activeSlide = marketingContent.carouselSlides[activeSlideIndex];

  tabs.replaceChildren(
    ...marketingContent.carouselSlides.map((slide, index) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.id = `carousel-tab-${slide.id}`;
      tab.className = `carousel-tab ${index === activeSlideIndex ? "active" : ""}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(index === activeSlideIndex));
      tab.setAttribute("aria-controls", "carousel-stage");
      tab.textContent = slide.category;
      tab.addEventListener("click", () => setActiveSlide(index));
      return tab;
    })
  );

  document.querySelector("#carousel-stage").replaceChildren(createSlide(activeSlide));
  document.querySelector("#carousel-live").textContent = `${activeSlide.eyebrow}: ${activeSlide.title}`;
  renderMarketingSurface();
}

function setActiveSlide(index) {
  activeSlideIndex = (index + marketingContent.carouselSlides.length) % marketingContent.carouselSlides.length;
  renderCarousel();
}

function createSlide(slide) {
  const article = document.createElement("article");
  article.className = "carousel-slide";
  article.setAttribute("role", "tabpanel");
  article.setAttribute("aria-labelledby", `carousel-tab-${slide.id}`);
  article.innerHTML = `
    <figure class="campaign-image">
      <img src="${slide.imageSrc}" alt="${slide.imageAlt}" style="object-position: ${slide.imagePosition}" />
    </figure>
    <div class="slide-copy">
      <p class="eyebrow">${slide.eyebrow}</p>
      <h3>${slide.title}</h3>
      <p>${slide.description}</p>
      <dl>
        <div>
          <dt>Category</dt>
          <dd>${slide.productName}</dd>
        </div>
        <div>
          <dt>Quote state</dt>
          <dd>${slide.priceLabel}</dd>
        </div>
      </dl>
    </div>
  `;
  return article;
}

function renderMarketingSurface() {
  document.querySelector("#hero-title").textContent = marketingContent.campaignWindow.headline;
  document.querySelector("#campaign-window-badge").textContent =
    `${marketingContent.campaignWindow.name}: ${marketingContent.campaignWindow.startsAt} to ${marketingContent.campaignWindow.endsAt}`;
}

function renderSampleProgress() {
  const track = document.querySelector("#sample-progress-track");
  document.querySelector("#sample-progress-label").textContent = statuses[sampleProgressIndex].label;
  track.replaceChildren(...createProgressItems(sampleProgressIndex));
}

function createProgressItems(activeIndex) {
  return statuses.map((status, index) => {
    const item = document.createElement("li");
    item.className = index <= activeIndex ? "complete" : "";
    item.innerHTML = `<span>${index + 1}</span><strong>${status.label}</strong>`;
    return item;
  });
}

function renderWorkspace() {
  renderStatusControls();
  renderMetrics();
  renderStatusTrack();
  renderRequestList();
  renderDetails();
  renderManagerContent();
}

function renderStatusControls() {
  if (!statusFilter.dataset.ready) {
    statuses.forEach((status) => {
      statusFilter.append(new Option(status.label, status.id));
    });
    statusFilter.dataset.ready = "true";
  }

  statusSelect.replaceChildren(...statuses.map((status) => new Option(status.label, status.id)));
  statusSelect.value = selectedRequest().status;
}

function renderMetrics() {
  document.querySelector("#metric-open").textContent = requests.filter((request) => request.status !== "delivered").length;
  document.querySelector("#metric-quoted").textContent = requests.filter((request) => request.status === "quoted").length;
  document.querySelector("#metric-transit").textContent = requests.filter((request) => request.status === "in_transit").length;
}

function renderStatusTrack() {
  const selected = selectedRequest();
  const selectedIndex = statuses.findIndex((status) => status.id === selected.status);
  document.querySelector("#status-track").replaceChildren(...createProgressItems(selectedIndex));
}

function renderRequestList() {
  const visible = requests.filter((request) => activeFilter === "all" || request.status === activeFilter);
  requestList.replaceChildren(
    ...visible.map((request) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `request-row ${request.id === selectedId ? "active" : ""}`;
      button.innerHTML = `
        <span>
          <strong>${request.title}</strong>
          <small>${request.customer} - ${request.id}</small>
        </span>
        <span>
          <em>${statusLabel(request.status)}</em>
          <small>${request.dueBy}</small>
        </span>
      `;
      button.addEventListener("click", () => {
        selectedId = request.id;
        renderWorkspace();
      });
      return button;
    })
  );
}

function renderDetails() {
  const request = selectedRequest();
  document.querySelector("#detail-title").textContent = request.title;
  document.querySelector("#detail-meta").textContent = `${request.customer} - ${request.channel} - ${request.delivery}`;
  document.querySelector("#detail-status").textContent = statusLabel(request.status);

  document.querySelector("#brief-fields").replaceChildren(
    field("Product", request.brief.product),
    field("Variant", request.brief.variant),
    field("Retailer price", request.brief.retailerPrice),
    field("Source", request.source),
    field("Extracted from", request.brief.extractedFrom)
  );
  renderList("#brief-questions", request.brief.questions);
  renderList("#brief-risks", request.brief.risks);
  renderQuote(request);
  renderTimeline(request);
  statusSelect.value = request.status;
}

function renderManagerContent() {
  document.querySelector("#campaign-headline").value = marketingContent.campaignWindow.headline;
  document.querySelector("#campaign-window").value =
    `${marketingContent.campaignWindow.startsAt} to ${marketingContent.campaignWindow.endsAt}`;
  document.querySelector("#featured-slide").replaceChildren(
    ...marketingContent.carouselSlides.map((slide) => new Option(`${slide.category}: ${slide.title}`, slide.id))
  );
  document.querySelector("#featured-slide").value = marketingContent.carouselSlides[activeSlideIndex].id;
  document.querySelector("#approved-feedback").replaceChildren(
    ...marketingContent.testimonials.map((testimonial) => new Option(testimonial.customerName, testimonial.id))
  );
  document.querySelector("#approved-feedback").value =
    marketingContent.testimonials.find((testimonial) => testimonial.approvedForCarousel)?.id || marketingContent.testimonials[0].id;
  document.querySelector("#content-review").replaceChildren(
    ...marketingContent.carouselSlides.map((slide) => {
      const item = document.createElement("article");
      item.className = "content-chip";
      item.innerHTML = `<strong>${slide.category}</strong><span>${slide.title}</span>`;
      return item;
    })
  );
}

function field(label, value) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
  return wrapper;
}

function renderList(selector, items) {
  const list = document.querySelector(selector);
  list.replaceChildren(
    ...items.map((item) => {
      const element = document.createElement("li");
      element.textContent = item;
      return element;
    })
  );
}

function renderQuote(request) {
  const quoteGrid = document.querySelector("#quote-grid");
  const rows = request.quote.map(([label, amount]) => quoteRow(label, amount));
  const total = request.quote.reduce((sum, [, amount]) => sum + amount, 0);
  rows.push(quoteRow("Preliminary customer total", total, true));
  quoteGrid.replaceChildren(...rows);
}

function quoteRow(label, amount, total = false) {
  const row = document.createElement("div");
  row.className = total ? "quote-row total" : "quote-row";
  row.innerHTML = `<span>${label}</span><strong>$${amount.toFixed(2)}</strong>`;
  return row;
}

function renderTimeline(request) {
  document.querySelector("#timeline").replaceChildren(
    ...request.timeline.map((entry) => {
      const item = document.createElement("li");
      item.textContent = entry;
      return item;
    })
  );
}

function addTimeline(request, entry) {
  request.timeline.unshift(entry);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

document.querySelector("#carousel-prev").addEventListener("click", () => setActiveSlide(activeSlideIndex - 1));
document.querySelector("#carousel-next").addEventListener("click", () => setActiveSlide(activeSlideIndex + 1));
document.querySelector("#sample-progress-next").addEventListener("click", () => {
  sampleProgressIndex = Math.min(sampleProgressIndex + 1, statuses.length - 1);
  renderSampleProgress();
});

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  enterWorkspace();
});

lockButton.addEventListener("click", lockWorkspace);

statusFilter.addEventListener("change", () => {
  activeFilter = statusFilter.value;
  renderRequestList();
});

document.querySelector("#save-content").addEventListener("click", () => {
  marketingContent.campaignWindow.headline =
    document.querySelector("#campaign-headline").value.trim() || "The U.S. find you want, made simple";
  const campaignWindow = document.querySelector("#campaign-window").value.trim();
  if (campaignWindow) {
    const [startsAt, endsAt] = campaignWindow.split(" to ");
    marketingContent.campaignWindow.startsAt = startsAt || marketingContent.campaignWindow.startsAt;
    marketingContent.campaignWindow.endsAt = endsAt || marketingContent.campaignWindow.endsAt;
  }
  const selectedSlideId = document.querySelector("#featured-slide").value;
  activeSlideIndex = marketingContent.carouselSlides.findIndex((slide) => slide.id === selectedSlideId);
  marketingContent.testimonials.forEach((testimonial) => {
    testimonial.approvedForCarousel = testimonial.id === document.querySelector("#approved-feedback").value;
  });
  renderCarousel();
  renderManagerContent();
});

document.querySelector("#request-details").addEventListener("click", () => {
  const request = selectedRequest();
  const input = document.querySelector("#missing-detail-input");
  const detail = input.value.trim() || "Customer follow-up requested for missing decision.";
  request.status = "needs_details";
  request.brief.questions.unshift(detail);
  addTimeline(request, `Operator requested details: ${detail}`);
  input.value = "";
  renderWorkspace();
});

document.querySelector("#apply-quote").addEventListener("click", () => {
  const request = selectedRequest();
  request.status = "quoted";
  addTimeline(request, "Transparent quote draft saved for human verification.");
  renderWorkspace();
});

document.querySelector("#advance-status").addEventListener("click", () => {
  const request = selectedRequest();
  request.status = statusSelect.value;
  addTimeline(request, `Status advanced to ${statusLabel(request.status)}.`);
  renderWorkspace();
});

renderCarousel();
renderSampleProgress();
