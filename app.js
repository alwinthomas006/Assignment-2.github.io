// Employee Dashboard Application
const app = {
    // State management
    employees: [],
    currentRoute: 'home',

    // Initialize the application
    init() {
        this.setupRouting();
        this.setupEventListeners();
        this.handleRoute();
    },

    // Setup hash-based routing
    setupRouting() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Set initial route if hash is empty
        if (!window.location.hash) {
            window.location.hash = '#home';
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Form submission
        const form = document.getElementById('employee-form');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Navigation links
        const navLinks = document.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.updateActiveNavLink(link);
            });
        });
    },

    // Handle routing based on hash
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        this.currentRoute = hash;

        // Hide all sections
        document.getElementById('dashboard-section').classList.add('hidden');
        document.getElementById('form-section').classList.add('hidden');

        // Show appropriate section
        if (hash === 'home' || hash === 'dashboard') {
            document.getElementById('dashboard-section').classList.remove('hidden');
            if (this.employees.length === 0) {
                this.loadEmployees();
            }
        } else if (hash === 'employee-form') {
            document.getElementById('form-section').classList.remove('hidden');
        }

        // Update active nav link
        this.updateActiveNavLinkByRoute(hash);
    },

    // Update active navigation link by route
    updateActiveNavLinkByRoute(route) {
        const navLinks = document.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            const linkRoute = link.getAttribute('data-route');
            if (linkRoute === route || (route === 'dashboard' && linkRoute === 'home')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    // Update active navigation link
    updateActiveNavLink(clickedLink) {
        const navLinks = document.querySelectorAll('[data-route]');
        navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    },

    // Load employees from API
    async loadEmployees() {
        const loadingState = document.getElementById('loading-state');
        const errorState = document.getElementById('error-state');
        const employeeGrid = document.getElementById('employee-grid');

        // Show loading state
        loadingState.classList.remove('hidden');
        errorState.classList.add('hidden');
        employeeGrid.classList.add('hidden');

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.employees = data;
            this.renderEmployees();

            // Hide loading, show grid
            loadingState.classList.add('hidden');
            employeeGrid.classList.remove('hidden');

            // Update employee count
            this.updateEmployeeCount();

        } catch (error) {
            console.error('Error loading employees:', error);
            
            // Show error state
            loadingState.classList.add('hidden');
            errorState.classList.remove('hidden');
            
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = `Failed to load employee data. ${error.message}`;
        }
    },

    // Render employee cards
    renderEmployees() {
        const employeeGrid = document.getElementById('employee-grid');
        employeeGrid.innerHTML = '';

        this.employees.forEach(employee => {
            const card = this.createEmployeeCard(employee);
            employeeGrid.appendChild(card);
        });
    },

    // Create employee card element
    createEmployeeCard(employee) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        col.innerHTML = `
            <div class="employee-card">
                <span class="employee-id">#${employee.id}</span>
                <h3 class="employee-name">${this.escapeHtml(employee.name)}</h3>
                <div class="employee-email">
                    <i class="fas fa-envelope"></i>
                    <span>${this.escapeHtml(employee.email)}</span>
                </div>
            </div>
        `;

        return col;
    },

    // Update employee count display
    updateEmployeeCount() {
        const countText = document.getElementById('employee-count-text');
        const count = this.employees.length;
        countText.textContent = `${count} Employee${count !== 1 ? 's' : ''}`;
    },

    // Handle form submission
    handleFormSubmit(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('employee-name').value.trim();
        const designation = document.getElementById('employee-designation').value;
        const location = document.getElementById('employee-location').value.trim();
        const salary = document.getElementById('employee-salary').value;

        // Validate form
        if (!name || !designation || !location || !salary) {
            this.showAlert('Please fill in all required fields', 'warning');
            return;
        }

        // Create employee object (for demonstration purposes)
        const newEmployee = {
            name,
            designation,
            location,
            salary: parseFloat(salary)
        };

        console.log('New Employee Data:', newEmployee);

        // Show success message
        this.showAlert(
            `Employee "${name}" has been successfully added!`,
            'success'
        );

        // Reset form
        document.getElementById('employee-form').reset();
    },

    // Show alert message
    showAlert(message, type = 'success') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.success-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show success-alert`;
        alert.setAttribute('role', 'alert');
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'warning' ? 'exclamation-triangle' : 
                     'info-circle';
        
        alert.innerHTML = `
            <i class="fas fa-${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alert);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert && alert.parentElement) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}