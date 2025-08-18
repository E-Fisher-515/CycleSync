/**
 * CycleSync - Supabase Database Client
 * FISH-19: Connect Supabase DB
 * 
 * Handles:
 * - Database connection to Supabase
 * - Configuration management
 * - Client initialization
 */

// Get configuration (will be loaded from config.js)
let supabase = null;

function initializeSupabase() {
    try {
        console.log('🔄 Initializing Supabase client...');
        console.log('🔍 Checking for CycleSyncConfig:', typeof CycleSyncConfig);
        
        // Check if config is available
        if (typeof CycleSyncConfig !== 'undefined' && CycleSyncConfig.supabase) {
            console.log('✅ Config found:', CycleSyncConfig.supabase);
            const { url, anonKey } = CycleSyncConfig.supabase;
            
            // Validate configuration
            if (url === 'YOUR_SUPABASE_PROJECT_URL_HERE' || anonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
                console.warn('⚠️ Please configure your Supabase credentials in config.js');
                return null;
            }
            
            // Check if Supabase is available globally (from CDN)
            if (typeof window.supabase !== 'undefined') {
                console.log('✅ Supabase library found, creating client...');
                createSupabaseClient(url, anonKey);
            } else {
                console.warn('⚠️ Supabase not available globally. Loading from CDN...');
                // Load Supabase from CDN if not available
                loadSupabaseFromCDN().then(() => {
                    createSupabaseClient(url, anonKey);
                });
                return null;
            }
            
        } else {
            console.warn('⚠️ CycleSyncConfig not found. Make sure config.js is loaded before this file.');
            console.log('🔍 Available globals:', Object.keys(window).filter(k => k.includes('config') || k.includes('supabase')));
        }
    } catch (error) {
        console.error('❌ Failed to initialize Supabase client:', error);
    }
    
    return supabase;
}

// Load Supabase from CDN
function loadSupabaseFromCDN() {
    return new Promise((resolve, reject) => {
        if (document.querySelector('script[src*="supabase"]')) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@supabase/supabase-js@2';
        script.onload = () => {
            console.log('✅ Supabase loaded from CDN');
            resolve();
        };
        script.onerror = () => {
            console.error('❌ Failed to load Supabase from CDN');
            reject();
        };
        document.head.appendChild(script);
    });
}

// Create Supabase client
function createSupabaseClient(url, anonKey) {
    try {
        console.log('🔧 Creating Supabase client with:', { url, anonKey: anonKey.substring(0, 20) + '...' });
        
        // Try different ways to create the client
        if (window.supabase && window.supabase.createClient) {
            supabase = window.supabase.createClient(url, anonKey);
            console.log('✅ Supabase client created using createClient method');
        } else if (window.supabase && window.supabase.default && window.supabase.default.createClient) {
            supabase = window.supabase.default.createClient(url, anonKey);
            console.log('✅ Supabase client created using default.createClient method');
        } else {
            console.error('❌ Cannot find createClient method on Supabase object');
            console.log('🔍 Available methods on window.supabase:', Object.getOwnPropertyNames(window.supabase || {}));
            return;
        }
        
        // Make it available globally
        window.supabase = supabase;
        console.log('✅ Supabase client created successfully and available globally');
        
        // Test connection
        testConnection();
        
    } catch (error) {
        console.error('❌ Failed to create Supabase client:', error);
    }
}

// Test database connection
async function testConnection() {
    if (!supabase) return;
    
    try {
        console.log('🧪 Testing database connection...');
        // Simple test query
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (error) {
            console.warn('⚠️ Database connection test failed:', error.message);
        } else {
            console.log('✅ Database connection test successful');
        }
    } catch (error) {
        console.warn('⚠️ Could not test database connection:', error.message);
    }
}

// Initialize when this module loads
initializeSupabase();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = supabase;
}

// Also make available globally for browser usage
if (typeof window !== 'undefined') {
    window.initializeSupabase = initializeSupabase;
    console.log('✅ Supabase client module loaded and available globally');
}

console.log('🔄 Supabase client module loaded');
