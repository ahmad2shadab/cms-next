// Modern e-Nivaran Application JavaScript
class ENivaranApp {
    constructor() {
        this.currentSection = 'landing';
        this.isMobile = window.innerWidth <= 768;
        this.sidebarOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.updateCopyrightYear();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Navigation event listeners
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-section')) {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    updateCopyrightYear() {
        const yearElements = document.querySelectorAll('#currentYear');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            if (el) el.textContent = currentYear;
        });
    }

    handleInitialLoad() {
        // Add fade-in animations to page elements
        setTimeout(() => {
            this.addFadeInAnimations();
        }, 100);
    }

    addFadeInAnimations() {
        const elements = document.querySelectorAll('.fade-in, [data-animate="fade-in"]');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    navigateToSection(sectionId) {
        console.log('Navigating to:', sectionId);
        this.currentSection = sectionId;
        
        // Close mobile sidebar if open
        if (this.isMobile && this.sidebarOpen) {
            this.closeSidebar();
        }
        
        // Update active navigation items
        this.updateActiveNavItems();
    }

    updateActiveNavItems() {
        // Remove active classes
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-accent', 'text-accent-foreground');
        });
        
        // Add active class to current nav item
        const activeItem = document.querySelector(`[data-section="${this.currentSection}"]`);
        if (activeItem) {
            activeItem.classList.add('bg-accent', 'text-accent-foreground');
        }
    }

    handleResize() {
        const wasModle = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Close sidebar if switching from mobile to desktop
        if (wasModle && !this.isMobile) {
            this.closeSidebar();
        }
    }

    handleKeyboard(e) {
        // Close sidebar with Escape key
        if (e.key === 'Escape' && this.sidebarOpen) {
            this.closeSidebar();
        }
    }

    // Sidebar methods (used by sidebar.html)
    toggleSidebar() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('-translate-x-full');
            overlay.style.display = 'block';
            document.body.classList.add('overflow-hidden');
            this.sidebarOpen = true;
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('-translate-x-full');
            overlay.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
            this.sidebarOpen = false;
        }
    }

    // Form validation methods
    setupFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^\+?[\d\s-()]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Show/hide error
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        // Add error styling
        field.classList.add('border-red-500', 'focus-visible:ring-red-500');
        
        // Create error message
        const errorElement = document.createElement('p');
        errorElement.className = 'text-xs text-red-600 mt-1';
        errorElement.textContent = message;
        errorElement.setAttribute('data-field-error', '');
        
        // Insert after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus-visible:ring-red-500');
        
        const errorElement = field.parentNode.querySelector('[data-field-error]');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('[data-notification]');
        if (existing) {
            existing.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.setAttribute('data-notification', '');
        notification.className = `fixed top-4 right-4 z-50 rounded-md border p-4 shadow-lg max-w-md ${
            type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="fas ${
                        type === 'success' ? 'fa-check-circle' :
                        type === 'error' ? 'fa-exclamation-circle' :
                        'fa-info-circle'
                    } h-5 w-5"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">${message}</p>
                </div>
                <div class="ml-auto pl-3">
                    <button class="inline-flex rounded-md p-1.5 hover:bg-black/5" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times h-4 w-4"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Animation helpers
    animateNumber(elementId, target, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 20);
    }
}

// Global functions for component integration
function initializeHeader() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    html.classList.toggle('dark', savedTheme === 'dark');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.contains('dark');
            html.classList.toggle('dark', !isDark);
            localStorage.setItem('theme', !isDark ? 'dark' : 'light');
        });
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            if (window.app) {
                window.app.toggleSidebar();
            }
        });
    }
}

function initializeSidebar() {
    // Update active nav items
    if (window.app) {
        window.app.updateActiveNavItems();
    }
}

function navigateToSection(section) {
    if (window.app) {
        window.app.navigateToSection(section);
    }
}

function openSidebar() {
    if (window.app) {
        window.app.openSidebar();
    }
}

function closeSidebar() {
    if (window.app) {
        window.app.closeSidebar();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new ENivaranApp();
    
    // Initialize components if they're already loaded
    if (document.getElementById('themeToggle')) {
        initializeHeader();
    }
    
    if (document.getElementById('sidebar')) {
        initializeSidebar();
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements when they're added to the DOM
function observeElements() {
    document.querySelectorAll('[data-animate="on-scroll"]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Call observe elements after a short delay to ensure DOM is ready
setTimeout(observeElements, 500);