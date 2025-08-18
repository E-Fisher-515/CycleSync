/**
 * CycleSync - Main Application File
 * Handles navigation, app initialization, and core functionality
 * FISH-10: Core Navigation and App Structure
 */

console.log('🔄 App.js loading...');

class CycleSyncApp {
    constructor() {
        console.log('🔄 CycleSyncApp constructor called');
        this.currentSection = 'dashboard';
        this.isInitialized = false;
    }

    init() {
        console.log('🔄 App init() called');
        try {
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupEventListeners();
            this.showSection(this.currentSection);
            this.isInitialized = true;
            console.log('✅ CycleSync app initialized successfully');
            
            // Make app globally accessible for debugging
            window.cycleSyncApp = this;
        } catch (error) {
            console.error('❌ Failed to initialize CycleSync app:', error);
        }
    }

    setupNavigation() {
        console.log('🔄 Setting up navigation...');
        
        // Get all navigation links
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        console.log(`Found ${this.navLinks.length} nav links and ${this.sections.length} sections`);
        
        if (this.navLinks.length === 0) {
            console.error('❌ No navigation links found');
            return;
        }
        
        if (this.sections.length === 0) {
            console.error('❌ No sections found');
            return;
        }
        
        // Add click event listeners to navigation
        this.navLinks.forEach((link, index) => {
            console.log(`Setting up nav link ${index}: ${link.getAttribute('href')}`);
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                console.log(`🔄 Navigating to: ${targetSection}`);
                this.navigateToSection(targetSection);
            });
        });
        
        console.log('✅ Navigation setup complete');
    }

    setupMobileMenu() {
        console.log('🔄 Setting up mobile menu...');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                console.log('📱 Mobile menu toggled');
            });
            console.log('✅ Mobile menu setup complete');
        } else {
            console.warn('⚠️ Mobile menu elements not found');
        }
    }

    setupEventListeners() {
        console.log('🔄 Setting up event listeners...');
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('.nav');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (!nav.contains(e.target) && navToggle && navToggle.classList.contains('active')) {
                navToggle.classList.remove('active');
                document.querySelector('.nav-menu').classList.remove('active');
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    navigateToSection(sectionId) {
        console.log(`🔄 Navigating to section: ${sectionId}`);
        
        if (!this.isValidSection(sectionId)) {
            console.error(`❌ Invalid section: ${sectionId}`);
            return;
        }

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
        if (navMenu && navToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }

        console.log(`✅ Navigation complete: ${sectionId}`);
    }

    isValidSection(sectionId) {
        return Array.from(this.sections).some(section => section.id === sectionId);
    }

    showSection(sectionId) {
        console.log(`🔄 Showing section: ${sectionId}`);
        
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`✅ Section displayed: ${sectionId}`);
        } else {
            console.error(`❌ Section not found: ${sectionId}`);
        }
    }

    // Method to test navigation functionality
    testNavigation() {
        console.log('🧪 Testing navigation functionality...');
        
        const testResults = {
            totalSections: this.sections.length,
            totalNavLinks: this.navLinks.length,
            currentSection: this.currentSection,
            isInitialized: this.isInitialized
        };

        console.log('📊 Navigation test results:', testResults);
        return testResults;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 DOM loaded, initializing app...');
    const app = new CycleSyncApp();
    app.init();
});

// Also try to initialize on window load as backup
window.addEventListener('load', () => {
    if (!window.cycleSyncApp) {
        console.log('🔄 Window loaded, initializing app as backup...');
        const app = new CycleSyncApp();
        app.init();
    }
});

console.log('✅ App.js loaded successfully');
