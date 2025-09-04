
document.addEventListener('DOMContentLoaded', () => {
    // --- SHARED APP LOGIC ---
    const App = {
        adminEmail: 'imirfan7738t@gmail.com',
        adminPass: 'admin123',
        getThreads: () => JSON.parse(localStorage.getItem('threadsV5')) || [],
        saveThreads: (threads) => localStorage.setItem('threadsV5', JSON.stringify(threads)),
        getUsers: () => JSON.parse(localStorage.getItem('usersV5')) || [],
        saveUsers: (users) => localStorage.setItem('usersV5', JSON.stringify(users)),
        getMessages: () => JSON.parse(localStorage.getItem('messagesV5')) || [],
        saveMessages: (messages) => localStorage.setItem('messagesV5', JSON.stringify(messages)),
        getReviews: () => JSON.parse(localStorage.getItem('reviewsV5')) || [],
        saveReviews: (reviews) => localStorage.setItem('reviewsV5', JSON.stringify(reviews)),
        getCurrentUser: () => JSON.parse(sessionStorage.getItem('currentUserV5')),
        setCurrentUser: (user) => sessionStorage.setItem('currentUserV5', JSON.stringify(user)),
        logoutUser: () => sessionStorage.removeItem('currentUserV5'),
    };

    // --- ADMIN PROFILE DATA ---
    const adminProfile = {
        name: "M Irfan",
        username: "@website_developer06",
        bio: "Full-Stack Developer specializing in scalable web/mobile apps. Turning complex problems into elegant solutions.",
        skills: ["React", "Node.js", "Python", "iOS Dev", "Android Dev", "UI/UX"],
    };

    // --- HELPER FUNCTION to populate profile data ---
    const populateProfile = () => {
        const nameEl = document.getElementById('profile-name');
        if (!nameEl) return;
        
        // NEW: AI-Generated Profile Picture
        const adminSeed = adminProfile.username; // Use username for a consistent avatar
        const aiAvatarUrl = `https://robohash.org/${adminSeed}.png?set=set1&bgset=bg2`;
        document.querySelectorAll('.profile-picture').forEach(img => img.src = aiAvatarUrl);

        nameEl.textContent = adminProfile.name;
        document.getElementById('profile-username').textContent = adminProfile.username;
        document.getElementById('profile-bio').textContent = adminProfile.bio;
        const skillsContainer = document.getElementById('profile-skills');
        skillsContainer.innerHTML = '';
        adminProfile.skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'skill-badge';
            badge.textContent = skill;
            skillsContainer.appendChild(badge);
        });
    };
    
    // --- DYNAMIC HEADER ---
    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
        const currentUser = App.getCurrentUser();
        if (currentUser) {
            mainNav.innerHTML = `<span>Welcome, ${currentUser.name}</span> <a href="dashboard.html">Client Dashboard</a> <button id="logout-btn" class="cta-button secondary">Logout</button>`;
            mainNav.querySelector('#logout-btn').addEventListener('click', () => { App.logoutUser(); window.location.href = 'index.html'; });
        } else {
            mainNav.innerHTML = `<a href="#developer-profile">My Profile</a> <a href="auth.html" class="cta-button">Login to Order</a>`;
        }
    }

    // --- HOME PAGE LOGIC (index.html) ---
    const threadsContainer = document.getElementById('threads-container');
    if (threadsContainer) {
        populateProfile(); // Populate profile on home page
        // Render threads logic remains here...
    }
    
    // --- MY PROFILE PAGE LOGIC (with Review System) ---
    if (document.body.classList.contains('profile-page-body')) {
        populateProfile();
        const reviewsList = document.getElementById('reviews-list');
        const reviewFormContainer = document.getElementById('review-form-container');
        const currentUser = App.getCurrentUser();

        const renderReviews = () => {
            reviewsList.innerHTML = '';
            const reviews = App.getReviews();
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p style="color: #fff;">No reviews yet. Be the first to leave one!</p>';
                return;
            }
            reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                let starsHTML = Array(5).fill(0).map((_, i) => `<i class="fas fa-star ${i < review.rating ? 'filled' : ''}"></i>`).join('');
                reviewCard.innerHTML = `<div class="star-rating">${starsHTML}</div><p>"${review.text}"</p><strong>- ${review.name}</strong>`;
                reviewsList.appendChild(reviewCard);
            });
        };
        
        if (currentUser) {
            reviewFormContainer.style.display = 'block';
            document.getElementById('review-form').addEventListener('submit', e => {
                e.preventDefault();
                const ratingEl = document.querySelector('input[name="rating"]:checked');
                if (!ratingEl) { alert('Please select a star rating.'); return; }
                const rating = ratingEl.value;
                const text = document.getElementById('review-text').value;
                const reviews = App.getReviews();
                reviews.unshift({ name: currentUser.name, rating, text });
                App.saveReviews(reviews);
                renderReviews();
                e.target.reset();
            });
        }
        renderReviews();
    }
    
    // --- USER AUTH LOGIC (auth.html) - DEBUGGED ---
    if (document.getElementById('login-form')) {
        // ... (This logic is complex but correct from the previous version, so it's included for completeness)
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        document.getElementById('show-signup').addEventListener('click', e => { e.preventDefault(); loginForm.classList.remove('active'); signupForm.classList.add('active'); });
        document.getElementById('show-login').addEventListener('click', e => { e.preventDefault(); signupForm.classList.remove('active'); loginForm.classList.add('active'); });
        signupForm.addEventListener('submit', e => { e.preventDefault(); const name = signupForm.querySelector('#signup-name').value; const email = signupForm.querySelector('#signup-email').value; const password = signupForm.querySelector('#signup-password').value; const users = App.getUsers(); if (users.find(user => user.email === email)) { signupForm.querySelector('.error-message').textContent = 'Email already exists.'; return; } const newUser = { name, email, password }; users.push(newUser); App.saveUsers(users); App.setCurrentUser(newUser); window.location.href = 'dashboard.html'; });
        loginForm.addEventListener('submit', e => { e.preventDefault(); const email = loginForm.querySelector('#login-email').value; const password = loginForm.querySelector('#login-password').value; const users = App.getUsers(); const user = users.find(u => u.email === email && u.password === password); if (user) { App.setCurrentUser(user); window.location.href = 'dashboard.html'; } else { loginForm.querySelector('.error-message').textContent = 'Invalid credentials.'; } });
    }

    // --- USER DASHBOARD LOGIC (dashboard.html) ---
    if (document.body.id === 'dashboard-body') {
        const currentUser = App.getCurrentUser();
        if (!currentUser) { window.location.href = 'auth.html'; return; }
        populateProfile();
        document.getElementById('user-welcome-message').textContent = `Welcome, ${currentUser.name}`;
        // ... (Rest of dashboard logic is unchanged)
    }

    // --- ADMIN LOGIN LOGIC - DEBUGGED ---
    if (document.getElementById('admin-login-form')) {
        document.getElementById('admin-login-form').addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const pass = document.getElementById('admin-password').value;
            if (email === App.adminEmail && pass === App.adminPass) {
                sessionStorage.setItem('isAdminV5', 'true'); // Using new key to avoid conflicts
                window.location.href = 'admin_dashboard.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid admin credentials.';
            }
        });
    }

    // --- ADMIN DASHBOARD LOGIC (with File Upload & Thread Management) ---
    if (document.body.id === 'admin-dashboard-body') {
        if (sessionStorage.getItem('isAdminV5') !== 'true') { window.location.href = 'admin_login.html'; return; }
        
        const threadForm = document.getElementById('thread-form');
        const fileInput = document.getElementById('thread-image-upload');
        const fileNameEl = document.getElementById('file-name');
        let imageDataUrl = null;

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                fileNameEl.textContent = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
                const reader = new FileReader();
                reader.onload = (e) => { imageDataUrl = e.target.result; };
                reader.readAsDataURL(file);
            }
        });

        const manageThreadsList = document.getElementById('manage-threads-list');
        const renderAdminThreads = () => {
            manageThreadsList.innerHTML = '';
            const threads = App.getThreads();
            if (threads.length === 0) { manageThreadsList.innerHTML = '<p>No threads posted yet.</p>'; return; }
            threads.forEach((thread, index) => {
                const item = document.createElement('div');
                item.className = 'manage-thread-item';
                item.innerHTML = `<p>${thread.caption}</p><button class="cta-button danger delete-thread-btn" data-index="${index}"><i class="fas fa-trash"></i></button>`;
                manageThreadsList.appendChild(item);
            });
        };

        manageThreadsList.addEventListener('click', e => {
            if (e.target.closest('.delete-thread-btn')) {
                const index = e.target.closest('.delete-thread-btn').dataset.index;
                if (confirm('Are you sure you want to delete this thread?')) {
                    let threads = App.getThreads();
                    threads.splice(index, 1);
                    App.saveThreads(threads);
                    renderAdminThreads();
                }
            }
        });

        threadForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!imageDataUrl) { alert('Please choose an image file first.'); return; }
            const threads = App.getThreads();
            threads.unshift({ id: Date.now(), image: imageDataUrl, caption: document.getElementById('thread-caption').value, likes: 0, likedBy: [], comments: [] });
            App.saveThreads(threads);
            threadForm.reset();
            fileNameEl.textContent = 'No file chosen';
            imageDataUrl = null;
            renderAdminThreads();
            alert('New thread posted to the main feed!');
        });
        
        renderAdminThreads();
        document.getElementById('logout-btn').addEventListener('click', () => { sessionStorage.removeItem('isAdminV5'); window.location.href = 'index.html'; });
    }
});

