const products = [
  {
    name: "Smartphone",
    category: "electronics",
    price: 299,
    rating: 4.5,
    image: "images/smartphone.jpg",
    subProducts: [
      { name: "Phone Case", price: 15 },
      { name: "Screen Protector", price: 10 }
    ]
  },
  {
    name: "Laptop",
    category: "electronics",
    price: 899,
    rating: 4.7,
    image: "images/laptop.jpg",
    subProducts: [
      { name: "Wireless Mouse", price: 25 },
      { name: "Laptop Stand", price: 30 }
    ]
  },
  {
    name: "Headphones",
    category: "electronics",
    price: 199,
    rating: 4.3,
    image: "images/headphones.jpg",
    subProducts: [
      { name: "Ear Cushions", price: 20 },
      { name: "Carrying Case", price: 15 }
    ]
  },
  {
    name: "Novel",
    category: "books",
    price: 15,
    rating: 4.2,
    image: "images/novel.jpg",
    subProducts: [
      { name: "Bookmark Set", price: 5 },
      { name: "Reading Light", price: 10 }
    ]
  },
  {
    name: "Notebook",
    category: "books",
    price: 8,
    rating: 4.0,
    image: "images/notebook.jpg",
    subProducts: [
      { name: "Pen Set", price: 7 },
      { name: "Sticky Notes", price: 3 }
    ]
  },
  {
    name: "Comics",
    category: "books",
    price: 12,
    rating: 4.6,
    image: "images/comics.jpg",
    subProducts: [
      { name: "Collector Sleeve", price: 2 },
      { name: "Poster", price: 6 }
    ]
  },
  {
    name: "T-shirt",
    category: "clothing",
    price: 19,
    rating: 4.0,
    image: "images/tshirt.jpg",
    subProducts: [
      { name: "Size S", price: 19 },
      { name: "Size M", price: 19 }
    ]
  },
  {
    name: "Jeans",
    category: "clothing",
    price: 49,
    rating: 4.4,
    image: "images/jeans.jpg",
    subProducts: [
      { name: "Belt", price: 10 },
      { name: "Alteration Service", price: 7 }
    ]
  },
  {
    name: "Jacket",
    category: "clothing",
    price: 89,
    rating: 4.8,
    image: "images/jacket.jpg",
    subProducts: [
      { name: "Waterproof Spray", price: 12 },
      { name: "Thermal Liner", price: 20 }
    ]
  }
];

function toggleSubProducts(card, subProducts) {
  let subContainer = card.querySelector(".sub-products");

  if (!subContainer.innerHTML) {
    subProducts.forEach(sp => {
      const subItem = document.createElement("div");
      subItem.className = "sub-item";
      subItem.textContent = `• ${sp.name} - $${sp.price}`;
      subContainer.appendChild(subItem);
    });
  }

  subContainer.style.display =
    subContainer.style.display === "none" ? "block" : "none";
}

function renderProducts(filteredProducts) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <p>Rating: ${product.rating} ⭐</p>
      <div class="sub-products" style="display: none; margin-top: 0.5rem; font-size: 0.85rem;"></div>
    `;
    card.addEventListener("click", () =>
      toggleSubProducts(card, product.subProducts)
    );
    container.appendChild(card);
  });
}

function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;
  const sortOption = document.getElementById("sortOptions").value;
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();

  let filtered = products.filter(p => {
    return (
      (category === "all" || p.category === category) &&
      p.price >= minPrice &&
      p.price <= maxPrice &&
      p.name.toLowerCase().includes(searchQuery)
    );
  });

  switch (sortOption) {
    case "price-asc":
      filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  renderProducts(filtered);
}

// Event Listeners
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("minPrice").addEventListener("input", applyFilters);
document.getElementById("maxPrice").addEventListener("input", applyFilters);
document.getElementById("sortOptions").addEventListener("change", applyFilters);
document.getElementById("searchInput").addEventListener("input", applyFilters);

// Initial Load
renderProducts(products);

// Dark mode toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
