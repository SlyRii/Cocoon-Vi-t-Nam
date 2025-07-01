// js/global.js

// DOM Elements chung cho toàn trang
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");
const loginModal = document.getElementById("loginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const loginForm = loginModal ? loginModal.querySelector("form") : null;
const backToTop = document.getElementById("backToTop");
const scrollProgress = document.getElementById("scrollProgress"); // Nếu bạn có scroll progress bar
const zoomOverlay = document.getElementById("zoom-overlay");
const zoomModal = document.getElementById("zoom-modal");
const zoomedImage = document.getElementById("zoomed-image");
const closeZoom = document.getElementById("close-zoom");
const mainImage = document.getElementById("main-image"); // Chỉ nếu có trên trang sản phẩm chi tiết

// --- Helper Functions chung ---
/**
 * Khai báo toàn cục để có thể gọi từ HTML onclick.
 * Placeholder for showing product detail (if you had a dedicated page/modal for it)
 */
window.showProductDetail = function(productId) {
  // Bạn sẽ cần mảng `products` ở đây nếu muốn hiển thị chi tiết
  // Hoặc chuyển hướng đến trang chi tiết: window.location.href = `product-detail.html?id=${productId}`;
  console.log(`Hiển thị chi tiết sản phẩm ID: ${productId}`);
}

/**
 * Hàm hiển thị Login Modal (khai báo toàn cục để HTML onclick có thể gọi)
 */
window.showLoginModal = function() {
  if (loginModal) {
    loginModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else {
    console.warn("Login Modal not found.");
    // Fallback if modal isn't present, e.g., redirect to login.html
    // window.location.href = "login.html";
  }
}

/**
 * Hàm ẩn Login Modal
 */
function hideLoginModal() {
  if (loginModal) {
    loginModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

// --- Event Listeners and Initializations on DOM Load ---
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Events
  if (mobileMenuBtn && mobileMenu && closeMobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("invisible");
      mobileMenu.classList.toggle("-translate-y-full");
      mobileMenu.classList.toggle("opacity-0");
      mobileMenu.classList.toggle("translate-y-0");
      mobileMenu.classList.toggle("opacity-100");
      // Thay đổi icon menu
      mobileMenuBtn.innerHTML = mobileMenu.classList.contains("invisible")
        ? '<i class="ri-menu-line text-2xl"></i>'
        : '<i class="ri-close-line text-2xl"></i>';
    });
    closeMobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.add("invisible", "-translate-y-full", "opacity-0");
      mobileMenu.classList.remove("translate-y-0", "opacity-100");
      mobileMenuBtn.innerHTML = '<i class="ri-menu-line text-2xl"></i>';
    });
  }

  // Login Modal Events
  if (closeLoginModal) {
    closeLoginModal.addEventListener("click", hideLoginModal);
  }
  if (loginModal) {
    loginModal.addEventListener("click", function (e) {
      if (e.target === loginModal) {
        hideLoginModal();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !loginModal.classList.contains("hidden")) {
        hideLoginModal();
      }
    });
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;
        const remember = document.getElementById("remember")?.checked;
        console.log("Login attempt:", { email, password, remember });
        hideLoginModal();
        alert("Đăng nhập thành công (giả lập)!"); // For demonstration
      });
    }
  }

  // Scroll Progress & Back to Top
  window.addEventListener("scroll", function () {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + "%";
    }
    if (backToTop) {
      if (winScroll > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  });
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Tab control (for product details/blog)
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      tabContents.forEach((content) => {
        content.classList.add("hidden");
      });
      document.getElementById(tabId).classList.remove("hidden");
      tabButtons.forEach((btn) => {
        btn.classList.remove("text-primary", "border-primary");
        btn.classList.add("text-gray-500", "border-transparent");
      });
      this.classList.remove("text-gray-500", "border-transparent");
      this.classList.add("text-primary", "border-primary");
    });
  });

  // Quantity Control (for product detail page)
  const decreaseBtn = document.getElementById("decrease-qty");
  const increaseBtn = document.getElementById("increase-qty");
  const quantityInput = document.getElementById("quantity");
  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", function () {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
    increaseBtn.addEventListener("click", function () {
      const currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
    quantityInput.addEventListener("change", function () {
      if (this.value < 1) {
        this.value = 1;
      }
    });
  }

  // Image Zoom (for product detail page)
  if (zoomOverlay && zoomModal && zoomedImage && closeZoom && mainImage) {
    zoomOverlay.addEventListener("click", function () {
      zoomedImage.src = mainImage.src;
      zoomModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
    closeZoom.addEventListener("click", function () {
      zoomModal.classList.add("hidden");
      document.body.style.overflow = "";
    });
    zoomModal.addEventListener("click", function (e) {
      if (e.target === zoomModal) {
        zoomModal.classList.add("hidden");
        document.body.style.overflow = "";
      }
    });
  }

  // Rating Stars (for product detail page)
  const ratingStars = document.querySelectorAll(".rating-star");
  let selectedRating = 0;
  ratingStars.forEach((star) => {
    star.addEventListener("click", function () {
      const rating = parseInt(this.getAttribute("data-rating"));
      selectedRating = rating;
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.remove("ri-star-line", "text-gray-400");
          s.classList.add("ri-star-fill", "text-yellow-400");
        } else {
          s.classList.remove("ri-star-fill", "text-yellow-400");
          s.classList.add("ri-star-line", "text-gray-400");
        }
      });
    });
    star.addEventListener("mouseenter", function () {
      const rating = parseInt(this.getAttribute("data-rating"));
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add("text-yellow-400");
        }
      });
    });
    star.addEventListener("mouseleave", function () {
      ratingStars.forEach((s, index) => {
        if (index < selectedRating) {
          s.classList.add("ri-star-fill", "text-yellow-400");
          s.classList.remove("ri-star-line", "text-gray-400");
        } else {
          s.classList.add("ri-star-line", "text-gray-400");
          s.classList.remove("ri-star-fill", "text-yellow-400");
        }
      });
    });
  });

  // Product Thumbnails (for product detail page)
  const thumbnails = document.querySelectorAll(".product-thumbnail");
  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        const imgSrc = this.getAttribute("data-img");
        mainImage.src = imgSrc;
        thumbnails.forEach((t) => t.classList.remove("active", "border-primary"));
        this.classList.add("active", "border-primary");
      });
    });
  }
});