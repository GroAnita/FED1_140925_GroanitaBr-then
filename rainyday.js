// Change quantity of cart item and update UI
function changeQuantity(index, delta) {
    if (!cart[index].quantity) cart[index].quantity = 1;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove product from cart
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateShoppingBag();
}

const API_URL = "https://v2.api.noroff.dev/rainy-days";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const isProductPage = window.location.pathname.includes("productpage.html");
const isHomePage = window.location.pathname.includes("index.html");
const container = document.querySelector('.products-grid');

// this function gets the products from the API and shows them on the page, and also handles event listeners. Not 100% sure why this is the place for the event listeners, but it works.. 
async function getProducts() {
   

    if (!API_URL) {
        console.error("API_URL is not defined");
        return;
    }
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        products = data.data;
        

        products.forEach(product => {
            const productBox = document.createElement('div');
            productBox.className = 'product-box';
            
            const productImage = document.createElement('img');
            productImage.className = 'product-image';
            productImage.alt = product.title;
            productImage.src = product.image.url;


            const productInfo = document.createElement('div');
            productInfo.className = 'product-info';

            const productTitle = document.createElement('h3');
            productTitle.className = 'product-title';
            productTitle.textContent = product.title;

            const description = document.createElement('p');
            description.className = 'product-description';
            description.textContent = product.description;

            const price = document.createElement('p');
            price.className = 'product-price';
            price.textContent = `$${product.price}`;
        
            productInfo.appendChild(productTitle);
            productInfo.appendChild(description);
            productInfo.appendChild(price);
            productBox.appendChild(productImage);
            productBox.appendChild(productInfo);
            container.appendChild(productBox);

            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Add to Bag';
            addToCartButton.className = 'add-to-cart-btn';
            productBox.appendChild(addToCartButton);

            addToCartButton.addEventListener('click', function() {
                // Check if product is already in cart by checking the title
                const existingIndex = cart.findIndex(item => item.title === product.title);
                if (existingIndex !== -1) {
                    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
                } else {
                    const productToAdd = { ...product, quantity: 1 };
                    cart.push(productToAdd);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateShoppingBag();
            });
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

getProducts();


// this function updates the shopping bag and should not handle adding products , only be displaying them.
function updateShoppingBag() {
    const cartItemsContainer = document.getElementById('cartitems');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItemHTML = `
            <div class="cart-item">
                <img src="${item.image && item.image.url ? item.image.url : ''}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-btn" onClick="changeQuantity(${index}, -1)">-</div>
                    <div class="quantity">${item.quantity || 1}</div>
                    <div class="quantity-btn" onClick="changeQuantity(${index}, 1)">+</div>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItemHTML;
    });

    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = cart.length;

    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}
   

document.addEventListener('DOMContentLoaded', function() {
    updateShoppingBag();
});



function openShoppingBag() {
    const shoppingBag = document.getElementById('cartoverlay');
    shoppingBag.style.display = 'flex';
}

function closeShoppingBag() {
    const shoppingBag = document.getElementById('cartoverlay');
    shoppingBag.style.display = 'none';
}

document.querySelector('.shopping-bag').addEventListener('click', openShoppingBag);
document.getElementById('closecart').addEventListener('click', closeShoppingBag);

// Closing the cart overlay when clicking outside the cart content
window.addEventListener('click', function(event) {
    const shoppingBag = document.getElementById('cartoverlay');
    if (event.target === shoppingBag) {
        closeShoppingBag();
    }
});