const API_URL = "https://v2.api.noroff.dev/rainy-days";
let products = [];
const isHomePage = window.location.pathname.includes('index.html');
const isProductPage = window.location.pathname.includes('productpage.html');


async function fetchProducts() {
    if (!API_URL) {
        console.error("API_URL is not defined");
        return;
    }
    try {
        const respons = await fetch(API_URL);
        const data = await respons.json();
        const produkter = data.data || data;
        products = produkter;
        console.log('Fetched products:', products);
        if (produkter && produkter.length > 0) {
            if(isProductPage) {
                const productId = getProductId() || produkter[0].id;
                const product = produkter.find(p => p.id === productId);
                if(product) {
                    displaySingleProduct(product);
                }
            }
            else if(isHomePage) {
                const productContainer = document.getElementById('product-container');
                if (productContainer) productContainer.innerHTML = '';
                for (let i = 0; i < Math.min(12, produkter.length); i++) {
                    displayProduct(produkter[i]);
                }
            }
        }
    }
    catch (error) {
        console.error("klarer ikke hente produkter:", error);
    }
}

initializeFilter();

function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function displayProduct(product) {
    const productContainer = document.getElementById('product-container');
    if (!productContainer) return;

    // Create product box
    const currentBox = document.createElement('div');
    currentBox.className = 'product_box product';
    currentBox.dataset.productId = product.id;

    // Create the image section
    const imgDiv = document.createElement('div');
    imgDiv.className = 'product_img';
    const img = document.createElement('img');
    img.src = product.image ? product.image.url : '';
    img.alt = product.image ? (product.image.alt || product.title) : product.title;
    imgDiv.appendChild(img);
    currentBox.appendChild(imgDiv);

    // Create info section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product_info';
    const title = document.createElement('h3');
    title.textContent = product.title;
    infoDiv.appendChild(title);
    const desc = document.createElement('p');
    desc.textContent = product.description;
    infoDiv.appendChild(desc);
    const price = document.createElement('p');
    price.textContent = `Price: $${product.price}`;
    infoDiv.appendChild(price);

    // Size dropdown menu
    const sizeDropdown = document.createElement('select');
    sizeDropdown.className = 'size-dropdown';
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Size';
    sizeDropdown.appendChild(defaultOption);
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeDropdown.appendChild(option);
    });
    infoDiv.appendChild(sizeDropdown);

    // View Details button
    const viewDetailsBtn = document.createElement('button');
    viewDetailsBtn.id = 'viewDetailsButton';
    viewDetailsBtn.textContent = 'View Details';
    viewDetailsBtn.onclick = () => {
        window.location.href = `productpage.html?id=${product.id}`;
    };
    infoDiv.appendChild(viewDetailsBtn);

    // Add to Cart button
    const addToCartBtnElement = document.createElement('button');
    addToCartBtnElement.id = 'addToCartButton';
    addToCartBtnElement.textContent = 'Add to Cart';
    addToCartBtnElement.onclick = () => {
        const selectedSize = sizeDropdown.value;
        if (!selectedSize) {
            showCustomAlert('Please select a size before adding to cart.', 'Size Required');
            return;
        }
        console.log('Add to Cart clicked:', product.id, selectedSize);
        addToCart(product.id, selectedSize);
    };
    infoDiv.appendChild(addToCartBtnElement);

    currentBox.appendChild(infoDiv);
    productContainer.appendChild(currentBox);
}

function addToCart(productId, size) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        return;
    }
    
    // sjekk om produktet allerede finnes i kurven
    let existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image.url,
            size: size, 
            quantity: 1,
            
        });
    }
    
    // Lagre til localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // oppdatering cart teller
    updateCartCounter();
    
}

function displaySingleProduct(product){
    const titleElement = document.getElementById('productTitle');
    if (titleElement) titleElement.textContent = product.title;

    const imageElement = document.getElementById('mainProductImage');
    if (imageElement && product.image) {
        imageElement.src = product.image.url;
        imageElement.alt = product.image.alt || product.title;
    }
    const priceElement = document.getElementById('productPrice');
    if (priceElement) priceElement.textContent = `Price: $${product.price}`;
    
    const descriptionElement = document.getElementById('productDescription');
    if (descriptionElement) descriptionElement.textContent = product.description;
    
    // Add sizes to the dropdown
    const sizeSelect = document.getElementById('sizeSelect');
    if (sizeSelect && product.sizes && product.sizes.length > 0) {
        // Clear existing options except the first one
        sizeSelect.innerHTML = '<option value="">Select Size</option>';
        
        // Add each size as an option
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    } else if (sizeSelect) {
        // If no sizes in API data, add default clothing sizes
        const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        sizeSelect.innerHTML = '<option value="">Select Size</option>';
        
        defaultSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    }
}

function initializeFilter() {
    const filterSelect = document.getElementById('categoryFilter');
    if (!filterSelect) return;
    filterSelect.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === '') {
            displayFilteredProducts(products);
        } else {
            filterProducts(selectedCategory);
        }
    });
}


function displayFilteredProducts(filteredProducts) {
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.innerHTML = "";
        const maxProducts = Math.min(12, filteredProducts.length);
        for (let i = 0; i < maxProducts; i++) {
            displayProduct(filteredProducts[i]);
        }
    }
    console.log('Filtered Products:', filteredProducts);
}

function filterProducts(category) {
    if (!products || products.length === 0) return;

    let filteredProducts = products;

    if (category && category !== 'all') {
        filteredProducts = products.filter(product => {
            const productGender = product.gender ? product.gender.toLowerCase() : '';
            const productTitle = product.title ? product.title.toLowerCase() : '';
            const productTags = product.tags ? product.tags.join(', ').toLowerCase() : '';
            

            switch (category) {
                case "women":
                    return productGender.includes("female") || 
                           productTitle.includes('women') || 
                           productTitle.includes('female') ||
                           productTags.includes('women') ||
                           productTags.includes('female');
                           
                   
                case "men":
                     return productGender === "male" || 
                        /\bmen\b/i.test(productTitle) || 
                        /\bmale\b/i.test(productTitle) ||
                        /\bmen\b/i.test(productTags) ||
                        /\bmale\b/i.test(productTags);

                case 'accessories':
                    return productTitle.includes('accessory') ||
                           productTitle.includes('accessories') ||
                           productTags.includes('accessories');

                default:
                    return true;
            }
        });
    }
    
    // vise filtrerte produkter
        console.log('Filter category:', category);
        console.log('Filtered products:', filteredProducts);
    displayFilteredProducts(filteredProducts);
}

// Call fetchProducts when the page loads
if (isProductPage || isHomePage) {
    document.addEventListener('DOMContentLoaded', fetchProducts);
}