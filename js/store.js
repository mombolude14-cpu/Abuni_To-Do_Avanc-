/**
 * Store Module - Handles LocalStorage persistence
 */
const Store = {
    // Keys for LocalStorage
    KEYS: {
        TASKS: 'taskflow_tasks',
        CATEGORIES: 'taskflow_categories',
        THEME: 'taskflow_theme',
        SETTINGS: 'taskflow_settings'
    },

    /**
     * Get tasks from storage
     */
    getTasks() {
        const tasksStr = localStorage.getItem(this.KEYS.TASKS);
        const tasks = tasksStr ? JSON.parse(tasksStr) : [];
        
        if (tasks && tasks.length > 0) return tasks;

        // Default tasks if empty or first time
        const today = new Date().toISOString().split('T')[0];
        return [
            {
                id: 'task-def-1',
                title: 'Bienvenue sur abuni To-Do ! 🚀',
                description: 'Ceci est votre première tâche. Explorez les fonctionnalités comme les catégories et les priorités.',
                priority: 'medium',
                category: 'Travail',
                completed: false,
                dueDate: today,
                createdAt: Date.now()
            },
            {
                id: 'task-def-2',
                title: 'Finaliser mon portfolio professionnel 💼',
                description: 'Ajouter le lien vers cette superbe application To-Do.',
                priority: 'high',
                category: 'Travail',
                completed: false,
                dueDate: today,
                createdAt: Date.now() - 1000
            },
            {
                id: 'task-def-3',
                title: 'Apprendre une nouvelle technologie 🧠',
                description: 'Lire la documentation de Lucide Icons ou explorer le Vanilla JS.',
                priority: 'medium',
                category: 'Personnel',
                completed: false,
                dueDate: '',
                createdAt: Date.now() - 2000
            },
            {
                id: 'task-def-4',
                title: 'Faire une séance de sport 🏃‍♂️',
                description: '30 minutes de marche ou de fitness pour rester en forme.',
                priority: 'low',
                category: 'Personnel',
                completed: false,
                dueDate: today,
                createdAt: Date.now() - 3000
            },
            {
                id: 'task-def-5',
                title: 'Sauvegarder mes données abuni 💾',
                description: 'Utiliser l\'onglet Paramètres pour exporter mes tâches.',
                priority: 'high',
                category: 'Urgent',
                completed: false,
                dueDate: '',
                createdAt: Date.now() - 4000
            }
        ];
    },

    /**
     * Save tasks to storage
     */
    saveTasks(tasks) {
        localStorage.setItem(this.KEYS.TASKS, JSON.stringify(tasks));
    },

    /**
     * Get categories from storage
     */
    getCategories() {
        const categories = localStorage.getItem(this.KEYS.CATEGORIES);
        const defaultCategories = [
            { id: 'cat-1', name: 'Travail', color: '#4F46E5' },
            { id: 'cat-2', name: 'Personnel', color: '#22C55E' },
            { id: 'cat-3', name: 'Urgent', color: '#EF4444' }
        ];
        return categories ? JSON.parse(categories) : defaultCategories;
    },

    /**
     * Save categories to storage
     */
    saveCategories(categories) {
        localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
    },

    /**
     * Get theme setting
     */
    getTheme() {
        return localStorage.getItem(this.KEYS.THEME) || 'light';
    },

    /**
     * Save theme setting
     */
    saveTheme(theme) {
        localStorage.setItem(this.KEYS.THEME, theme);
    },

    /**
     * Get general settings
     */
    getSettings() {
        const settings = localStorage.getItem(this.KEYS.SETTINGS);
        const defaultSettings = {
            userName: 'Utilisateur',
            confirmDelete: true,
            compactView: false,
            autoDeleteCompleted: false,
            language: 'fr'
        };
        return settings ? JSON.parse(settings) : defaultSettings;
    },

    /**
     * Save general settings
     */
    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    /**
     * Clear all data
     */
    clearAllData() {
        localStorage.removeItem(this.KEYS.TASKS);
        localStorage.removeItem(this.KEYS.CATEGORIES);
        localStorage.removeItem(this.KEYS.SETTINGS);
        localStorage.removeItem(this.KEYS.THEME);
    }
};

// Export for use in other files (though we use global for vanilla JS simplicity)
window.Store = Store;
