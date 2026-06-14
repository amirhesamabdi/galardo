const links = [

{
title:"Binance",
category:"Crypto",
image:"https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
url:"https://your-ref-link.com"
},

{
title:"OpenAI",
category:"AI",
image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
url:"https://your-ref-link.com"
},

{
title:"DigitalOcean",
category:"Hosting",
image:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
url:"https://your-ref-link.com"
},

{
title:"Amazon",
category:"Shopping",
image:"https://images.unsplash.com/photo-1523475472560-d2df97ec485c?w=800",
url:"https://your-ref-link.com"
}

];

let currentCategory = "همه";

const grid = document.getElementById("linksGrid");
const searchInput = document.getElementById("search");
const categoriesDiv = document.getElementById("categories");

function renderCategories(){

const categories = [
"همه",
...new Set(links.map(x=>x.category))
];

categoriesDiv.innerHTML = "";

categories.forEach(cat=>{

const btn = document.createElement("button");

btn.className =
cat === currentCategory
? "category-btn active"
: "category-btn";

btn.textContent = cat;

btn.onclick = ()=>{

currentCategory = cat;

renderCategories();
renderLinks();
};

categoriesDiv.appendChild(btn);

});

}

function renderLinks(){

const search =
searchInput.value.toLowerCase();

grid.innerHTML = "";

const filtered = links.filter(link=>{

const matchSearch =
link.title.toLowerCase().includes(search);

const matchCategory =
currentCategory === "همه"
|| link.category === currentCategory;

return matchSearch && matchCategory;

});

filtered.forEach(link=>{

const card = document.createElement("div");

card.className = "card";

card.innerHTML = `
<img src="${link.image}">
<div class="content">
<div class="title">${link.title}</div>
<div class="category">${link.category}</div>

<div class="actions">

<button class="btn open-btn">
باز کردن
</button>

<button class="btn copy-btn">
کپی
</button>

</div>
</div>
`;

card.querySelector(".open-btn")
.onclick = ()=>{

window.open(link.url,"_blank");

};

card.querySelector(".copy-btn")
.onclick = ()=>{

navigator.clipboard.writeText(link.url);

alert("لینک کپی شد");

};

grid.appendChild(card);

});

}

searchInput.addEventListener(
"input",
renderLinks
);

renderCategories();
renderLinks();
