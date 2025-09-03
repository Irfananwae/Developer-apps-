
document.addEventListener('DOMContentLoaded', () => {

    // --- SHARED LOGIC & HELPERS ---
    const App = {
        theme: localStorage.getItem('theme') || 'light',
        
        // User management
        getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
        saveUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
        getCurrentUser: () => sessionStorage.getItem('currentUser'),
        setCurrentUser: (email) => sessionStorage.setItem('currentUser', email),
        logoutUser: () => sessionStorage.removeItem('currentUser'),

        // Project management
        getAllProjects: () => JSON.parse(localStorage.getItem('projects')) || [],
        saveAllProjects: (projects) => localStorage.setItem('projects', JSON.stringify(projects)),
    };

    // --- THEME SWITCHER LOGIC ---
    const lightThemeBtn = document.getElementById('light-theme-btn');
    const darkThemeBtn = document.getElementById('dark-theme-btn');

    const applyTheme = () => {
        if (App.theme === 'dark') {
            document.body.classList.add('dark-theme');
            darkThemeBtn?.classList.add('active');
            lightThemeBtn?.classList.remove('active');
        } else {
            document.body.classList.remove('dark-theme');
            lightThemeBtn?.classList.add('active');
            darkThemeBtn?.classList.remove('active');
        }
    };

    lightThemeBtn?.addEventListener('click', () => {
        App.theme = 'light';
        localStorage.setItem('theme', 'light');
        applyTheme();
    });

    darkThemeBtn?.addEventListener('click', () => {
        App.theme = 'dark';
        localStorage.setItem('theme', 'dark');
        applyTheme();
    });
    
    applyTheme(); // Apply theme on initial load

    // --- AUTHENTICATION PAGE LOGIC (auth.html) ---
    if (document.body.classList.contains('auth-page')) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const showSignupBtn = document.getElementById('show-signup');
        const showLoginBtn = document.getElementById('show-login');

        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const errorEl = document.getElementById('signup-error');
            const users = App.getUsers();

            if (users.find(user => user.email === email)) {
                errorEl.textContent = 'An account with this email already exists.';
                return;
            }

            users.push({ email, password });
            App.saveUsers(users);
            App.setCurrentUser(email);
            window.location.href = 'dashboard.html';
        });
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');
            const users = App.getUsers();
            
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                App.setCurrentUser(email);
                window.location.href = 'dashboard.html';
            } else {
                errorEl.textContent = 'Invalid email or password.';
            }
        });
    }

    // --- DASHBOARD PAGE LOGIC (dashboard.html) ---
    if (document.body.id === 'dashboard-body') {
        const currentUser = App.getCurrentUser();
        
        // Page Guard
        if (!currentUser) {
            window.location.href = 'auth.html';
            return;
        }

        const userEmailDisplay = document.getElementById('user-email-display');
        const logoutBtn = document.getElementById('logout-btn');
        const projectForm = document.getElementById('project-form');
        const projectList = document.getElementById('project-list');
        
        userEmailDisplay.textContent = currentUser;

        const renderProjects = () => {
            projectList.innerHTML = '';
            const allProjects = App.getAllProjects();
            const userProjects = allProjects.filter(p => p.user === currentUser);

            if (userProjects.length === 0) {
                 projectList.innerHTML = '<p>You have no projects yet. Add one!</p>';
                 return;
            }

            userProjects.forEach((project, index) => {
                const projectEl = document.createElement('div');
                projectEl.className = 'project-card';
                projectEl.innerHTML = `
                    <div>
                        <h4>${project.title}</h4>
                        <p>${project.description}</p>
                    </div>
                    <button class="cta-button secondary delete-btn" data-title="${project.title}"><i class="fas fa-trash"></i></button>
                `;
                projectList.appendChild(projectEl);
            });
        };
        
        projectForm.addEventListener('submit', e => {
            e.preventDefault();
            const newProject = {
                user: currentUser,
                title: document.getElementById('project-title').value,
                image: document.getElementById('project-image').value,
                description: document.getElementById('project-description').value,
            };
            const allProjects = App.getAllProjects();
            allProjects.push(newProject);
            App.saveAllProjects(allProjects);
            projectForm.reset();
            renderProjects();
        });

        projectList.addEventListener('click', e => {
            if (e.target.closest('.delete-btn')) {
                const projectTitle = e.target.closest('.delete-btn').dataset.title;
                if (confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
                    let allProjects = App.getAllProjects();
                    allProjects = allProjects.filter(p => !(p.user === currentUser && p.title === projectTitle));
                    App.saveAllProjects(allProjects);
                    renderProjects();
                }
            }
        });

        logoutBtn.addEventListener('click', () => {
            App.logoutUser();
            window.location.href = 'index.html';
        });

        renderProjects();
    }
});

