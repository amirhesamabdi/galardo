const data = [
{
title:"melligold",
url:"https://melligold.com/pwa/account/?ref=MG3mZi3oosvA",
cat:"GOLD",
image:"Assets/melligold.webp"
},
{
title:"milli.gold",
url:"https://milli.gold/",
cat:"GOLD",
image:"Assets/MilliLogo.png"
},
{
title:"Talasea",
url:"http://talasea.ir/onboarding?r=COBdbQnU",
cat:"GOLD",
image:"Assets/Talasea.jpg"
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
.filter(d =>
(active === "All" || d.cat === active) &&
d.title.toLowerCase().includes(val)
)
.forEach(d => {

const card = document.createElement("div");
card.className = "card";

card.innerHTML = `
<img src="${d.image}">
<div class="content">
  <div class="title">${d.title}</div>
  <div class="cat">${d.cat}</div>
  <div class="btns">
    <button class="open">باز کردن</button>
    <button class="copy">کپی</button>
  </div>
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
