
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header on Scroll ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Modal Logic ---
    const modal = document.getElementById('project-modal');
    const addProjectButton = document.getElementById('add-project-button');
    const closeButton = document.querySelector('.close-button');

    addProjectButton.addEventListener('click', () => modal.classList.add('show'));
    closeButton.addEventListener('click', () => modal.classList.remove('show'));
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // --- Local Storage Portfolio Management ---
    const portfolioGrid = document.getElementById('portfolio-grid');
    const projectForm = document.getElementById('project-form');

    // Load projects from Local Storage or use default examples
    let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [
        {
            title: "E-commerce Platform",
            image: "https://via.placeholder.com/400x250",
            description: "A full-featured online store with a modern UI and secure payment gateway."
        },
        {
            title: "Mobile Fitness App",
            image: "https://via.placeholder.com/400x250",
            description: "A native app for tracking workouts and nutrition, built for performance."
        },
        {
            title: "Corporate Website",
            image: "https://via.placeholder.com/400x250",
            description: "A professional and responsive website to represent a business online."
        }
    ];

    // Function to save projects to Local Storage
    const saveProjects = () => {
        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
    };

    // Function to render projects to the page
    const renderProjects = () => {
        portfolioGrid.innerHTML = '';
        if (projects.length === 0) {
            portfolioGrid.innerHTML = '<p>No projects yet. Add one using the plus button!</p>';
            return;
        }
        projects.forEach((project, index) => {
            const projectElement = document.createElement('div');
            projectElement.classList.add('portfolio-item');
            projectElement.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="portfolio-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <button class="delete-button" data-index="${index}">Delete</button>
                </div>
            `;
            portfolioGrid.appendChild(projectElement);
        });
    };

    // Handle form submission to add a new project
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newProject = {
            title: document.getElementById('project-title').value,
            image: document.getElementById('project-image').value,
            description: document.getElementById('project-description').value
        };
        projects.push(newProject);
        saveProjects();
        renderProjects();
        projectForm.reset();
        modal.classList.remove('show');
    });

    // Handle project deletion using event delegation
    portfolioGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-button')) {
            const index = e.target.getAttribute('data-index');
            // Confirm before deleting
            if (confirm('Are you sure you want to delete this project?')) {
                projects.splice(index, 1);
                saveProjects();
                renderProjects();
            }
        }
    });
    
    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // NOTE: This is for demonstration. A real form needs a backend server to send emails.
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });

    // Initial render of projects when the page loads
    renderProjects();
});

