
document.addEventListener('DOMContentLoaded', () => {
    // --- SHARED APP LOGIC ---
    const App = {
        adminEmail: 'imirfan7738t@gmail.com',
        adminPass: 'admin123',
        getThreads: () => JSON.parse(localStorage.getItem('threadsV2')) || [],
        saveThreads: (threads) => localStorage.setItem('threadsV2', JSON.stringify(threads)),
        getUsers: () => JSON.parse(localStorage.getItem('usersV2')) || [],
        saveUsers: (users) => localStorage.setItem('usersV2', JSON.stringify(users)),
        getMessages: () => JSON.parse(localStorage.getItem('messagesV2')) || [],
        saveMessages: (messages) => localStorage.setItem('messagesV2', JSON.stringify(messages)),
        getReviews: () => JSON.parse(localStorage.getItem('reviewsV2')) || [],
        saveReviews: (reviews) => localStorage.setItem('reviewsV2', JSON.stringify(reviews)),
        getCurrentUser: () => JSON.parse(sessionStorage.getItem('currentUserV2')),
        setCurrentUser: (user) => sessionStorage.setItem('currentUserV2', JSON.stringify(user)),
        logoutUser: () => sessionStorage.removeItem('currentUserV2'),
    };

    // --- ADMIN PROFILE DATA ---
    const adminProfile = {
        name: "M Irfan",
        username: "@website_developer06",
        bio: "Full-Stack Developer specializing in scalable web/mobile apps. Turning complex problems into elegant solutions.",
        skills: ["React", "Node.js", "Python", "iOS Dev", "Android Dev", "UI/UX"],
    };

    // --- DYNAMIC HEADER LOGIC ---
    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
        const currentUser = App.getCurrentUser();
        if (currentUser) {
            mainNav.innerHTML = `
                <span>Welcome, ${currentUser.name}</span>
                <a href="dashboard.html">Dashboard</a>
                <a href="my_profile.html">Developer Profile</a>
                <button id="logout-btn" class="cta-button secondary">Logout</button>
            `;
            mainNav.querySelector('#logout-btn').addEventListener('click', () => { App.logoutUser(); window.location.href = 'index.html'; });
        } else {
            mainNav.innerHTML = `
                <a href="my_profile.html">My Profile</a>
                <a href="auth.html" class="cta-button">Login to Order</a>
            `;
        }
    }

    // --- PUBLIC THREAD FEED LOGIC (index.html) ---
    const threadsContainer = document.getElementById('threads-container');
    if (threadsContainer) {
        // [This section is identical to the previous version and is omitted for brevity]
        // [Copy the logic from the previous main.js file here if needed]
    }

    // --- MY PROFILE PAGE LOGIC ---
    if (document.body.classList.contains('profile-page-body')) {
        document.getElementById('profile-name').textContent = adminProfile.name;
        document.getElementById('profile-username').textContent = adminProfile.username;
        document.getElementById('profile-bio').textContent = adminProfile.bio;
        const skillsContainer = document.getElementById('profile-skills');
        adminProfile.skills.forEach(skill => {
            const badge = document.createElement('span');
            badge.className = 'skill-badge';
            badge.textContent = skill;
            skillsContainer.appendChild(badge);
        });

        const reviewsList = document.getElementById('reviews-list');
        const reviewFormContainer = document.getElementById('review-form-container');
        const currentUser = App.getCurrentUser();

        const renderReviews = () => {
            reviewsList.innerHTML = '';
            const reviews = App.getReviews();
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p>No reviews yet. Be the first to leave one!</p>';
                return;
            }
            reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                let starsHTML = '';
                for(let i = 0; i < 5; i++) {
                    starsHTML += `<i class="fas fa-star ${i < review.rating ? 'filled' : ''}"></i>`;
                }
                reviewCard.innerHTML = `
                    <div class="star-rating">${starsHTML}</div>
                    <p>${review.text}</p>
                    <strong>- ${review.name}</strong>
                `;
                reviewsList.appendChild(reviewCard);
            });
        };
        
        if (currentUser) {
            reviewFormContainer.style.display = 'block';
            document.getElementById('review-form').addEventListener('submit', e => {
                e.preventDefault();
                const rating = document.querySelector('input[name="rating"]:checked').value;
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
    
    // All other logic (Auth, Dashboards, etc.) remains the same as the previous version.
    // [Copy the logic from the previous main.js file here if needed]
});

