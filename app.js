const data = [
    {
        title: "melligold",
        url: "https://melligold.com/pwa/account/?ref=MG3mZi3oosvA",
        cat: "GOLD",
        image: "Assets/melligold.webp"
    },
    {
        title: "milli.gold",
        url: "https://milli.gold/app/sign-up?referralCode=milli-yojyh",
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
        image: "Assets/gsmcup.jpg"
    },
    {
        title: "Bitpin",
        url: "https://bitpin.ir/signup/?refcode=MXPiJCOE",
        cat: "EXCHANGE",
        image: "Assets/bitpin.jpg"
    },
    {
        title: "Nobitex",
        url: "https://nobitex.ir/signup/?refcode=42875",
        cat: "EXCHANGE",
        image: "Assets/nobitex.jpg"
    }
];

let active = "All";

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const tags = document.getElementById("tags");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");
const themeToggle = document.getElementById("theme-toggle");
const themeColorMeta = document.getElementById("theme-color-meta");

// --- مدیریت تم ---
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeColorMeta(savedTheme);
}

function toggleTheme() {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeColorMeta(newTheme);
}

function updateThemeColorMeta(theme) {
    if (themeColorMeta) {
        themeColorMeta.content =
            theme === "dark" ? "#0b1220" : "#f3f4f6";
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}

initTheme();

// --- Toast ---
let toastTimeout;

function showToast(message) {
    if (!toast || !toastMessage) return;

    clearTimeout(toastTimeout);

    toastMessage.textContent = message;
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// --- Debounce ---
function debounce(func, wait) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

// --- دسته‌بندی‌ها ---
function renderTags() {
    const cats = ["All", ...new Set(data.map(item => item.cat))];

    tags.innerHTML = "";

    cats.forEach(cat => {
        const tag = document.createElement("button");

        tag.type = "button";
        tag.className = `tag${cat === active ? " active" : ""}`;
        tag.textContent = cat === "All" ? "همه" : cat;
        tag.dataset.cat = cat;

        tags.appendChild(tag);
    });
}

tags.addEventListener("click", (e) => {
    const tag = e.target.closest(".tag");

    if (!tag) return;

    active = tag.dataset.cat;

    renderTags();
    render();
});

// --- فیلتر ---
function getFilteredData() {
    const value = search.value.trim().toLowerCase();

    return data.filter(item => {
        const matchesCategory =
            active === "All" || item.cat === active;

        const matchesSearch =
            item.title.toLowerCase().includes(value) ||
            item.cat.toLowerCase().includes(value);

        return matchesCategory && matchesSearch;
    });
}

// --- کارت ---
function createCard(item) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.url = item.url;

    card.innerHTML = `
        <img
            src="${item.image}"
            alt="${item.title}"
            loading="lazy"
            onerror="this.src='Assets/default.png'"
        >
        <div class="content">
            <div class="title">${item.title}</div>
            <div class="cat">${item.cat}</div>
            <div class="btns">
                <button type="button" class="btn open" data-action="open">
                    باز کردن
                </button>
                <button type="button" class="btn copy" data-action="copy">
                    کپی
                </button>
            </div>
        </div>
    `;

    return card;
}

// --- رویداد کارت‌ها ---
grid.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");

    if (!btn) return;

    const card = btn.closest(".card");

    if (!card) return;

    const url = card.dataset.url;

    if (btn.dataset.action === "open") {
        window.open(url, "_blank", "noopener,noreferrer");
    }

    if (btn.dataset.action === "copy") {
        try {
            await navigator.clipboard.writeText(url);
            showToast("لینک با موفقیت کپی شد!");
        } catch (error) {
            fallbackCopy(url);
            showToast("لینک کپی شد!");
        }
    }
});

// --- کپی جایگزین ---
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

// --- رندر ---
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

    const fragment = document.createDocumentFragment();

    filteredData.forEach(item => {
        fragment.appendChild(createCard(item));
    });

    grid.appendChild(fragment);
}

// --- جستجو ---
search.addEventListener(
    "input",
    debounce(render, 150)
);

// --- اجرا ---
renderTags();
render();
