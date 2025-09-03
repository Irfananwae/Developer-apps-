
document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SWITCHER ---
    const lightThemeBtn = document.getElementById('light-theme-btn');
    const darkThemeBtn = document.getElementById('dark-theme-btn');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        darkThemeBtn.classList.add('active');
        lightThemeBtn.classList.remove('active');
    }

    lightThemeBtn.addEventListener('click', () => {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        lightThemeBtn.classList.add('active');
        darkThemeBtn.classList.remove('active');
    });

    darkThemeBtn.addEventListener('click', () => {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        darkThemeBtn.classList.add('active');
        lightThemeBtn.classList.remove('active');
    });

    // --- PORTFOLIO MANAGEMENT (SHARED LOGIC) ---
    const getProjects = () => JSON.parse(localStorage.getItem('portfolioProjects')) || [
        { title: "Default Project", image: "https://via.placeholder.com/400x250", description: "This is a default project. Log in as an admin to delete it." }
    ];
    const saveProjects = (projects) => localStorage.setItem('portfolioProjects', JSON.stringify(projects));

    // --- PUBLIC PORTFOLIO PAGE LOGIC (index.html) ---
    const publicPortfolioGrid = document.getElementById('portfolio-grid');
    if (publicPortfolioGrid) {
        const projects = getProjects();
        projects.forEach(project => {
            const item = document.createElement('div');
            item.className = 'portfolio-item';
            item.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="portfolio-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>`;
            publicPortfolioGrid.appendChild(item);
        });
    }

    // --- LOGIN PAGE LOGIC (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('login-error');

            if (email === 'imirfan7738t@gmail.com' && password === 'admin123') {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                errorMsg.textContent = 'Invalid credentials. Please try again.';
            }
        });
    }
    
    // --- ADMIN PAGE LOGIC (admin.html) ---
    const adminPage = document.getElementById('admin-body');
    if (adminPage) {
        // Page Guard: Redirect if not logged in
        if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return; // Stop executing script
        }
        
        const adminPortfolioGrid = document.getElementById('admin-portfolio-grid');
        const projectForm = document.getElementById('project-form');
        const logoutBtn = document.getElementById('logout-btn');

        const renderAdminProjects = () => {
            adminPortfolioGrid.innerHTML = '';
            const projects = getProjects();
            projects.forEach((project, index) => {
                const item = document.createElement('div');
                item.className = 'portfolio-item';
                item.innerHTML = `
                    <div class="portfolio-content">
                        <h3>${project.title}</h3>
                        <button class="delete-button" data-index="${index}">Delete</button>
                    </div>`;
                adminPortfolioGrid.appendChild(item);
            });
        };

        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const projects = getProjects();
            const newProject = {
                title: document.getElementById('project-title').value,
                image: document.getElementById('project-image').value,
                description: document.getElementById('project-description').value
            };
            projects.push(newProject);
            saveProjects(projects);
            renderAdminProjects();
            projectForm.reset();
        });

        adminPortfolioGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-button')) {
                const index = e.target.getAttribute('data-index');
                if (confirm('Are you sure you want to delete this project?')) {
                    const projects = getProjects();
                    projects.splice(index, 1);
                    saveProjects(projects);
                    renderAdminProjects();
                }
            }
        });
        
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminLoggedIn');
            window.location.href = 'login.html';
        });

        renderAdminProjects();
    }
});

