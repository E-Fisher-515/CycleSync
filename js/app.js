/**
 * CycleSync - Main Application File
 * Handles navigation, app initialization, and core functionality
 * FISH-10: Core Navigation and App Structure
 */

class CycleSyncApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isInitialized = false;
        this.init();
    }

    init() {
        try {
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupEventListeners();
            this.handleInitialRoute();
            this.showSection(this.currentSection);
            this.isInitialized = true;
            console.log('✅ CycleSync app initialized successfully');
            this.logNavigationStatus();
        } catch (error) {
            console.error('❌ Failed to initialize CycleSync app:', error);
        }
    }

    setupNavigation() {
        // Get all navigation links
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        if (this.navLinks.length === 0) {
            throw new Error('No navigation links found');
        }
        
        if (this.sections.length === 0) {
            throw new Error('No sections found');
        }
        
        // Add click event listeners to navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.navigateToSection(targetSection);
            });
        });
        
        console.log(`✅ Navigation setup complete: ${this.navLinks.length} links, ${this.sections.length} sections`);
    }

    setupMobileMenu() {
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
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('.nav');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (!nav.contains(e.target) && navToggle && navToggle.classList.contains('active')) {
                navToggle.classList.remove('active');
                document.querySelector('.nav-menu').classList.remove('active');
            }
        });

        // Handle window resize for mobile menu
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu && navToggle) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.navigateToSection(e.state.section, false);
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    handleInitialRoute() {
        // Check if there's a hash in the URL
        const hash = window.location.hash.substring(1);
        if (hash && this.isValidSection(hash)) {
            this.currentSection = hash;
            console.log(`📍 Initial route detected: ${hash}`);
        } else {
            console.log(`📍 Using default route: ${this.currentSection}`);
        }
    }

    isValidSection(sectionId) {
        return Array.from(this.sections).some(section => section.id === sectionId);
    }

    navigateToSection(sectionId, updateHistory = true) {
        if (!this.isValidSection(sectionId)) {
            console.error(`❌ Invalid section: ${sectionId}`);
            return;
        }

        console.log(`🔄 Navigating to section: ${sectionId}`);

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

        // Update URL hash and history
        if (updateHistory) {
            history.pushState({ section: sectionId }, '', `#${sectionId}`);
        }

        console.log(`✅ Navigation complete: ${sectionId}`);
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
            console.log(`✅ Section displayed: ${sectionId}`);
        } else {
            console.error(`❌ Section not found: ${sectionId}`);
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

    // Method to test navigation functionality
    testNavigation() {
        console.log('🧪 Testing navigation functionality...');
        
        const testResults = {
            totalSections: this.sections.length,
            totalNavLinks: this.navLinks.length,
            currentSection: this.currentSection,
            isInitialized: this.isInitialized
        };

        // Test each section
        this.sections.forEach(section => {
            const sectionId = section.id;
            const hasNavLink = Array.from(this.navLinks).some(link => 
                link.getAttribute('href') === `#${sectionId}`
            );
            testResults[sectionId] = {
                exists: true,
                hasNavLink: hasNavLink
            };
        });

        console.log('📊 Navigation test results:', testResults);
        return testResults;
    }

    // Log current navigation status
    logNavigationStatus() {
        console.log('📋 Current Navigation Status:');
        console.log(`   Current Section: ${this.currentSection}`);
        console.log(`   Total Sections: ${this.sections.length}`);
        console.log(`   Total Nav Links: ${this.navLinks.length}`);
        console.log(`   App Initialized: ${this.isInitialized}`);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cycleSyncApp = new CycleSyncApp();
    
    // Add global test function for debugging
    window.testCycleSyncNavigation = () => {
        if (window.cycleSyncApp) {
            return window.cycleSyncApp.testNavigation();
        }
        return null;
    };
});

// Export for use in other modules
export default CycleSyncApp;
