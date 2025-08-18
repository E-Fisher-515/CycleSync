/**
 * CycleSync - Database Connection Test
 * FISH-19: Connect Supabase DB
 * 
 * This script tests the Supabase connection and displays sample data
 * Run this after setting up your credentials to verify everything works
 */

class DatabaseTester {
    constructor() {
        this.testResults = [];
        this.initializeSupabase();
    }

    initializeSupabase() {
        // Wait for Supabase to be available
        if (window.supabase && typeof window.supabase.from === 'function') {
            this.supabase = window.supabase;
            console.log('✅ Database tester connected to Supabase client');
        } else {
            console.warn('⚠️ Supabase client not ready yet, waiting...');
            // Wait a bit and try again
            setTimeout(() => this.initializeSupabase(), 1000);
        }
    }

    async runAllTests() {
        console.log('🧪 Starting database connection tests...');
        
        // Wait for Supabase to be ready
        if (!this.supabase || typeof this.supabase.from !== 'function') {
            console.log('⏳ Waiting for Supabase client to be ready...');
            setTimeout(() => this.runAllTests(), 1000);
            return;
        }

        try {
            // Test 1: Basic connection
            await this.testConnection();
            
            // Test 2: Check tables exist
            await this.testTablesExist();
            
            // Test 3: Query sample data
            await this.testSampleData();
            
            // Test 4: Test insert/update (read-only for now)
            await this.testDataOperations();
            
            this.displayResults();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testConnection() {
        try {
            console.log('🔍 Testing basic connection...');
            const { data, error } = await this.supabase
                .from('users')
                .select('count')
                .limit(1);
                
            if (error) {
                // This is expected if tables don't exist yet
                if (error.message.includes('relation "users" does not exist')) {
                    this.testResults.push({
                        test: 'Database Connection',
                        status: '⚠️ PARTIAL',
                        details: 'Connected to Supabase but tables not created yet'
                    });
                } else {
                    throw error;
                }
            } else {
                this.testResults.push({
                    test: 'Database Connection',
                    status: '✅ PASSED',
                    details: 'Successfully connected to Supabase'
                });
            }
            
        } catch (error) {
            this.testResults.push({
                test: 'Database Connection',
                status: '❌ FAILED',
                details: error.message
            });
        }
    }

    async testTablesExist() {
        const requiredTables = ['users', 'cycles', 'fasting_sessions', 'calorie_entries', 'symptom_entries', 'user_preferences'];
        const existingTables = [];
        
        for (const table of requiredTables) {
            try {
                const { data, error } = await this.supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                    
                if (!error) {
                    existingTables.push(table);
                }
            } catch (error) {
                // Table doesn't exist or error
            }
        }
        
        if (existingTables.length === requiredTables.length) {
            this.testResults.push({
                test: 'Table Structure',
                status: '✅ PASSED',
                details: `All ${existingTables.length} tables exist`
            });
        } else {
            this.testResults.push({
                test: 'Table Structure',
                status: '❌ FAILED',
                details: `Only ${existingTables.length}/${requiredTables.length} tables exist. Missing: ${requiredTables.filter(t => !existingTables.includes(t)).join(', ')}`
            });
        }
    }

    async testSampleData() {
        try {
            // Test users table
            const { data: users, error: usersError } = await this.supabase
                .from('users')
                .select('*')
                .limit(5);
                
            // Test cycles table
            const { data: cycles, error: cyclesError } = await this.supabase
                .from('cycles')
                .select('*')
                .limit(5);
                
            if (!usersError && !cyclesError) {
                this.testResults.push({
                    test: 'Sample Data',
                    status: '✅ PASSED',
                    details: `Found ${users.length} users and ${cycles.length} cycles`
                });
                
                // Display sample data
                if (users.length > 0) {
                    console.log('👥 Sample Users:', users);
                }
                if (cycles.length > 0) {
                    console.log('🔄 Sample Cycles:', cycles);
                }
            } else {
                throw new Error('Failed to query sample data');
            }
            
        } catch (error) {
            this.testResults.push({
                test: 'Sample Data',
                status: '❌ FAILED',
                details: error.message
            });
        }
    }

    async testDataOperations() {
        try {
            // Test a simple select operation
            const { data, error } = await this.supabase
                .from('users')
                .select('email')
                .limit(1);
                
            if (!error) {
                this.testResults.push({
                    test: 'Data Operations',
                    status: '✅ PASSED',
                    details: 'Basic read operations working'
                });
            } else {
                throw error;
            }
            
        } catch (error) {
            this.testResults.push({
                test: 'Data Operations',
                status: '❌ FAILED',
                details: error.message
            });
        }
    }

    displayResults() {
        console.log('\n📊 === DATABASE TEST RESULTS ===');
        this.testResults.forEach(result => {
            console.log(`${result.status} ${result.test}: ${result.details}`);
        });
        
        const passedTests = this.testResults.filter(r => r.status.includes('PASSED')).length;
        const totalTests = this.testResults.length;
        
        console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed! Your Supabase connection is working perfectly.');
        } else {
            console.log('⚠️ Some tests failed. Check the details above and your configuration.');
            
            // Check if tables are missing
            const tableTest = this.testResults.find(r => r.test === 'Table Structure');
            if (tableTest && tableTest.status === '❌ FAILED') {
                console.log('\n🗄️ NEXT STEP: You need to create the database tables!');
                console.log('1. Go to your Supabase dashboard');
                console.log('2. Go to SQL Editor');
                console.log('3. Copy and run the contents of database/schema.sql');
            }
        }
        
        console.log('================================\n');
    }
}

// Initialize tester when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Supabase to initialize
    setTimeout(() => {
        if (window.supabase && typeof window.supabase.from === 'function') {
            window.databaseTester = new DatabaseTester();
            window.databaseTester.runAllTests();
        } else {
            console.warn('⚠️ Supabase not ready yet. Waiting for initialization...');
            // Try again in a bit
            setTimeout(() => {
                if (window.supabase && typeof window.supabase.from === 'function') {
                    window.databaseTester = new DatabaseTester();
                    window.databaseTester.runAllTests();
                } else {
                    console.error('❌ Supabase client failed to initialize properly');
                }
            }, 3000);
        }
    }, 2000);
});

// Make available globally for manual testing
window.DatabaseTester = DatabaseTester;
console.log('🔄 Database tester loaded. Use window.databaseTester.runAllTests() to test manually.');
