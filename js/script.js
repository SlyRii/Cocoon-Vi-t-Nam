document.addEventListener("DOMContentLoaded", function () {
    // --- Global Cart Variables ---
    // Try to load cart from Local Storage, otherwise initialize as empty array
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCountElement = document.getElementById("cart-count");
    const cartIcon = document.getElementById("cart-icon");
    const miniCart = document.getElementById("mini-cart");
    const miniCartItemsContainer = document.getElementById("mini-cart-items");
    const miniCartTotalElement = document.getElementById("mini-cart-total");
    const addToCartNotification = document.getElementById("add-to-cart-notification");
    const closeNotificationBtn = document.getElementById("close-notification");

    // --- Helper function to format currency (e.g., 420.000₫) ---
    function formatCurrency(price) {
        return price.toLocaleString('vi-VN') + "₫";
    }

    // --- Update Mini Cart Display ---
    function updateMiniCartDisplay() {
        let totalCount = 0;
        let totalPrice = 0;
        miniCartItemsContainer.innerHTML = ""; // Clear existing items

        if (cartItems.length === 0) {
            miniCartItemsContainer.innerHTML = '<div class="text-center py-6 text-gray-500">Giỏ hàng trống</div>';
            cartCountElement.style.display = "none";
        } else {
            cartItems.forEach((item, index) => {
                totalCount += item.quantity;
                totalPrice += item.price * item.quantity;

                const itemElement = document.createElement("div");
                // Thêm class 'last:border-b-0' để loại bỏ viền dưới cho item cuối cùng trong giỏ hàng
                itemElement.className = "flex gap-3 py-3 border-b border-gray-100 last:border-b-0"; 
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="text-sm font-medium text-gray-800">${item.name}</h4>
                        <div class="flex justify-between items-center mt-1">
                            <span class="text-sm text-gray-600">${item.quantity} x ${formatCurrency(item.price)}</span>
                            <button class="text-gray-400 hover:text-red-500 remove-item" data-index="${index}">
                                <i class="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    </div>
                `;
                miniCartItemsContainer.appendChild(itemElement);
            });
            cartCountElement.style.display = "flex"; // Hiện số lượng sản phẩm trên icon giỏ hàng
        }

        cartCountElement.textContent = totalCount;
        miniCartTotalElement.textContent = formatCurrency(totalPrice);

        // Gắn sự kiện click cho các nút "Xóa" được tạo động
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function() {
                const indexToRemove = parseInt(this.dataset.index);
                removeCartItem(indexToRemove);
            });
        });

        // Lưu giỏ hàng vào Local Storage để giữ dữ liệu khi tải lại trang
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // --- Add Item to Cart Function ---
    function addItemToCart(product) {
        const existingItemIndex = cartItems.findIndex(item => item.name === product.name);

        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += product.quantity;
        } else {
            cartItems.push(product);
        }
        updateMiniCartDisplay();
        showNotification(`Đã thêm ${product.quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
    }

    // --- Remove Item from Cart Function ---
    function removeCartItem(index) {
        if (index > -1 && index < cartItems.length) {
            cartItems.splice(index, 1);
            updateMiniCartDisplay();
        }
    }

    // --- Show Add-to-Cart Notification ---
    function showNotification(message) {
        // Cập nhật nội dung thông báo (có thể customize thêm nếu cần)
        const notificationText = addToCartNotification.querySelector('p'); // Giả định bạn có thẻ p trong #add-to-cart-notification
        if (notificationText) {
            notificationText.textContent = message;
        }
        
        addToCartNotification.classList.remove("translate-x-full"); // Hiển thị thông báo
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            addToCartNotification.classList.add("translate-x-full");
        }, 3000); 
    }
    
    // Đóng thông báo khi click vào nút X
    closeNotificationBtn.addEventListener("click", function () {
        addToCartNotification.classList.add("translate-x-full");
    });


    // --- Product Thumbnails Control (chuyển đổi ảnh chính khi click ảnh nhỏ) ---
    const thumbnails = document.querySelectorAll(".product-thumbnail");
    const mainImage = document.getElementById("main-image");
    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", function () {
            // Cập nhật ảnh chính
            const imgSrc = this.getAttribute("data-img"); // Lấy nguồn ảnh từ thuộc tính data-img
            mainImage.src = imgSrc;
            
            // Cập nhật trạng thái "active" (viền sáng) cho ảnh nhỏ
            thumbnails.forEach((t) => t.classList.remove("active")); // Xóa class 'active' khỏi tất cả ảnh nhỏ
            this.classList.add("active"); // Thêm class 'active' vào ảnh nhỏ vừa click
        });
    });

    // --- Quantity Control (nút tăng/giảm số lượng) ---
    const decreaseBtn = document.getElementById("decrease-qty");
    const increaseBtn = document.getElementById("increase-qty");
    const quantityInput = document.getElementById("quantity");

    if (decreaseBtn && increaseBtn && quantityInput) { // Kiểm tra sự tồn tại của các phần tử
        decreaseBtn.addEventListener("click", function () {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) { // Đảm bảo số lượng không nhỏ hơn 1
                quantityInput.value = currentValue - 1;
            }
        });

        increaseBtn.addEventListener("click", function () {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });

        // Xử lý khi người dùng tự nhập số lượng
        quantityInput.addEventListener("change", function () {
            if (this.value < 1 || isNaN(this.value)) { // Nếu giá trị nhỏ hơn 1 hoặc không phải số, đặt lại là 1
                this.value = 1;
            }
        });
    }


    // --- Tab Control (Mô tả, Thành phần, Hướng dẫn sử dụng, Đánh giá) ---
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    
    if (tabButtons.length > 0 && tabContents.length > 0) { // Chỉ chạy nếu có tabs trên trang
        tabButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const tabId = this.getAttribute("data-tab");
                
                // Ẩn tất cả các nội dung tab và xóa class 'block'
                tabContents.forEach((content) => {
                    content.classList.add("hidden");
                    content.classList.remove("block");
                });
                // Hiển thị nội dung tab được chọn và thêm class 'block'
                document.getElementById(tabId).classList.remove("hidden");
                document.getElementById(tabId).classList.add("block");

                // Cập nhật trạng thái "active" cho các nút tab (đổi màu viền, chữ)
                tabButtons.forEach((btn) => {
                    btn.classList.remove("active"); // Xóa class 'active' từ tất cả các nút
                });
                this.classList.add("active"); // Thêm class 'active' vào nút vừa click
            });
        });

        // Tự động kích hoạt tab đầu tiên ("Mô tả sản phẩm") khi trang tải xong
        const defaultTabButton = document.querySelector('.tab-button[data-tab="description"]');
        if (defaultTabButton) {
            defaultTabButton.click(); // Giả lập hành động click để kích hoạt tab
        }
    }


    // --- Add to Cart Button Logic ---
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn && quantityInput && document.getElementById("product-name") && document.getElementById("product-price")) {
        addToCartBtn.addEventListener("click", function () {
            const quantity = parseInt(quantityInput.value);
            // Lấy tên sản phẩm (trim() để loại bỏ khoảng trắng thừa)
            const productName = document.getElementById("product-name").textContent.trim();
            // Lấy giá sản phẩm từ thuộc tính data-price
            const productPrice = parseFloat(document.getElementById("product-price").dataset.price);
            const productImage = mainImage.src; // Lấy ảnh chính hiện tại

            if (isNaN(quantity) || quantity <= 0) {
                alert("Vui lòng nhập số lượng hợp lệ.");
                return;
            }

            const product = {
                // Tạo một ID sản phẩm đơn giản từ tên sản phẩm để xác định duy nhất trong giỏ
                id: productName.replace(/\s/g, '-').toLowerCase(), 
                name: productName,
                price: productPrice,
                quantity: quantity,
                image: productImage,
            };
            addItemToCart(product);
        });
    }

    // --- Mini Cart Hover Functionality ---
    if (cartIcon && miniCart) {
        cartIcon.addEventListener("mouseenter", function () {
            miniCart.classList.remove("hidden"); // Hiển thị mini-cart
            updateMiniCartDisplay(); // Đảm bảo mini-cart được cập nhật khi di chuột vào
        });

        // Xử lý khi chuột rời khỏi icon giỏ hàng và mini-cart
        let miniCartTimeout; // Biến để lưu trữ timeout
        cartIcon.addEventListener("mouseleave", function (e) {
            miniCartTimeout = setTimeout(() => {
                // Nếu con trỏ chuột không nằm trên mini-cart, ẩn nó đi
                if (!miniCart.contains(e.relatedTarget)) {
                    miniCart.classList.add("hidden");
                }
            }, 100); // Đặt một độ trễ nhỏ để cho phép di chuyển chuột vào mini-cart
        });

        miniCart.addEventListener("mouseenter", function () {
            clearTimeout(miniCartTimeout); // Xóa timeout nếu chuột di vào mini-cart
        });

        miniCart.addEventListener("mouseleave", function () {
            miniCart.classList.add("hidden"); // Ẩn mini-cart khi chuột rời khỏi
        });
    }


    // --- Rating Stars Interaction (Đánh giá sao) ---
    const ratingStars = document.querySelectorAll(".rating-star");
    let selectedRating = 0; // Lưu trữ số sao mà người dùng đã chọn

    if (ratingStars.length > 0) {
        ratingStars.forEach((star) => {
            star.addEventListener("click", function () {
                selectedRating = parseInt(this.getAttribute("data-rating"));
                updateStarDisplay(selectedRating); // Cập nhật hiển thị sao dựa trên lựa chọn
            });

            star.addEventListener("mouseenter", function () {
                const hoverRating = parseInt(this.getAttribute("data-rating"));
                updateStarDisplay(hoverRating, true); // Highlight sao khi di chuột vào
            });

            star.addEventListener("mouseleave", function () {
                updateStarDisplay(selectedRating); // Khôi phục lại trạng thái sao đã chọn khi chuột rời đi
            });
        });
    }

    function updateStarDisplay(rating, isHover = false) {
        ratingStars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove("ri-star-line", "text-gray-400");
                star.classList.add("ri-star-fill", "text-yellow-400");
            } else {
                star.classList.remove("ri-star-fill", "text-yellow-400");
                star.classList.add("ri-star-line", "text-gray-400");
            }
        });
    }

    // --- Image Zoom Modal (phóng to ảnh sản phẩm) ---
    const zoomOverlay = document.getElementById("zoom-overlay");
    const zoomModal = document.getElementById("zoom-modal");
    const zoomedImage = document.getElementById("zoomed-image");
    const closeZoomBtn = document.getElementById("close-zoom");

    if (zoomOverlay && zoomModal && zoomedImage && closeZoomBtn && mainImage) {
        zoomOverlay.addEventListener("click", function () {
            zoomedImage.src = mainImage.src; // Đặt nguồn ảnh cho modal zoom là ảnh chính hiện tại
            zoomModal.classList.remove("hidden"); // Hiển thị modal zoom
            document.body.style.overflow = "hidden"; // Ngăn cuộn trang chính
        });

        closeZoomBtn.addEventListener("click", function () {
            zoomModal.classList.add("hidden"); // Ẩn modal zoom
            document.body.style.overflow = ""; // Cho phép cuộn lại trang chính
        });

        // Đóng modal zoom khi click vào vùng tối bên ngoài ảnh
        zoomModal.addEventListener("click", function (e) {
            if (e.target === zoomModal) {
                zoomModal.classList.add("hidden");
                document.body.style.overflow = "";
            }
        });
    }
    
    // --- Mobile Menu Logic (Assuming these elements exist in your header) ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');

    if (mobileMenuBtn && mobileMenu && closeMobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('-translate-y-full');
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('translate-y-0');
            mobileMenu.classList.toggle('opacity-100');
            document.body.classList.toggle('overflow-hidden'); // Prevent scrolling body when menu is open

            if (mobileMenu.classList.contains('translate-y-0')) {
                mobileMenuBtn.innerHTML = '<i class="ri-close-line text-2xl"></i>';
            } else {
                mobileMenuBtn.innerHTML = '<i class="ri-menu-line text-2xl"></i>';
            }
        });

        closeMobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.add('-translate-y-full', 'opacity-0');
            mobileMenu.classList.remove('translate-y-0', 'opacity-100');
            document.body.classList.remove('overflow-hidden');
            mobileMenuBtn.innerHTML = '<i class="ri-menu-line text-2xl"></i>';
        });
    }

    // --- Login Modal Logic (currently just an alert) ---
    const loginBtn = document.getElementById('login-btn');
    const loginBtnMobile = document.getElementById('login-btn-mobile'); 

    function showLoginModal() {
        alert('Chức năng đăng nhập sẽ được hiển thị trong một modal!');
        console.log('Show login modal');
        // If you had a login modal HTML, you'd show it here:
        // document.getElementById('loginModal').classList.remove('hidden');
        // document.body.style.overflow = 'hidden';
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
    if (loginBtnMobile) {
        loginBtnMobile.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
    
    // --- Cart Modal (Main) Logic (if you intend to have a separate full cart page) ---
    // Note: The `cartModal` in detail.html is a mini-cart type modal.
    // If you have a separate full-page cart, you'd navigate there.
    // This script assumes `cartModal` refers to the popup mini-cart.
    const cartModalFull = document.getElementById('cartModal'); // This is the one in detail.html
    const closeCartModalBtn = document.getElementById('closeCartModal');

    if (cartModalFull && cartIcon) { // Ensure cartModalFull also exists
        cartIcon.addEventListener('click', (e) => { // Assuming cartIcon is the trigger for the full cart modal
            e.preventDefault();
            cartModalFull.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            updateMiniCartDisplay(); // Update display when opening main cart modal
        });

        if (closeCartModalBtn) {
            closeCartModalBtn.addEventListener('click', () => {
                cartModalFull.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        }
        
        cartModalFull.addEventListener('click', (e) => {
            if (e.target === cartModalFull) {
                cartModalFull.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }


    // --- Scroll Progress Bar (if element exists) ---
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${scrolled}%`;
        });
    }

    // --- Back to Top Button (if element exists) ---
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Newsletter Form Submission (if element exists) ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value;
            
            if (email) {
                alert(`Cảm ơn bạn đã đăng ký nhận tin với email: ${email}`);
                console.log(`Newsletter subscription: ${email}`);
                emailInput.value = ''; // Clear the input
            } else {
                alert('Vui lòng nhập địa chỉ email của bạn.');
            }
        });
    }
    
    // --- Initial setup on page load ---
    updateMiniCartDisplay(); // Tải giỏ hàng từ localStorage và cập nhật hiển thị ngay khi trang tải xong
});