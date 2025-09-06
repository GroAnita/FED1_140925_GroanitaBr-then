
const API_URL = "https://v2.api.noroff.dev/rainy-days";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const isProductPage = window.location.pathname.includes("productpage.html");
const isHomePage = window.location.pathname.includes("index.html");
const container = document.querySelector('.products-grid');


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
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

getProducts();

