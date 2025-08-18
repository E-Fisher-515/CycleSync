/**
 * CycleSync - Cycle Tracking Core Engine
 * FISH-11: Cycle Tracking Core Engine
 * 
 * Handles:
 * - Cycle data model and storage
 * - Period logging functionality
 * - Cycle phase calculations
 * - Calendar visualization
 * - Cycle length predictions
 */

console.log('🔄 CycleTracker script loading...');

class CycleTracker {
    constructor() {
        console.log('🔄 CycleTracker constructor called');
        this.cycles = [];
        this.currentDate = new Date();
        this.displayDate = new Date();
        this.averageCycleLength = 28; // Default, will be calculated from data
        
        this.init();
    }

    init() {
        console.log('🔄 CycleTracker init() called');
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.renderCalendar();
        console.log('✅ CycleTracker initialized successfully');
    }

    setupEventListeners() {
        console.log('🔄 Setting up cycle tracker event listeners...');
        
        // Period logging
        const logPeriodBtn = document.getElementById('logPeriodBtn');
        const closePeriodModal = document.getElementById('closePeriodModal');
        const cancelPeriod = document.getElementById('cancelPeriod');
        const savePeriod = document.getElementById('savePeriod');
        const periodModal = document.getElementById('periodModal');

        console.log('🔍 Found elements:', {
            logPeriodBtn: !!logPeriodBtn,
            closePeriodModal: !!closePeriodModal,
            cancelPeriod: !!cancelPeriod,
            savePeriod: !!savePeriod,
            periodModal: !!periodModal
        });

        if (logPeriodBtn && !logPeriodBtn.hasAttribute('data-listener-attached')) {
            logPeriodBtn.addEventListener('click', () => {
                console.log('🔄 Log period button clicked!');
                this.openPeriodModal();
            });
            logPeriodBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ Log period button event listener attached');
        } else if (logPeriodBtn) {
            console.log('⚠️ Log period button already has listener');
        } else {
            console.warn('❌ Log period button not found - this will break functionality!');
        }
        
        if (closePeriodModal && !closePeriodModal.hasAttribute('data-listener-attached')) {
            closePeriodModal.addEventListener('click', () => this.closePeriodModal());
            closePeriodModal.setAttribute('data-listener-attached', 'true');
            console.log('✅ Close modal button event listener attached');
        }
        if (cancelPeriod && !cancelPeriod.hasAttribute('data-listener-attached')) {
            cancelPeriod.addEventListener('click', () => this.closePeriodModal());
            cancelPeriod.setAttribute('data-listener-attached', 'true');
            console.log('✅ Cancel button event listener attached');
        }
        if (savePeriod && !savePeriod.hasAttribute('data-listener-attached')) {
            savePeriod.addEventListener('click', () => this.savePeriod());
            savePeriod.setAttribute('data-listener-attached', 'true');
            console.log('✅ Save period button event listener attached');
        }

        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');

        if (prevMonth && !prevMonth.hasAttribute('data-listener-attached')) {
            prevMonth.addEventListener('click', () => this.previousMonth());
            prevMonth.setAttribute('data-listener-attached', 'true');
            console.log('✅ Previous month button event listener attached');
        }
        if (nextMonth && !nextMonth.hasAttribute('data-listener-attached')) {
            nextMonth.addEventListener('click', () => this.nextMonth());
            nextMonth.setAttribute('data-listener-attached', 'true');
            console.log('✅ Next month button event listener attached');
        }

        // Close modal when clicking outside
        if (periodModal && !periodModal.hasAttribute('data-listener-attached')) {
            periodModal.addEventListener('click', (e) => {
                if (e.target === periodModal) {
                    this.closePeriodModal();
                }
            });
            periodModal.setAttribute('data-listener-attached', 'true');
            console.log('✅ Modal outside click event listener attached');
        }

        // Set default date to today
        const periodDateInput = document.getElementById('periodDate');
        if (periodDateInput) {
            const today = new Date().toISOString().split('T')[0];
            periodDateInput.value = today;
            console.log('✅ Set default date to today:', today);
        } else {
            console.warn('❌ Period date input not found');
        }

        // Add view history functionality
        const viewHistoryBtn = document.getElementById('viewHistoryBtn');
        if (viewHistoryBtn && !viewHistoryBtn.hasAttribute('data-listener-attached')) {
            viewHistoryBtn.addEventListener('click', () => this.showHistory());
            viewHistoryBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ View history button event listener attached');
        } else if (viewHistoryBtn) {
            console.log('⚠️ View history button already has listener');
        } else {
            console.warn('❌ View history button not found');
        }

        // Add clear data functionality
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn && !clearDataBtn.hasAttribute('data-listener-attached')) {
            clearDataBtn.addEventListener('click', () => this.clearData());
            clearDataBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ Clear data button event listener attached');
        } else {
            console.warn('❌ Clear data button not found');
        }

        // Add manage data functionality
        const manageDataBtn = document.getElementById('manageDataBtn');
        if (manageDataBtn && !manageDataBtn.hasAttribute('data-listener-attached')) {
            manageDataBtn.addEventListener('click', () => this.showDataManagement());
            manageDataBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ Manage data button event listener attached');
        } else {
            console.warn('❌ Manage data button not found');
        }

        // Add export data functionality
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn && !exportDataBtn.hasAttribute('data-listener-attached')) {
            exportDataBtn.addEventListener('click', () => this.exportData());
            exportDataBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ Export data button event listener attached');
        } else {
            console.warn('❌ Export data button not found');
        }

        // Add debug data functionality
        const debugDataBtn = document.getElementById('debugDataBtn');
        if (debugDataBtn && !debugDataBtn.hasAttribute('data-listener-attached')) {
            debugDataBtn.addEventListener('click', () => this.debugData());
            debugDataBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ Debug data button event listener attached');
        } else {
            console.warn('❌ Debug data button not found');
        }

        // Data management modal events
        const closeDataModal = document.getElementById('closeDataModal');
        const closeDataManagement = document.getElementById('closeDataManagement');
        const dataManagementModal = document.getElementById('dataManagementModal');

        if (closeDataModal && !closeDataModal.hasAttribute('data-listener-attached')) {
            closeDataModal.addEventListener('click', () => this.closeDataManagement());
            closeDataModal.setAttribute('data-listener-attached', 'true');
        }

        if (closeDataManagement && !closeDataManagement.hasAttribute('data-listener-attached')) {
            closeDataManagement.addEventListener('click', () => this.closeDataManagement());
            closeDataManagement.setAttribute('data-listener-attached', 'true');
        }

        if (dataManagementModal && !dataManagementModal.hasAttribute('data-listener-attached')) {
            dataManagementModal.addEventListener('click', (e) => {
                if (e.target === dataManagementModal) {
                    this.closeDataManagement();
                }
            });
            dataManagementModal.setAttribute('data-listener-attached', 'true');
        }

        // Sync data from database
        const syncDataBtn = document.getElementById('syncDataBtn');
        if (syncDataBtn && !syncDataBtn.hasAttribute('data-listener-attached')) {
            syncDataBtn.addEventListener('click', () => this.syncFromDatabase());
            syncDataBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ Sync data button event listener attached');
        } else {
            console.warn('❌ Sync data button not found');
        }

        const checkConsistencyBtn = document.getElementById('checkConsistencyBtn');
        if (checkConsistencyBtn && !checkConsistencyBtn.hasAttribute('data-listener-attached')) {
            checkConsistencyBtn.addEventListener('click', () => this.checkDataConsistency());
            checkConsistencyBtn.setAttribute('data-listener-attached', 'true');
            console.log('✅ Check consistency button event listener attached');
        } else {
            console.warn('❌ Check consistency button not found');
        }

        console.log('✅ Cycle tracker event listeners setup complete');
    }

    // Data Management
    loadData() {
        // Try to load from database first, with retry mechanism
        this.loadFromDatabaseWithRetry().then(() => {
            // Fallback to localStorage if database fails
            if (this.cycles.length === 0) {
                this.loadFromLocalStorage();
            }
            this.calculateAverageCycleLength();
        });
    }

    async loadFromDatabaseWithRetry(maxRetries = 5, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`🔄 Attempt ${attempt}/${maxRetries} to load from database...`);
            
            if (window.supabase && typeof window.supabase.from === 'function') {
                console.log('✅ Supabase client is ready, proceeding with database load');
                return await this.loadFromDatabase();
            }
            
            console.log(`⏳ Supabase not ready yet, waiting ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        console.warn('⚠️ Supabase client never became ready, using localStorage');
        return false;
    }

    async loadFromDatabase() {
        console.log('🔍 Debug: Starting loadFromDatabase...');
        console.log('🔍 Debug: window.supabase exists?', !!window.supabase);
        console.log('🔍 Debug: window.supabase.from exists?', !!(window.supabase && window.supabase.from));
        
        if (!window.supabase || typeof window.supabase.from !== 'function') {
            console.warn('⚠️ Supabase not available, will use localStorage');
            console.log('🔍 Debug: Supabase client details:', {
                exists: !!window.supabase,
                type: typeof window.supabase,
                hasFrom: !!(window.supabase && window.supabase.from),
                methods: window.supabase ? Object.getOwnPropertyNames(window.supabase) : 'none'
            });
            return;
        }

        try {
            console.log('📥 Loading cycles from database...');
            
            // Get the test user ID
            const { data: users, error: userError } = await window.supabase
                .from('users')
                .select('id')
                .limit(1);
                
            if (userError || !users || users.length === 0) {
                console.error('❌ Could not get user ID:', userError);
                return;
            }
            
            const userId = users[0].id;
            console.log('👤 Debug: Got user ID:', userId);
            
            // Load cycles for this user
            const { data: cycles, error } = await window.supabase
                .from('cycles')
                .select('*')
                .eq('user_id', userId)
                .order('start_date', { ascending: true });
                
            if (error) {
                console.error('❌ Failed to load cycles from database:', error);
                return;
            }
            
            console.log('🔍 Debug: Database response:', { cycles, error });
            
            if (cycles && cycles.length > 0) {
                // Convert database format to app format
                this.cycles = cycles.map(cycle => ({
                    startDate: cycle.start_date + 'T00:00:00.000Z', // Convert to ISO string
                    flow: cycle.flow_intensity,
                    notes: cycle.notes || '',
                    symptoms: cycle.symptoms || {},
                    timestamp: cycle.created_at
                }));
                
                console.log('✅ Loaded', this.cycles.length, 'cycles from database');
            } else {
                console.log('ℹ️ No cycles found in database');
            }
            
        } catch (error) {
            console.error('❌ Error loading from database:', error);
        }
    }

    loadFromLocalStorage() {
        const savedCycles = localStorage.getItem('cyclesync_cycles');
        if (savedCycles) {
            this.cycles = JSON.parse(savedCycles);
            console.log('📥 Loaded', this.cycles.length, 'cycles from localStorage');
        }
    }

    saveData() {
        // Save to localStorage for backup
        localStorage.setItem('cyclesync_cycles', JSON.stringify(this.cycles));
        
        // Save to Supabase database with retry
        this.saveToDatabaseWithRetry();
        
        this.calculateAverageCycleLength();
    }

    async saveToDatabaseWithRetry(maxRetries = 3, delay = 500) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            if (window.supabase && typeof window.supabase.from === 'function') {
                console.log('✅ Supabase client is ready, proceeding with database save');
                return await this.saveToDatabase();
            }
            
            console.log(`⏳ Supabase not ready for save, waiting ${delay}ms... (attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        console.warn('⚠️ Supabase client never became ready for save, data only in localStorage');
    }

    async saveToDatabase() {
        if (!window.supabase || typeof window.supabase.from !== 'function') {
            console.warn('⚠️ Supabase not available, using localStorage only');
            return;
        }

        try {
            console.log('💾 Saving cycles to database...');
            
            // Get the test user ID (for now, we'll use the first user)
            const { data: users, error: userError } = await window.supabase
                .from('users')
                .select('id')
                .limit(1);
                
            if (userError || !users || users.length === 0) {
                console.error('❌ Could not get user ID:', userError);
                return;
            }
            
            const userId = users[0].id;
            console.log('👤 Using user ID:', userId);
            
            // Clear existing cycles for this user
            const { error: deleteError } = await window.supabase
                .from('cycles')
                .delete()
                .eq('user_id', userId);
                
            if (deleteError) {
                console.warn('⚠️ Could not clear existing cycles:', deleteError);
            }
            
            // Insert new cycles
            const cyclesToInsert = this.cycles.map(cycle => ({
                user_id: userId,
                start_date: cycle.startDate.split('T')[0], // Extract just the date part
                flow_intensity: cycle.flow,
                notes: cycle.notes || null,
                symptoms: cycle.symptoms || {}
            }));
            
            const { data, error } = await window.supabase
                .from('cycles')
                .insert(cyclesToInsert);
                
            if (error) {
                console.error('❌ Failed to save cycles to database:', error);
            } else {
                console.log('✅ Successfully saved', cyclesToInsert.length, 'cycles to database');
            }
            
        } catch (error) {
            console.error('❌ Error saving to database:', error);
        }
    }

    // Period Logging
    openPeriodModal() {
        const modal = document.getElementById('periodModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closePeriodModal() {
        const modal = document.getElementById('periodModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    savePeriod() {
        const dateInput = document.getElementById('periodDate');
        const flowSelect = document.getElementById('periodFlow');
        const notesTextarea = document.getElementById('periodNotes');

        if (!dateInput || !flowSelect) return;

        // Fix timezone issue by creating date in local timezone
        const inputDate = dateInput.value; // Format: YYYY-MM-DD
        const [year, month, day] = inputDate.split('-').map(Number);
        const periodDate = new Date(year, month - 1, day); // month is 0-indexed
        
        const flow = flowSelect.value;
        const notes = notesTextarea ? notesTextarea.value : '';

        console.log(`📅 Logging period for: ${periodDate.toDateString()}`);

        // Add new period
        this.cycles.push({
            startDate: periodDate.toISOString(),
            flow: flow,
            notes: notes,
            timestamp: new Date().toISOString()
        });

        // Sort cycles by date
        this.cycles.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        this.saveData();
        this.updateDisplay();
        this.renderCalendar();
        this.closePeriodModal();

        // Clear form
        if (notesTextarea) notesTextarea.value = '';
        if (flowSelect) flowSelect.selectedIndex = 1; // Reset to medium

        console.log('✅ Period logged successfully');
    }

    // Cycle Calculations
    calculateAverageCycleLength() {
        if (this.cycles.length < 2) {
            this.averageCycleLength = 28;
            return;
        }

        let totalDays = 0;
        let cycleCount = 0;

        for (let i = 1; i < this.cycles.length; i++) {
            const currentDate = new Date(this.cycles[i].startDate);
            const previousDate = new Date(this.cycles[i - 1].startDate);
            const daysDiff = Math.round((currentDate - previousDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff >= 20 && daysDiff <= 45) { // Reasonable cycle range
                totalDays += daysDiff;
                cycleCount++;
            }
        }

        if (cycleCount > 0) {
            this.averageCycleLength = Math.round(totalDays / cycleCount);
        }
    }

    getCurrentCycleInfo() {
        if (this.cycles.length === 0) {
            return {
                cycleDay: '--',
                phase: '--',
                nextPeriod: '--',
                phaseProgress: 0
            };
        }

        const lastPeriod = new Date(this.cycles[this.cycles.length - 1].startDate);
        const today = new Date();
        const daysSinceLastPeriod = Math.round((today - lastPeriod) / (1000 * 60 * 60 * 24));
        
        let cycleDay = daysSinceLastPeriod + 1;
        let phase = 'Unknown';
        let phaseProgress = 0;

        // Determine cycle phase
        if (cycleDay <= 7) {
            phase = 'Menstrual';
            phaseProgress = (cycleDay / 7) * 25;
        } else if (cycleDay <= 14) {
            phase = 'Follicular';
            phaseProgress = 25 + ((cycleDay - 7) / 7) * 25;
        } else if (cycleDay <= 16) {
            phase = 'Ovulation';
            phaseProgress = 50 + ((cycleDay - 14) / 2) * 25;
        } else if (cycleDay <= this.averageCycleLength) {
            phase = 'Luteal';
            phaseProgress = 75 + ((cycleDay - 16) / (this.averageCycleLength - 16)) * 25;
        } else {
            cycleDay = '--';
            phase = 'Overdue';
            phaseProgress = 100;
        }

        // Calculate next period
        const nextPeriodDate = new Date(lastPeriod);
        nextPeriodDate.setDate(lastPeriod.getDate() + this.averageCycleLength);
        const daysUntilNextPeriod = Math.round((nextPeriodDate - today) / (1000 * 60 * 60 * 24));
        
        let nextPeriod = '--';
        if (daysUntilNextPeriod > 0) {
            nextPeriod = `${daysUntilNextPeriod} days`;
        } else if (daysUntilNextPeriod === 0) {
            nextPeriod = 'Today';
        } else {
            nextPeriod = 'Overdue';
        }

        return {
            cycleDay: cycleDay === '--' ? '--' : cycleDay,
            phase: phase,
            nextPeriod: nextPeriod,
            phaseProgress: Math.min(100, Math.max(0, phaseProgress))
        };
    }

    // Calendar Rendering
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) {
            console.warn('⚠️ Calendar grid not found');
            return;
        }

        console.log('🔄 Rendering calendar...');
        
        const currentMonth = this.displayDate.getMonth();
        const currentYear = this.displayDate.getFullYear();
        
        // Clear existing calendar
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Generate calendar days
        for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();

            // Check if it's today
            const today = new Date();
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Check if it's in current month
            if (currentDate.getMonth() !== currentMonth) {
                dayElement.classList.add('other-month');
            }

            // Check if it's a period day
            if (this.isPeriodDay(currentDate)) {
                dayElement.classList.add('period');
                console.log(`🔴 Period day: ${currentDate.toDateString()}`);
            } else {
                // Add phase colors
                const phase = this.getPhaseForDate(currentDate);
                if (phase) {
                    dayElement.classList.add(phase.toLowerCase());
                    console.log(`🎨 Phase ${phase} for: ${currentDate.toDateString()} -> class: ${phase.toLowerCase()}`);
                } else {
                    console.log(`⚪ No phase for: ${currentDate.toDateString()}`);
                }
            }

            // Add click event for period logging
            dayElement.addEventListener('click', () => {
                this.selectDateForPeriod(currentDate);
            });

            calendarGrid.appendChild(dayElement);
        }

        // Update month display
        const monthDisplay = document.getElementById('currentMonth');
        if (monthDisplay) {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
            monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }

        console.log('✅ Calendar rendered successfully');
    }

    isPeriodDay(date) {
        return this.cycles.some(cycle => {
            const cycleDate = new Date(cycle.startDate);
            return cycleDate.toDateString() === date.toDateString();
        });
    }

    getPhaseForDate(date) {
        if (this.cycles.length === 0) return null;

        const lastPeriod = new Date(this.cycles[this.cycles.length - 1].startDate);
        const daysSinceLastPeriod = Math.round((date - lastPeriod) / (1000 * 60 * 60 * 24));
        
        console.log(`🔍 Phase calculation for ${date.toDateString()}: ${daysSinceLastPeriod} days since last period`);
        
        if (daysSinceLastPeriod < 0) return null;
        
        let phase = null;
        if (daysSinceLastPeriod <= 7) {
            phase = 'menstrual';
        } else if (daysSinceLastPeriod <= 14) {
            phase = 'ovulation';
        } else if (daysSinceLastPeriod <= 16) {
            phase = 'ovulation';
        } else if (daysSinceLastPeriod <= this.averageCycleLength) {
            phase = 'luteal';
        }
        
        if (phase) {
            console.log(`🎨 Phase ${phase} for ${date.toDateString()}`);
        }
        
        return phase;
    }

    selectDateForPeriod(date) {
        const dateInput = document.getElementById('periodDate');
        if (dateInput) {
            // Format date as YYYY-MM-DD for the input field
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            
            dateInput.value = formattedDate;
            console.log(`📅 Selected date for period: ${date.toDateString()} -> ${formattedDate}`);
            this.openPeriodModal();
        }
    }

    previousMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.displayDate.setMonth(this.displayDate.getMonth() + 1);
        this.renderCalendar();
    }

    // Display Updates
    updateDisplay() {
        const cycleInfo = this.getCurrentCycleInfo();
        
        // Update cycle stats
        const currentCycleDay = document.getElementById('currentCycleDay');
        const currentPhase = document.getElementById('currentPhase');
        const nextPeriod = document.getElementById('nextPeriod');
        const avgCycleLength = document.getElementById('avgCycleLength');
        const phaseProgress = document.getElementById('phaseProgress');
        const phaseDescription = document.getElementById('phaseDescription');

        if (currentCycleDay) currentCycleDay.textContent = cycleInfo.cycleDay;
        if (currentPhase) currentPhase.textContent = cycleInfo.phase;
        if (nextPeriod) nextPeriod.textContent = cycleInfo.nextPeriod;
        if (avgCycleLength) avgCycleLength.textContent = `${this.averageCycleLength} days`;
        if (phaseProgress) phaseProgress.style.width = `${cycleInfo.phaseProgress}%`;
        if (phaseDescription) {
            phaseDescription.textContent = this.getPhaseDescription(cycleInfo.phase);
        }

        // Update total periods count
        this.updateTotalPeriods();
    }

    // History Display
    showHistory() {
        // Force refresh data from localStorage to ensure we have the latest
        this.loadData();
        
        if (this.cycles.length === 0) {
            alert('No cycle history yet. Log your first period to get started!');
            return;
        }

        let historyText = 'Cycle History:\n\n';
        this.cycles.forEach((cycle, index) => {
            const date = new Date(cycle.startDate).toLocaleDateString();
            const flow = cycle.flow.charAt(0).toUpperCase() + cycle.flow.slice(1);
            const notes = cycle.notes ? ` - ${cycle.notes}` : '';
            historyText += `${index + 1}. ${date} (${flow} flow)${notes}\n`;
        });

        historyText += `\nAverage Cycle Length: ${this.averageCycleLength} days`;
        historyText += `\nTotal Periods: ${this.cycles.length}`;
        alert(historyText);
        console.log('📊 History displayed:', this.cycles);
    }

    // Debug method to help troubleshoot data issues
    debugData() {
        console.log('🔍 === DEBUG DATA ===');
        console.log('Memory cycles:', this.cycles);
        console.log('localStorage cycles:', localStorage.getItem('cyclesync_cycles'));
        console.log('Average cycle length:', this.averageCycleLength);
        console.log('Total periods:', this.cycles.length);
        
        if (this.cycles.length > 0) {
            console.log('First period:', this.cycles[0]);
            console.log('Last period:', this.cycles[this.cycles.length - 1]);
        }
        console.log('===================');
    }

    getPhaseDescription(phase) {
        const descriptions = {
            'Menstrual': 'Focus on rest and gentle movement. Iron-rich foods recommended.',
            'Follicular': 'Energy building phase. Great time for new projects and workouts.',
            'Ovulation': 'Peak performance time. High-intensity activities and social events.',
            'Luteal': 'Maintenance phase. Focus on consistency and self-care.',
            'Unknown': 'Track your cycle to see phase-specific insights.',
            'Overdue': 'Consider logging your period or consulting healthcare provider.'
        };
        return descriptions[phase] || descriptions['Unknown'];
    }

    // Utility Methods
    getCycles() {
        return this.cycles;
    }

    getCycleCount() {
        return this.cycles.length;
    }

    clearData() {
        if (confirm('Are you sure you want to clear all cycle data? This will only clear local data - your database records will be preserved for recovery.')) {
            // Clear localStorage only (preserve database as backup)
            localStorage.removeItem('cyclesync_cycles');
            this.cycles = [];
            this.averageCycleLength = 28;
            
            // Update display
            this.updateDisplay();
            this.renderCalendar();
            
            console.log('🗑️ Local data cleared (database records preserved)');
            alert('Local data cleared successfully! Your database records are preserved for recovery.');
        }
    }

    // Sync data from database
    async syncFromDatabase() {
        if (!window.supabase || typeof window.supabase.from !== 'function') {
            console.warn('⚠️ Supabase not available for sync');
            return;
        }

        try {
            console.log('🔄 Syncing data from database...');
            
            // Clear current localStorage data first to ensure clean sync
            localStorage.removeItem('cyclesync_cycles');
            this.cycles = [];
            
            // Load fresh data from database
            await this.loadFromDatabase();
            
            // If database load was successful, save to localStorage for consistency
            if (this.cycles.length > 0) {
                localStorage.setItem('cyclesync_cycles', JSON.stringify(this.cycles));
                console.log('✅ Data synced from database and localStorage updated');
            } else {
                console.log('ℹ️ No data found in database, localStorage cleared');
            }
            
            // Update display
            this.updateDisplay();
            this.renderCalendar();
            
        } catch (error) {
            console.error('❌ Failed to sync from database:', error);
            // If sync fails, try to restore from localStorage as fallback
            this.loadFromLocalStorage();
        }
    }

    // Enhanced data management
    showDataManagement() {
        const modal = document.getElementById('dataManagementModal');
        if (modal) {
            modal.classList.add('active');
            this.populatePeriodList();
        }
    }

    closeDataManagement() {
        const modal = document.getElementById('dataManagementModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    populatePeriodList() {
        const periodList = document.getElementById('periodList');
        if (!periodList) return;

        if (this.cycles.length === 0) {
            periodList.innerHTML = '<p style="text-align: center; color: var(--gray-500);">No period data to manage.</p>';
            return;
        }

        let html = '';
        this.cycles.forEach((cycle, index) => {
            const date = new Date(cycle.startDate).toLocaleDateString();
            const flow = cycle.flow.charAt(0).toUpperCase() + cycle.flow.slice(1);
            const notes = cycle.notes ? ` - ${cycle.notes}` : '';
            
            html += `
                <div class="period-entry">
                    <div class="period-info">
                        <div class="period-date">${date}</div>
                        <div class="period-details">${flow} flow${notes}</div>
                    </div>
                    <div class="period-actions">
                        <button class="btn-remove" onclick="window.cycleTracker.removePeriod(${index})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
        });

        periodList.innerHTML = html;
    }

    removePeriod(index) {
        if (confirm(`⚠️ Remove period from ${new Date(this.cycles[index].startDate).toLocaleDateString()}?`)) {
            this.cycles.splice(index, 1);
            this.saveData();
            this.updateDisplay();
            this.renderCalendar();
            this.updateTotalPeriods();
            this.populatePeriodList(); // Refresh the list
            console.log(`🗑️ Period removed at index ${index}`);
        }
    }

    exportData() {
        if (this.cycles.length === 0) {
            alert('No data to export.');
            return;
        }

        const exportData = {
            exportDate: new Date().toISOString(),
            totalPeriods: this.cycles.length,
            averageCycleLength: this.averageCycleLength,
            periods: this.cycles
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `cyclesync-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('📤 Data exported successfully');
    }

    updateTotalPeriods() {
        const totalPeriodsElement = document.getElementById('totalPeriods');
        if (totalPeriodsElement) {
            totalPeriodsElement.textContent = this.cycles.length;
        }
    }

    // Check data consistency between localStorage and database
    async checkDataConsistency() {
        console.log('🔍 Checking data consistency...');
        
        // Get localStorage data
        const localData = localStorage.getItem('cyclesync_cycles');
        const localCycles = localData ? JSON.parse(localData) : [];
        
        console.log('📱 localStorage cycles:', localCycles.length);
        
        // Get database data
        if (window.supabase && typeof window.supabase.from === 'function') {
            try {
                const { data: users, error: userError } = await window.supabase
                    .from('users')
                    .select('id')
                    .limit(1);
                    
                if (!userError && users && users.length > 0) {
                    const userId = users[0].id;
                    const { data: dbCycles, error } = await window.supabase
                        .from('cycles')
                        .select('*')
                        .eq('user_id', userId)
                        .order('start_date', { ascending: true });
                        
                    if (!error) {
                        console.log('🗄️ Database cycles:', dbCycles.length);
                        
                        if (localCycles.length !== dbCycles.length) {
                            console.warn('⚠️ Data inconsistency detected!');
                            console.warn(`   localStorage: ${localCycles.length} cycles`);
                            console.warn(`   Database: ${dbCycles.length} cycles`);
                            return false;
                        } else {
                            console.log('✅ Data consistency check passed');
                            return true;
                        }
                    }
                }
            } catch (error) {
                console.error('❌ Error checking database consistency:', error);
            }
        }
        
        return null; // Couldn't check
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure all elements are ready
    setTimeout(() => {
        try {
            window.cycleTracker = new CycleTracker();
            console.log('✅ CycleTracker initialized and ready');
        } catch (error) {
            console.error('❌ Failed to initialize CycleTracker:', error);
        }
    }, 500); // Wait 500ms for all elements to be ready
});

// Also try to initialize on window load as backup
window.addEventListener('load', () => {
    if (!window.cycleTracker) {
        setTimeout(() => {
            try {
                window.cycleTracker = new CycleTracker();
                console.log('✅ CycleTracker initialized on window load');
            } catch (error) {
                console.error('❌ Failed to initialize CycleTracker on window load:', error);
            }
        }, 1000);
    }
});

// Make CycleTracker available globally
window.CycleTracker = CycleTracker;
