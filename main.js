
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
                <a href="my_profile.html">My Profile</a>
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
        const renderThreads = () => {
            const threads = App.getThreads();
            threadsContainer.innerHTML = threads.length === 0 ? '<p style="text-align:center; color: #fff;">The developer hasn\'t posted any threads yet.</p>' : '';
            
            threads.forEach((thread, index) => {
                const threadCard = document.createElement('div');
                threadCard.className = 'thread-card glass-card';
                let commentsHTML = thread.comments.map(c => `<div class="comment"><strong>${c.user}:</strong> ${c.text}</div>`).join('');

                threadCard.innerHTML = `
                    <img src="${thread.image}" alt="Thread image">
                    <div class="thread-content">
                        <p><strong>@website_developer06:</strong> ${thread.caption}</p>
                        <div class="thread-actions">
                            <span class="like-btn ${thread.liked ? 'liked' : ''}" data-index="${index}"><i class="fas fa-heart"></i> ${thread.likes}</span>
                        </div>
                        <div class="comments-section">
                            <h4>Comments</h4>
                            <div class="comments-list">${commentsHTML}</div>
                            <form class="comment-form" data-index="${index}">
                                <div class="input-group"><input type="text" placeholder="Add a comment..." required></div>
                                <button type="submit" class="cta-button">Post</button>
                            </form>
                        </div>
                    </div>`;
                threadsContainer.appendChild(threadCard);
            });
        };

        threadsContainer.addEventListener('click', e => {
            if (e.target.closest('.like-btn')) {
                const index = e.target.closest('.like-btn').dataset.index;
                let threads = App.getThreads();
                threads[index].likes += threads[index].liked ? -1 : 1;
                threads[index].liked = !threads[index].liked;
                App.saveThreads(threads);
                renderThreads();
            }
        });
        
        threadsContainer.addEventListener('submit', e => {
            if(e.target.classList.contains('comment-form')) {
                e.preventDefault();
                const currentUser = App.getCurrentUser();
                const index = e.target.dataset.index;
                const commentInput = e.target.querySelector('input');
                let threads = App.getThreads();
                threads[index].comments.push({
                    user: currentUser ? currentUser.name : 'Anonymous',
                    text: commentInput.value
                });
                App.saveThreads(threads);
                renderThreads();
            }
        });
        renderThreads();
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
    }

    // --- USER AUTH LOGIC ---
    if (document.getElementById('login-form')) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        document.getElementById('show-signup').addEventListener('click', e => { e.preventDefault(); loginForm.classList.remove('active'); signupForm.classList.add('active'); });
        document.getElementById('show-login').addEventListener('click', e => { e.preventDefault(); signupForm.classList.remove('active'); loginForm.classList.add('active'); });

        signupForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = signupForm.querySelector('#signup-name').value;
            const email = signupForm.querySelector('#signup-email').value;
            const password = signupForm.querySelector('#signup-password').value;
            const users = App.getUsers();
            if (users.find(user => user.email === email)) {
                signupForm.querySelector('.error-message').textContent = 'Email already exists.';
                return;
            }
            const newUser = { name, email, password };
            users.push(newUser);
            App.saveUsers(users);
            App.setCurrentUser(newUser);
            window.location.href = 'dashboard.html';
        });
        
        loginForm.addEventListener('submit', e => {
            e.preventDefault();
            const email = loginForm.querySelector('#login-email').value;
            const password = loginForm.querySelector('#login-password').value;
            const users = App.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                App.setCurrentUser(user);
                window.location.href = 'dashboard.html';
            } else {
                loginForm.querySelector('.error-message').textContent = 'Invalid credentials.';
            }
        });
    }

    // --- USER DASHBOARD LOGIC ---
    if (document.body.id === 'dashboard-body') {
        const currentUser = App.getCurrentUser();
        if (!currentUser) { window.location.href = 'auth.html'; return; }
        
        document.getElementById('user-email-display').textContent = `Welcome, ${currentUser.name}`;
        document.getElementById('message-form').addEventListener('submit', e => {
            e.preventDefault();
            const text = document.getElementById('message-text').value;
            const messages = App.getMessages();
            messages.push({ from: currentUser.email, name: currentUser.name, text, date: new Date().toLocaleString() });
            App.saveMessages(messages);
            document.getElementById('message-success').textContent = "Your message has been sent successfully!";
            document.getElementById('message-text').value = '';
        });
        document.getElementById('logout-btn').addEventListener('click', () => { App.logoutUser(); window.location.href = 'index.html'; });
    }

    // --- ADMIN LOGIN LOGIC ---
    if (document.getElementById('admin-login-form')) {
        document.getElementById('admin-login-form').addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const pass = document.getElementById('admin-password').value;
            if (email === App.adminEmail && pass === App.adminPass) {
                sessionStorage.setItem('isAdminV2', 'true');
                window.location.href = 'admin_dashboard.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid admin credentials.';
            }
        });
    }

    // --- ADMIN DASHBOARD LOGIC ---
    if (document.body.id === 'admin-dashboard-body') {
        if (sessionStorage.getItem('isAdminV2') !== 'true') { window.location.href = 'admin_login.html'; return; }
        
        const messageInbox = document.getElementById('message-inbox');
        const messages = App.getMessages();
        messageInbox.innerHTML = messages.length === 0 ? '<p>No user messages yet.</p>' : '';
        messages.forEach(msg => {
            const msgCard = document.createElement('div');
            msgCard.className = 'message-card';
            msgCard.innerHTML = `<strong>From: ${msg.name} (${msg.from})</strong><p>${msg.text}</p><small>${msg.date}</small>`;
            messageInbox.appendChild(msgCard);
        });

        document.getElementById('thread-form').addEventListener('submit', e => {
            e.preventDefault();
            const threads = App.getThreads();
            threads.unshift({
                image: document.getElementById('thread-image').value,
                caption: document.getElementById('thread-caption').value,
                likes: Math.floor(Math.random() * 200), // Start with some random likes for realism
                liked: false,
                comments: []
            });
            App.saveThreads(threads);
            e.target.reset();
            alert('New thread posted to the main feed!');
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => { sessionStorage.removeItem('isAdminV2'); window.location.href = 'index.html'; });
    }
});

