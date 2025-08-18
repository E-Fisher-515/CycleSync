/**
 * CycleSync - Configuration File
 * FISH-19: Connect Supabase DB
 * 
 * IMPORTANT: Replace the placeholder values with your actual Supabase credentials
 * You can find these in your Supabase project dashboard under Settings > API
 */

const config = {
    // Supabase Configuration
    supabase: {
        url: 'https://oqrkjnlnlvsvbvicoqwj.supabase.co',        // Replace with your project URL
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcmtqbmxubHZzdmJ2aWNvcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NDg3NTAsImV4cCI6MjA3MTEyNDc1MH0.GVkDv-megC1L6XnjANhYo9bcGs50prb5dErvlVgyDW4',      // Replace with your anon/public key
    },
    
    // App Configuration
    app: {
        name: 'CycleSync',
        version: '1.0.0',
        environment: 'development' // Change to 'production' when deploying
    },
    
    // Database Configuration
    database: {
        tables: {
            users: 'users',
            cycles: 'cycles',
            fastingSessions: 'fasting_sessions',
            calorieEntries: 'calorie_entries',
            symptomEntries: 'symptom_entries',
            userPreferences: 'user_preferences'
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.CycleSyncConfig = config;
    console.log('✅ CycleSync configuration loaded globally');
}

console.log('🔄 CycleSync configuration module loaded');
