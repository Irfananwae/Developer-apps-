
document.addEventListener('DOMContentLoaded', () => {

    // --- SHARED APP LOGIC ---
    const App = {
        adminEmail: 'imirfan7738t@gmail.com',
        adminPass: 'admin123',
        getProjects: () => JSON.parse(localStorage.getItem('adminProjects')) || [],
        saveProjects: (projects) => localStorage.setItem('adminProjects', JSON.stringify(projects)),
    };

    // --- AUTO-GENERATED ADMIN PROFILE DATA ---
    const adminProfile = {
        name: "M Irfan",
        username: "@website_developer06",
        bio: "Full-Stack Developer specializing in creating beautiful, functional, and scalable web and mobile applications. Turning complex problems into elegant solutions.",
        skills: ["React", "Node.js", "Python", "iOS Dev", "Android Dev", "UI/UX Design"],
    };

    // --- PUBLIC PAGE LOGIC (index.html) ---
    if (document.querySelector('.scrollable-content')) {
        
        // Render Admin Projects
        const portfolioGrid = document.getElementById('portfolio-grid');
        const projects = App.getProjects();
        if (projects.length === 0) {
            portfolioGrid.innerHTML = '<p>The admin has not uploaded any projects yet.</p>';
        } else {
            projects.forEach(p => {
                const card = document.createElement('div');
                card.className = 'portfolio-card';
                card.innerHTML = `<img src="${p.image}" alt="${p.title}"><h3>${p.title}</h3>`;
                portfolioGrid.appendChild(card);
            });
        }

        // My Profile Tab Logic
        const profileTab = document.getElementById('profile-tab');
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
        
        document.getElementById('show-profile-btn').addEventListener('click', (e) => {
            e.preventDefault();
            profileTab.classList.add('active');
        });
        document.getElementById('close-profile-btn').addEventListener('click', () => profileTab.classList.remove('active'));

        // Messenger Logic
        const messengerContainer = document.getElementById('messenger-container');
        document.getElementById('messenger-toggle').addEventListener('click', () => {
            messengerContainer.classList.toggle('active');
        });
        
        // Generate Fake Users
        const userList = document.getElementById('messenger-users');
        const fakeUsers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
        fakeUsers.forEach((name, i) => {
            const userEl = document.createElement('div');
            userEl.className = 'messenger-user';
            userEl.innerHTML = `
                <img src="https://i.pravatar.cc/40?u=${name}" alt="User">
                <span>${name}</span>
                <div class="online-dot"></div>
            `;
            userList.appendChild(userEl);
        });
    }

    // --- ADMIN LOGIN LOGIC ---
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value;
            const pass = document.getElementById('admin-password').value;
            if (email === App.adminEmail && pass === App.adminPass) {
                sessionStorage.setItem('isAdmin', 'true');
                window.location.href = 'admin_dashboard.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid admin credentials.';
            }
        });
    }

    // --- ADMIN DASHBOARD LOGIC ---
    if (document.body.id === 'dashboard-body') {
        // Page Guard
        if (sessionStorage.getItem('isAdmin') !== 'true') {
            window.location.href = 'admin_login.html';
            return;
        }

        const projectList = document.getElementById('admin-project-list');
        const projectForm = document.getElementById('project-form');

        const renderAdminProjects = () => {
            projectList.innerHTML = '';
            const projects = App.getProjects();
            projects.forEach((p, index) => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <span>${p.title}</span>
                    <button class="cta-button secondary delete-btn" data-index="${index}">Delete</button>
                `;
                projectList.appendChild(card);
            });
        };

        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const projects = App.getProjects();
            projects.push({
                title: document.getElementById('project-title').value,
                image: document.getElementById('project-image').value,
            });
            App.saveProjects(projects);
            projectForm.reset();
            renderAdminProjects();
        });

        projectList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = e.target.dataset.index;
                const projects = App.getProjects();
                projects.splice(index, 1);
                App.saveProjects(projects);
                renderAdminProjects();
            }
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            sessionStorage.removeItem('isAdmin');
            window.location.href = 'index.html';
        });

        renderAdminProjects();
    }
});

