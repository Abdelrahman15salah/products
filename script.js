const productsContainer = document.getElementById('products');
const cartQuantity = document.getElementById('cartQuantity');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
let products = [];
let cart = [];
async function fetchProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    products = await response.json();
    displayProducts(products); 
}
function displayProducts(products) {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsContainer.appendChild(productCard);
    });
}
function applyFilters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value);
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    const sortOption = document.getElementById('sortOptions').value;

    // Filter products based on search, category, and price range
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchInput);
        const matchesCategory = categoryFilter === 'All Categories' || product.category === categoryFilter;
        const matchesMinPrice = isNaN(minPrice) || product.price >= minPrice;
        const matchesMaxPrice = isNaN(maxPrice) || product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    // Sort products based on selected sort option
    if (sortOption === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name-asc') {
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'name-desc') {
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === 'rating-asc') {
        filteredProducts.sort((a, b) => a.rating.rate - b.rating.rate);
    } else if (sortOption === 'rating-desc') {
        filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    displayProducts(filteredProducts); // Display sorted and filtered products
}
function updateCart() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartQuantity.textContent = totalQuantity;
    cartTotal.textContent = totalPrice.toFixed(2);
    const cartDetails = document.getElementById('cartDetails');
    cartDetails.innerHTML = ''; 
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <h4>${item.title}</h4>
            <div class="cart-item-controls">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartDetails.appendChild(cartItem);
    });
}
function clearCart() {
    cart = []; 
    updateCart(); 
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId); 
    const cartItem = cart.find(item => item.id === productId); 

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}
function increaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
        updateCart();
    }
}
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}
fetchProducts();