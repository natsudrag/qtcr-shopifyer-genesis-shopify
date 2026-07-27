const modeConfig = {
  url: {
    label: "Product URL",
    placeholder:
      "Paste a product link from Amazon, Nike, Sephora, Best Buy, or another U.S. store.",
    item: "Retro red carry-on suitcase",
    source: "Customer URL",
    variant: "Cabin size, cherry red, hard shell",
    cost: "$164 - $212",
    questions: [
      "Is a close color match acceptable if cherry red sells out?",
      "Should we prioritize lowest landed cost or fastest arrival?"
    ],
    risks: [
      "Bulky-item dimensional weight may change freight pricing.",
      "Return feasibility depends on retailer window and condition rules."
    ]
  },
  screenshot: {
    label: "Screenshot notes",
    placeholder:
      "Describe the screenshot or paste any visible product details: store, color, size, price, and quantity.",
    item: "Cream platform sandals from screenshot",
    source: "Customer screenshot",
    variant: "Size 8, ivory, block heel",
    cost: "$92 - $138",
    questions: [
      "Should the concierge match this exact heel height?",
      "Is a substitute brand acceptable if the screenshot item is unavailable?"
    ],
    risks: [
      "Screenshot prices can be stale and need source verification.",
      "Footwear returns may be limited once imported."
    ]
  },
  natural: {
    label: "Shopping request",
    placeholder:
      "Tell us what you want: product type, brand preferences, must-haves, budget, and when you need it.",
    item: "High-end noise-canceling headphones",
    source: "Natural-language request",
    variant: "Over-ear, travel case, neutral color",
    cost: "$248 - $336",
    questions: [
      "Do you prefer Apple, Sony, Bose, or best value across brands?",
      "Should the quote include a protective case or only the headphones?"
    ],
    risks: [
      "Electronics warranty support may require U.S. return routing.",
      "Lithium battery shipping rules can affect carrier choice."
    ]
  }
};

const tabs = document.querySelectorAll(".mode-tab");
const requestLabel = document.querySelector("#request-label");
const requestInput = document.querySelector("#request-input");
const form = document.querySelector("#request-form");

let currentMode = "url";

function setBrief(mode) {
  const brief = modeConfig[mode];
  document.querySelector("#brief-item").textContent = brief.item;
  document.querySelector("#brief-source").textContent = brief.source;
  document.querySelector("#brief-variant").textContent = brief.variant;
  document.querySelector("#brief-cost").textContent = brief.cost;
  renderList("#brief-questions", brief.questions);
  renderList("#brief-risks", brief.risks);
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

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentMode = tab.dataset.mode;
    const config = modeConfig[currentMode];
    tabs.forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });
    requestLabel.textContent = config.label;
    requestInput.placeholder = config.placeholder;
    setBrief(currentMode);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  setBrief(currentMode);
  document.querySelector("#brief").scrollIntoView({ behavior: "smooth", block: "start" });
});

setBrief(currentMode);
