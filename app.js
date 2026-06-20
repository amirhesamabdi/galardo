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
        image: "Assets/MilliLogo.png"
    },
    {
        title: "Bitpin",
        url: "https://bitpin.ir/signup/?refcode=KNvMoSXH",
        cat: "EXCHANGE",
        image: "https://bitpin.ir/static/bitpin-logo.png"
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

// --- مدیریت تم (Dark/Light Mode) ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeColorMeta(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeColorMeta(newTheme);
}

function updateThemeColorMeta(theme) {
    if (themeColorMeta) {
        themeColorMeta.content = theme === 'dark' ? '#0b1220' : '#f3f4f6';
    }
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// --- سیستم پیام Toast ---
let toastTimeout;
function showToast(message) {
    clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// --- بهینه‌سازی جستجو با Debounce ---
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// --- رندر دسته‌بندی‌ها ---
function renderTags() {
    const cats = ["All", ...new Set(data.map(item => item.cat))];
    tags.innerHTML = "";

    cats.forEach(cat => {
        const tag = document.createElement("button");
        tag.type = "button";
        tag.className = "tag" + (cat === active ? " active" : "");
        tag.textContent = cat === "All" ? "همه" : cat;
        tag.dataset.cat = cat; // برای Event Delegation
        tags.appendChild(tag);
    });
}

// --- Event Delegation برای دسته‌بندی‌ها ---
tags.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        active = e.target.dataset.cat;
        renderTags();
        render();
    }
});

// --- فیلتر کردن داده‌ها ---
function getFilteredData() {
    const value = search.value.trim().toLowerCase();
    return data.filter(item => {
        const matchesCategory = active === "All" || item.cat === active;
        const matchesSearch = item.title.toLowerCase().includes(value) || item.cat.toLowerCase().includes(value);
        return matchesCategory && matchesSearch;
    });
}

// --- ساخت کارت ---
function createCard(item) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.url = item.url; // ذخیره لینک برای Event Delegation

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
    openButton.className = "btn open";
    openButton.textContent = "باز کردن";
    openButton.dataset.action = "open";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "btn copy";
    copyButton.textContent = "کپی";
    copyButton.dataset.action = "copy";

    buttons.append(openButton, copyButton);
    content.append(title, category, buttons);
    card.append(image, content);

    return card;
}

// --- Event Delegation برای کارت‌ها (بسیار مهم برای سرعت) ---
grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const card = btn.closest('.card');
    if (!card) return;
    
    const url = card.dataset.url;

    if (btn.dataset.action === 'open') {
        window.open(url, "_blank", "noopener,noreferrer");
    } else if (btn.dataset.action === 'copy') {
        try {
            await navigator.clipboard.writeText(url);
            showToast("لینک با موفقیت کپی شد!");
        } catch (err) {
            fallbackCopy(url);
            showToast("لینک کپی شد!");
        }
    }
});

// --- متد جایگزین برای کپی در مرورگرهای قدیمی ---
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

// --- رندر کردن لیست ---
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

    // استفاده از DocumentFragment برای افزایش سرعت رندر
    const fragment = document.createDocumentFragment();
    filteredData.forEach(item => {
        fragment.appendChild(createCard(item));
    });
    grid.appendChild(fragment);
}

// --- اتصال رویداد جستجو با Debounce ---
search.addEventListener("input", debounce(render, 150));

// --- اجرای اولیه ---
renderTags();
render();
