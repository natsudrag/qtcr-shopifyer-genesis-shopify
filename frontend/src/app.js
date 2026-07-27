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
    name: "Summer travel drop",
    headline: "The U.S. find you want, made simple",
    startsAt: "Jul 27",
    endsAt: "Aug 16",
    status: "Draft"
  },
  carouselSlides: [
    {
      id: "carry-on",
      type: "curated_product",
      eyebrow: "Curated find",
      title: "Cherry carry-on, Costa Rica-ready",
      description:
        "A verified luggage request with color fallback, freight checks, and a clear landed-cost range.",
      productName: "Expandable carry-on",
      priceLabel: "Estimate $451 - $490 landed",
      accent: "cherry"
    },
    {
      id: "headphones",
      type: "curated_product",
      eyebrow: "Verified quote",
      title: "Travel headphones without checkout surprises",
      description:
        "Sourced from a U.S. retailer, checked for warranty risk, battery shipping rules, and local delivery.",
      productName: "Noise-canceling headphones",
      priceLabel: "Estimate $462 - $514 landed",
      accent: "emerald"
    },
    {
      id: "feedback",
      type: "customer_feedback",
      eyebrow: "Customer feedback",
      title: "They made the total clear before I said yes.",
      description:
        "Mock testimonial highlighting quote transparency, human verification, and delivery progress updates.",
      productName: "Beauty bundle",
      priceLabel: "Delivered to Escazu",
      accent: "lilac"
    }
  ],
  testimonials: [
    {
      id: "clear-total",
      customerName: "Sofia M.",
      quote: "Qtcr showed the product price, import reserve, handling, and delivery before checkout.",
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
    id: "QTCR-20260726-0004",
    customer: "Mariana R.",
    channel: "URL",
    status: "new",
    dueBy: "Today 4:00 PM",
    title: "Cherry red Away carry-on",
    source: "awaytravel.com",
    delivery: "San Jose pickup",
    brief: {
      product: "Away Bigger Carry-On Flex",
      variant: "Cherry red, carry-on size, expandable hard shell",
      retailerPrice: "$295.00",
      extractedFrom: "Customer URL",
      questions: ["Confirm if comparable red is acceptable if limited edition color is gone.", "Choose speed versus lowest landed cost."],
      risks: ["Dimensional weight can affect freight.", "Retailer return window may close before Costa Rica delivery."]
    },
    quote: [
      ["Retailer item", 295],
      ["U.S. tax estimate", 22],
      ["U.S. domestic shipping", 0],
      ["Import duty reserve", 54],
      ["Freight and handling", 68],
      ["Local delivery", 12],
      ["Concierge service", 39]
    ],
    timeline: ["Request received from product URL", "AI brief prepared with low confidence on color availability"]
  },
  {
    id: "QTCR-20260726-0003",
    customer: "Diego P.",
    channel: "Screenshot",
    status: "needs_details",
    dueBy: "Tomorrow",
    title: "Ivory platform sandals",
    source: "Screenshot from Nordstrom",
    delivery: "GAM courier",
    brief: {
      product: "Designer platform sandal candidate",
      variant: "Ivory, size not visible, block heel",
      retailerPrice: "$128.00",
      extractedFrom: "Customer screenshot",
      questions: ["Ask for shoe size and acceptable heel height.", "Confirm whether a similar brand is acceptable."],
      risks: ["Footwear fit returns are difficult after import.", "Screenshot price needs live source verification."]
    },
    quote: [
      ["Retailer item", 128],
      ["U.S. tax estimate", 10],
      ["U.S. domestic shipping", 8],
      ["Import duty reserve", 24],
      ["Freight and handling", 31],
      ["Local delivery", 10],
      ["Concierge service", 25]
    ],
    timeline: ["Screenshot request received", "Missing size and substitute preference requested"]
  },
  {
    id: "QTCR-20260726-0002",
    customer: "Sofia M.",
    channel: "Request",
    status: "quoted",
    dueBy: "Quote expires Friday",
    title: "Noise-canceling headphones",
    source: "Concierge sourced",
    delivery: "Escazu courier",
    brief: {
      product: "Sony WH-1000XM5",
      variant: "Black, new, U.S. warranty",
      retailerPrice: "$328.00",
      extractedFrom: "Natural-language request",
      questions: ["Confirm black over silver.", "Confirm U.S. warranty tradeoff."],
      risks: ["Electronics warranty support may require U.S. return routing.", "Battery shipping rules can affect carrier choice."]
    },
    quote: [
      ["Retailer item", 328],
      ["U.S. tax estimate", 25],
      ["U.S. domestic shipping", 0],
      ["Import duty reserve", 48],
      ["Freight and handling", 42],
      ["Local delivery", 9],
      ["Concierge service", 36]
    ],
    timeline: ["Natural-language request normalized", "Quote assembled and waiting for customer approval"]
  },
  {
    id: "QTCR-20260725-0009",
    customer: "Andres V.",
    channel: "URL",
    status: "in_transit",
    dueBy: "ETA Aug 2",
    title: "Camera lens filter kit",
    source: "bhphotovideo.com",
    delivery: "San Jose pickup",
    brief: {
      product: "Tiffen 67mm filter kit",
      variant: "UV, CPL, ND set",
      retailerPrice: "$84.95",
      extractedFrom: "Customer URL",
      questions: ["No open shopper questions."],
      risks: ["Fragile accessory packaging requires inspection on receipt."]
    },
    quote: [
      ["Retailer item", 85],
      ["U.S. tax estimate", 7],
      ["U.S. domestic shipping", 0],
      ["Import duty reserve", 15],
      ["Freight and handling", 21],
      ["Local delivery", 0],
      ["Concierge service", 18]
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
      tab.textContent = slide.eyebrow;
      tab.addEventListener("click", () => setActiveSlide(index));
      return tab;
    })
  );

  document.querySelector("#carousel-stage").replaceChildren(createSlide(activeSlide));
  document.querySelector("#carousel-live").textContent = `${activeSlide.eyebrow}: ${activeSlide.title}`;
  renderMarketingSurface();
}

function renderMarketingSurface() {
  document.querySelector("#hero-title").textContent = marketingContent.campaignWindow.headline;
  document.querySelector("#campaign-window-badge").textContent =
    `${marketingContent.campaignWindow.name}: ${marketingContent.campaignWindow.startsAt} to ${marketingContent.campaignWindow.endsAt}`;
}

function setActiveSlide(index) {
  activeSlideIndex = (index + marketingContent.carouselSlides.length) % marketingContent.carouselSlides.length;
  renderCarousel();
}

function createSlide(slide) {
  const article = document.createElement("article");
  article.className = `carousel-slide accent-${slide.accent}`;
  article.setAttribute("role", "tabpanel");
  article.setAttribute("aria-labelledby", `carousel-tab-${slide.id}`);
  article.innerHTML = `
    <div class="product-poster ${slide.id}" role="img" aria-label="${slide.productName} editorial product visual">
      <span class="poster-price">${slide.priceLabel}</span>
      <span class="poster-object"></span>
      <span class="poster-shadow"></span>
    </div>
    <div class="slide-copy">
      <p class="eyebrow">${slide.type === "customer_feedback" ? "Verified feedback" : "Curated product find"}</p>
      <h3>${slide.title}</h3>
      <p>${slide.description}</p>
      <span>${slide.productName}</span>
    </div>
  `;
  return article;
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
    ...marketingContent.carouselSlides.map((slide) => new Option(slide.title, slide.id))
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
      item.innerHTML = `<strong>${slide.title}</strong><span>${slide.type.replace("_", " ")}</span>`;
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
