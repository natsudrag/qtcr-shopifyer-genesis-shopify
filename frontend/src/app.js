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

const requests = [
  {
    id: "QTCR-20260726-0004",
    customer: "Mariana R.",
    channel: "URL",
    status: "new",
    priority: "High",
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
    priority: "Medium",
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
    priority: "High",
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
      risks: ["Electronics warranty service may require U.S. return routing.", "Battery shipping rules can affect carrier choice."]
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
    priority: "Normal",
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

const accessScreen = document.querySelector("#access-screen");
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
  accessScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");
  renderWorkspace();
}

function lockWorkspace() {
  dashboard.classList.add("hidden");
  accessScreen.classList.remove("hidden");
}

function renderWorkspace() {
  renderStatusControls();
  renderMetrics();
  renderStatusTrack();
  renderRequestList();
  renderDetails();
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
  const track = document.querySelector("#status-track");
  track.replaceChildren(
    ...statuses.map((status, index) => {
      const item = document.createElement("li");
      item.className = index <= selectedIndex ? "complete" : "";
      item.innerHTML = `<span>${index + 1}</span><strong>${status.label}</strong>`;
      return item;
    })
  );
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

accessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  enterWorkspace();
});

lockButton.addEventListener("click", lockWorkspace);

statusFilter.addEventListener("change", () => {
  activeFilter = statusFilter.value;
  renderRequestList();
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
