// js/cart.js

// Cart array, loaded from localStorage or initialized as empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements - Get references to elements once
const cartModal = document.getElementById("cart-modal");
const closeCartModalBtn = document.getElementById("close-cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalSpan = document.getElementById("cart-total");
const cartCountSpan = document.getElementById("cart-count");
const emptyCartMessage = document.getElementById("empty-cart-message");

// --- Helper Functions ---
/**
 * Formats a number as Vietnamese currency.
 * @param {number} amount
 * @returns {string} Formatted currency string.
 */
function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN") + "₫";
}

/**
 * Saves the current cart state to localStorage.
 */
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Updates the cart item count displayed on the header.
 */
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountSpan) {
    cartCountSpan.textContent = totalItems;
    // Show/hide cart count based on total items
    cartCountSpan.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

/**
 * Renders (displays) all items currently in the cart within the cart modal.
 * Also updates the total price and cart count.
 */
function renderCartItems() {
  if (!cartItemsContainer) return; // Ensure element exists

  cartItemsContainer.innerHTML = ""; // Clear existing items

  if (cart.length === 0) {
    emptyCartMessage.classList.remove('hidden');
  } else {
    emptyCartMessage.classList.add('hidden');
    cart.forEach((item) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "flex items-center space-x-4 border-b border-gray-100 pb-4";
      cartItemDiv.innerHTML = `
       <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
        <div class="flex-1">
            <h4 class="text-md font-medium text-gray-800">${item.name}</h4>
            <p class="text-sm text-primary font-bold">${formatCurrency(item.price)}</p>
            <div class="flex items-center mt-2">
                <button onclick="updateCartQuantity(${item.id}, -1)" class="px-2 py-1 border border-gray-300 rounded-l text-gray-700 hover:bg-gray-100">-</button>
                <input type="text" value="${item.quantity}" readonly class="w-10 text-center border-t border-b border-gray-300 py-1 text-gray-700" />
                <button onclick="updateCartQuantity(${item.id}, 1)" class="px-2 py-1 border border-gray-300 rounded-r text-gray-700 hover:bg-gray-100">+</button>
            </div>
        </div>
        <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500">
            <i class="ri-delete-bin-line"></i>
        </button>
    `;
      cartItemsContainer.appendChild(cartItemDiv);
    });
  }
  updateCartTotal();
  updateCartCount();
}

/**
 * Adds a product to the cart or increments its quantity if already present.
 * This function needs to be global so it can be called from HTML onclick.
 * @param {number} productId - The ID of the product.
 * @param {string} name - The name of the product.
 * @param {number} price - The price of the product.
 * @param {string} image - The URL of the product image.
 * @param {number} [quantity=1] - The quantity to add.
 */
window.addToCart = function(productId, name, price, image, quantity = 1) {
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, name, price, image, quantity });
  }
  saveCart();
  renderCartItems(); // Re-render cart to show changes
  showCartModal(); // Open cart modal
}

/**
 * Updates the quantity of a specific product in the cart.
 * This function needs to be global so it can be called from HTML onclick.
 * @param {number} productId - The ID of the product.
 * @param {number} change - The amount to change the quantity by (+1 or -1).
 */
window.updateCartQuantity = function(productId, change) {
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      renderCartItems();
    }
  }
}

/**
 * Removes a product from the cart.
 * This function needs to be global so it can be called from HTML onclick.
 * @param {number} productId - The ID of the product to remove.
 */
window.removeFromCart = function(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCartItems();
}

/**
 * Calculates and updates the total price of all items in the cart.
 */
function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cartTotalSpan) {
    cartTotalSpan.textContent = formatCurrency(total);
  }
}

/**
 * Toggles the visibility of the cart modal.
 * This function needs to be global so it can be called from HTML onclick.
 */
window.toggleCart = function() {
  if (cartModal.classList.contains("hidden")) {
    showCartModal();
  } else {
    hideCartModal();
  }
}

/**
 * Shows the cart modal.
 */
function showCartModal() {
  if (cartModal) {
    cartModal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent scrolling body
    renderCartItems(); // Ensure cart is rendered when shown
  }
}

/**
 * Hides the cart modal.
 */
function hideCartModal() {
  if (cartModal) {
    cartModal.classList.add("hidden");
    document.body.style.overflow = "auto"; // Re-enable body scrolling
  }
}

// --- Event Listeners and Initializations on DOM Load ---
document.addEventListener("DOMContentLoaded", function () {
  // Cart Modal Events
  if (closeCartModalBtn) {
    closeCartModalBtn.addEventListener("click", hideCartModal);
  }
  if (cartModal) {
    // Close modal when clicking outside
    cartModal.addEventListener("click", function (e) {
      if (e.target === cartModal) {
        hideCartModal();
      }
    });
    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !cartModal.classList.contains("hidden")) {
        hideCartModal();
      }
    });
  }

  // Initial render of cart items on page load
  renderCartItems();
});