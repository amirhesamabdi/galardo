const data = [
{
title:"Binance",
url:"https://example.com",
cat:"Crypto"
},
{
title:"OpenAI",
url:"https://example.com",
cat:"AI"
},
{
title:"Hosting",
url:"https://example.com",
cat:"Tools"
},
{
title:"Amazon",
url:"https://example.com",
cat:"Shop"
}
];

let active = "All";

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const tags = document.getElementById("tags");

function renderTags(){
const cats = ["All", ...new Set(data.map(d => d.cat))];

tags.innerHTML = "";

cats.forEach(c => {
const el = document.createElement("div");
el.className = "tag" + (c === active ? " active" : "");
el.innerText = c;

el.onclick = () => {
active = c;
renderTags();
render();
};

tags.appendChild(el);
});
}

function render(){
grid.innerHTML = "";

const val = search.value.toLowerCase();

data
.filter(d => {
return (active === "All" || d.cat === active)
&& d.title.toLowerCase().includes(val);
})
.forEach(d => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<div class="title">${d.title}</div>
<div class="cat">${d.cat}</div>
<div class="btns">
<button class="open">باز کردن</button>
<button class="copy">کپی</button>
</div>
`;

card.querySelector(".open").onclick = () => {
window.open(d.url, "_blank");
};

card.querySelector(".copy").onclick = () => {
navigator.clipboard.writeText(d.url);
};

grid.appendChild(card);
});
}

search.addEventListener("input", render);

renderTags();
render();
