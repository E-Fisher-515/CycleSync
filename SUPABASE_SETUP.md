# 🗄️ **FISH-19: Supabase Database Setup Guide**

## 🎯 **What You Need to Do:**

### **Step 1: Get Your Supabase Credentials**

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard
2. **Select your CycleSync project**
3. **Go to Settings → API**
4. **Copy these values**:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - **Keep this secret!**

### **Step 2: Update Configuration File**

**Edit `config.js`** and replace the placeholder values:

```javascript
const config = {
    supabase: {
        url: 'https://YOUR_ACTUAL_PROJECT_ID.supabase.co',        // Your project URL
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',   // Your anon key
        serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Your service role key
    },
    // ... rest of config
};
```

### **Step 3: Create Database Tables**

1. **In Supabase dashboard, go to SQL Editor**
2. **Copy the entire contents of `database/schema.sql`**
3. **Paste it in the SQL Editor and click "Run"**
4. **This will create all the necessary tables and sample data**

### **Step 4: Test the Connection**

1. **Refresh your CycleSync app**
2. **Open browser console (F12)**
3. **Look for these messages**:
   - ✅ `CycleSync configuration loaded globally`
   - ✅ `Supabase client initialized successfully`
   - 🧪 `Starting database connection tests...`

## 🔧 **Database Schema Overview**

The schema creates these tables:

- **`users`** - User accounts (future authentication)
- **`cycles`** - Period tracking data
- **`fasting_sessions`** - Fasting timer data
- **`calorie_entries`** - Calorie tracking data
- **`symptom_entries`** - Symptom and mood tracking
- **`user_preferences`** - User settings and preferences

## 🚨 **Important Security Notes**

- **anon key** is safe to expose (used in browser)
- **service_role key** should NEVER be exposed (server-side only)
- **Row Level Security (RLS)** is enabled but currently wide-open for development
- **Change RLS policies** before going to production

## 🧪 **Testing Your Setup**

After setup, you should see:
- Sample user: `test@cyclesync.com`
- Sample cycle data (2 periods)
- Sample fasting sessions
- Sample calorie entries
- Sample symptom data

## 🔍 **Troubleshooting**

**If you see warnings:**
- Check that `config.js` is loaded before other scripts
- Verify your Supabase credentials are correct
- Ensure the database schema was created successfully
- Check browser console for specific error messages

**Common issues:**
- CORS errors: Check Supabase project settings
- Authentication errors: Verify your API keys
- Table not found: Run the schema.sql file

## 📱 **Next Steps**

Once connected:
1. **Test data persistence** (data should save to Supabase instead of localStorage)
2. **Implement user authentication** (future task)
3. **Add real-time features** (live updates across devices)
4. **Deploy to production** with proper security policies

---

**Need help?** Check the browser console for detailed error messages and ensure all files are loaded in the correct order.
