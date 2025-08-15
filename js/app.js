/**
 * CycleSync - Main Application File
 * Handles navigation, app initialization, and core functionality
 */

class CycleSyncApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupEventListeners();
        this.showSection(this.currentSection);
        console.log('CycleSync app initialized successfully');
    }

    setupNavigation() {
        // Get all navigation links
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        // Add click event listeners to navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    setupEventListeners() {
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('.nav');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (!nav.contains(e.target) && navToggle.classList.contains('active')) {
                navToggle.classList.remove('active');
                document.querySelector('.nav-menu').classList.remove('active');
            }
        });

        // Handle window resize for mobile menu
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.querySelector('.nav-menu').classList.remove('active');
                document.querySelector('.nav-toggle').classList.remove('active');
            }
        });
    }

    navigateToSection(sectionId) {
        // Update navigation active state
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Show the target section
        this.showSection(sectionId);
        
        // Update current section
        this.currentSection = sectionId;
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }

        // Update URL hash without triggering scroll
        history.replaceState(null, null, `#${sectionId}`);
    }

    showSection(sectionId) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            console.error(`Section ${sectionId} not found`);
        }
    }

    // Utility method to get current section
    getCurrentSection() {
        return this.currentSection;
    }

    // Method to refresh current section
    refreshCurrentSection() {
        this.showSection(this.currentSection);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cycleSyncApp = new CycleSyncApp();
});

// Export for use in other modules
export default CycleSyncApp;
