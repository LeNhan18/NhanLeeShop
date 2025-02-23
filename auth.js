// Lưu trữ thông tin người dùng
let users = JSON.parse(localStorage.getItem('users')) || [];

// Khởi tạo tài khoản mặc định khi load trang
function initializeDefaultUser() {
    // Nếu chưa có user nào, tạo tài khoản mặc định
    if (users.length === 0) {
        users.push({
            username: 'nhanle',
            password: hashPassword('12345'),
            email: 'nhanle@example.com',
            cart: [],
            createdAt: new Date()
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Hàm đăng ký
function register(username, email, password) {
    // Kiểm tra username đã tồn tại
    if (users.find(user => user.username === username)) {
        showNotification('Tên đăng nhập đã tồn tại!', 'error');
        return false;
    }

    // Kiểm tra email đã tồn tại
    if (users.find(user => user.email === email)) {
        showNotification('Email đã được sử dụng!', 'error');
        return false;
    }

    // Tạo user mới
    const newUser = {
        username,
        email,
        password: hashPassword(password), // Mã hóa mật khẩu trước khi lưu
        createdAt: new Date(),
        cart: []
    };

    // Thêm user vào mảng
    users.push(newUser);
    
    // Lưu vào localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
    
    return true;
}

// Hàm đăng nhập
function login(username, password) {
    // Đảm bảo có tài khoản mặc định
    initializeDefaultUser();
    
    // Lấy danh sách users
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Tìm user
    const user = users.find(user => user.username === username);
    
    if (!user) {
        showNotification('Tên đăng nhập không tồn tại!', 'error');
        return false;
    }

    if (user.password !== hashPassword(password)) {
        showNotification('Mật khẩu không chính xác!', 'error');
        return false;
    }

    // Lưu thông tin đăng nhập
    const userInfo = {
        username: user.username,
        email: user.email,
        cart: user.cart,
        isLoggedIn: true
    };
    
    sessionStorage.setItem('currentUser', JSON.stringify(userInfo));

    // Chuyển hướng ngay lập tức đến trang index
    window.location.href = 'index.html';
    return true;
}

// Hàm đăng xuất
function logout() {
    sessionStorage.removeItem('currentUser');
    showNotification('Đã đăng xuất thành công!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Hàm kiểm tra đăng nhập
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

// Hàm mã hóa mật khẩu đơn giản (trong thực tế nên dùng thư viện mã hóa chuyên dụng)
function hashPassword(password) {
    return btoa(password); // Mã hóa base64 (chỉ để demo)
}

// Thêm event listeners cho forms
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultUser();
    
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");
    
    // Thêm sự kiện click cho nút đăng ký
    sign_up_btn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
    });
    
    // Thêm sự kiện click cho nút đăng nhập
    sign_in_btn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
    });

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            login(username, password);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            register(username, email, password);
        });
    }
});

// Cập nhật UI khi user đã đăng nhập
function updateUIAfterLogin() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        // Cập nhật nút user trên navbar
        const userBtn = document.querySelector('.nav-buttons .user-btn');
        if (userBtn) {
            userBtn.innerHTML = `
                <div class="user-menu-trigger">
                    <i class="fas fa-user"></i>
                    <span>${currentUser.username}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
            `;
            
            // Thêm menu dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            dropdown.innerHTML = `
                <div class="user-dropdown-content">
                    <a href="#profile"><i class="fas fa-user-circle"></i> Tài khoản của tôi</a>
                    <a href="#orders"><i class="fas fa-shopping-bag"></i> Đơn hàng</a>
                    <a href="#wishlist"><i class="fas fa-heart"></i> Yêu thích</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
                </div>
            `;
            
            userBtn.appendChild(dropdown);
            
            // Xử lý hiển thị dropdown
            userBtn.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('show');
            });
            
            // Xử lý đăng xuất
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }

        // Cập nhật giỏ hàng nếu có
        const cartBtn = document.querySelector('.nav-buttons .cart-btn');
        if (cartBtn && currentUser.cart) {
            const cartCount = currentUser.cart.length;
            if (cartCount > 0) {
                cartBtn.innerHTML = `
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">${cartCount}</span>
                `;
            }
        }
    }
}

// Thêm style cho dropdown menu
const style = document.createElement('style');
style.textContent = `
    .user-menu-trigger {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        min-width: 200px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }

    .user-dropdown.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .user-dropdown-content {
        padding: 8px 0;
    }

    .user-dropdown-content a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        color: #333;
        text-decoration: none;
        transition: background 0.3s ease;
    }

    .user-dropdown-content a:hover {
        background: #f5f5f5;
        color: #FF6B6B;
    }

    .dropdown-divider {
        height: 1px;
        background: #eee;
        margin: 8px 0;
    }

    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #FF6B6B;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: 500;
    }
`;

document.head.appendChild(style);

// Chạy cập nhật UI khi trang load
document.addEventListener('DOMContentLoaded', () => {
    updateUIAfterLogin();
    
    // Click bên ngoài để đóng dropdown
    document.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.user-dropdown');
        const userBtn = document.querySelector('.user-menu-trigger');
        if (dropdown && !userBtn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
});

// Thêm hàm hiển thị thông báo
function showNotification(message, type = 'success') {
    // Xóa thông báo cũ nếu có
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Tạo thông báo mới
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Icon cho thông báo
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    // Thêm vào body
    document.body.appendChild(notification);

    // Xóa thông báo sau 3 giây
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Kiểm tra trạng thái đăng nhập khi load trang
function checkLoginStatus() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        // Nếu đang ở trang login và đã đăng nhập, chuyển về index
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Chạy kiểm tra khi trang load
document.addEventListener('DOMContentLoaded', checkLoginStatus); 