
document.addEventListener('DOMContentLoaded', () => {
    // --- SHARED APP LOGIC ---
    const App = {
        adminEmail: 'imirfan7738t@gmail.com',
        adminPass: 'admin123',
        getThreads: () => JSON.parse(localStorage.getItem('threadsV6')) || [],
        saveThreads: (threads) => localStorage.setItem('threadsV6', JSON.stringify(threads)),
        getUsers: () => JSON.parse(localStorage.getItem('usersV6')) || [],
        saveUsers: (users) => localStorage.setItem('usersV6', JSON.stringify(users)),
        getMessages: () => JSON.parse(localStorage.getItem('messagesV6')) || [],
        saveMessages: (messages) => localStorage.setItem('messagesV6', JSON.stringify(messages)),
        getCurrentUser: () => JSON.parse(sessionStorage.getItem('currentUserV6')),
        setCurrentUser: (user) => sessionStorage.setItem('currentUserV6', JSON.stringify(user)),
        logoutUser: () => sessionStorage.removeItem('currentUserV6'),
    };

    // --- ADMIN PROFILE DATA ---
    const adminProfile = {
        name: "M Irfan",
        username: "@website_developer06",
        bio: "Full-Stack Developer specializing in scalable web/mobile apps. Turning complex problems into elegant solutions.",
        skills: ["React", "Node.js", "Python", "iOS Dev", "Android Dev", "UI/UX"],
    };

    const populateProfile = () => {
        const nameEl = document.getElementById('profile-name');
        if (!nameEl) return;
        const adminSeed = adminProfile.username;
        const aiAvatarUrl = `https://robohash.org/${adminSeed}.png?set=set4&bgset=bg1`;
        document.querySelectorAll('.profile-picture, #profile-picture').forEach(img => img.src = aiAvatarUrl);
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
            mainNav.innerHTML = `<a href="#developer-profile">My Profile</a> <a href="login.html" class="cta-button">Login / Sign Up</a>`;
        }
    }

    // --- HOME PAGE LOGIC ---
    if (document.getElementById('developer-profile')) {
        populateProfile();
        // Threads logic is also on this page...
    }
    
    // --- USER AUTH LOGIC (login.html & signup.html) - FIXED ---
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const user = App.getUsers().find(u => u.email === email && u.password === password);
            if (user) {
                App.setCurrentUser(user);
                window.location.href = 'dashboard.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid credentials.';
            }
        });
    }
    if (document.getElementById('signup-form')) {
        document.getElementById('signup-form').addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const users = App.getUsers();
            if (users.find(user => user.email === email)) {
                document.getElementById('signup-error').textContent = 'Email already exists.';
                return;
            }
            const newUser = { name, email, password };
            users.push(newUser);
            App.saveUsers(users);
            App.setCurrentUser(newUser);
            window.location.href = 'dashboard.html';
        });
    }

    // --- USER DASHBOARD ---
    if (document.body.id === 'dashboard-body') {
        const currentUser = App.getCurrentUser();
        if (!currentUser) { window.location.href = 'login.html'; return; }
        populateProfile();
        document.getElementById('user-welcome-message').textContent = `Welcome, ${currentUser.name}`;
        // ... (Message form logic remains the same)
    }

    // --- ADMIN LOGIN ---
    if (document.getElementById('admin-login-form')) {
        document.getElementById('admin-login-form').addEventListener('submit', e => {
            e.preventDefault();
            if (document.getElementById('admin-email').value === App.adminEmail && document.getElementById('admin-password').value === App.adminPass) {
                sessionStorage.setItem('isAdminV6', 'true');
                window.location.href = 'admin_dashboard.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid admin credentials.';
            }
        });
    }

    // --- ADMIN DASHBOARD - FIXED & UPGRADED ---
    if (document.body.id === 'admin-dashboard-body') {
        if (sessionStorage.getItem('isAdminV6') !== 'true') { window.location.href = 'admin_login.html'; return; }
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem('isAdminV6');
            window.location.href = 'index.html';
        });

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
            alert('New thread posted!');
        });
        
        renderAdminThreads();
    }
});

