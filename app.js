const data = [
  {
    title: "melligold",
    url: "https://melligold.com/pwa/account/?ref=MG3mZi3oosvA",
    cat: "GOLD",
    image: "Assets/melligold.webp"
  },
  {
    title: "milli.gold",
    url: "https://milli.gold/",
    cat: "GOLD",
    image: "Assets/MilliLogo.png"
  },
  {
    title: "Talasea",
    url: "http://talasea.ir/onboarding?r=COBdbQnU",
    cat: "GOLD",
    image: "Assets/Talasea.jpg"
  },
  {
    title: "GSM CUP",
    url: "https://cup.gsm.ir/?ref=ZWX876B",
    cat: "GAME",
    image: "Assets/MilliLogo.png"
  }
];

let active = "All";

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const tags = document.getElementById("tags");

function renderTags() {
  const cats = ["All", ...new Set(data.map(item => item.cat))];

  tags.innerHTML = "";

  cats.forEach(cat => {
    const tag = document.createElement("button");
    tag.type = "button";
    tag.className = "tag" + (cat === active ? " active" : "");
    tag.textContent = cat === "All" ? "همه" : cat;

    tag.addEventListener("click", () => {
      active = cat;
      renderTags();
      render();
    });

    tags.appendChild(tag);
  });
}

function getFilteredData() {
  const value = search.value.trim().toLowerCase();

  return data.filter(item => {
    const matchesCategory = active === "All" || item.cat === active;
    const matchesSearch =
      item.title.toLowerCase().includes(value) ||
      item.cat.toLowerCase().includes(value);

    return matchesCategory && matchesSearch;
  });
}

function createCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.title;
  image.loading = "lazy";

  const content = document.createElement("div");
  content.className = "content";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = item.title;

  const category = document.createElement("div");
  category.className = "cat";
  category.textContent = item.cat;

  const buttons = document.createElement("div");
  buttons.className = "btns";

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "open";
  openButton.textContent = "باز کردن";
  openButton.addEventListener("click", () => {
    window.open(item.url, "_blank", "noopener,noreferrer");
  });

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "copy";
  copyButton.textContent = "کپی";
  copyButton.addEventListener("click", () => copyLink(item.url, copyButton));

  buttons.append(openButton, copyButton);
  content.append(title, category, buttons);
  card.append(image, content);

  return card;
}

async function copyLink(url, button) {
  const defaultText = "کپی";

  try {
    await navigator.clipboard.writeText(url);
    button.textContent = "کپی شد";
    button.classList.add("copied");
  } catch {
    fallbackCopy(url);
    button.textContent = "کپی شد";
    button.classList.add("copied");
  }

  setTimeout(() => {
    button.textContent = defaultText;
    button.classList.remove("copied");
  }, 1400);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function render() {
  grid.innerHTML = "";

  const filteredData = getFilteredData();

  if (filteredData.length === 0) {
    const empty = document.createElement("div");
    empty.className = "no-result";
    empty.textContent = "موردی پیدا نشد";
    grid.appendChild(empty);
    return;
  }

  filteredData.forEach(item => {
    grid.appendChild(createCard(item));
  });
}

search.addEventListener("input", render);

renderTags();
render();
