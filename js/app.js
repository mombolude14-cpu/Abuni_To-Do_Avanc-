/**
 * Main Application Module
 */
const App = {
    state: {
        tasks: [],
        categories: [],
        filter: 'all', // all, today, completed
        categoryFilter: 'all',
        searchQuery: '',
        sortBy: 'createdAt-desc',
        theme: 'light',
        settings: {}
    },

    /**
     * Initialize the application
     */
    init() {
        console.log('TaskFlow initializing...');
        
        // Load data from storage
        this.state.tasks = Store.getTasks();
        this.state.categories = Store.getCategories();
        this.state.theme = Store.getTheme();
        this.state.settings = Store.getSettings();

        // Setup UI
        UI.setTheme(this.state.theme);
        UI.updateLanguage(this.state.settings.language || 'fr');
        UI.renderCategories(this.state.categories, this.state.categoryFilter);
        this.applySettings();
        this.refreshTasks();
        
        // Setup Event Listeners
        this.setupEventListeners();
        
        console.log('TaskFlow ready!');
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Modal toggles
        document.getElementById('open-modal-btn').addEventListener('click', () => UI.toggleTaskModal(true));
        document.getElementById('close-modal-btn').addEventListener('click', () => UI.toggleTaskModal(false));
        document.getElementById('cancel-modal-btn').addEventListener('click', () => UI.toggleTaskModal(false));
        
        document.getElementById('add-category-btn').addEventListener('click', () => UI.toggleCategoryModal(true));
        document.getElementById('close-cat-modal-btn').addEventListener('click', () => UI.toggleCategoryModal(false));
        document.getElementById('cancel-cat-btn').addEventListener('click', () => UI.toggleCategoryModal(false));

        // Help Modal
        document.getElementById('help-btn').addEventListener('click', () => UI.toggleHelpModal(true));
        document.getElementById('close-help-modal-btn').addEventListener('click', () => UI.toggleHelpModal(false));
        document.getElementById('close-help-btn').addEventListener('click', () => UI.toggleHelpModal(false));

        document.getElementById('settings-btn').addEventListener('click', () => {
            UI.fillSettingsForm(this.state.settings);
            UI.toggleSettingsModal(true);
        });
        document.getElementById('close-settings-modal-btn').addEventListener('click', () => UI.toggleSettingsModal(false));
        document.getElementById('close-settings-btn').addEventListener('click', () => UI.toggleSettingsModal(false));
        
        document.getElementById('save-settings-btn').addEventListener('click', () => this.handleSaveSettings());

        document.getElementById('export-data-btn').addEventListener('click', () => this.handleExportData());
        document.getElementById('import-data-btn').addEventListener('click', () => document.getElementById('import-file').click());
        document.getElementById('import-file').addEventListener('change', (e) => this.handleImportData(e));
        
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            if (confirm('ATTENTION: Voulez-vous vraiment réinitialiser l\'application ? Toutes vos tâches et catégories seront supprimées.')) {
                Store.clearAllData();
                window.location.reload();
            }
        });

        // Forms
        document.getElementById('task-form').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        document.getElementById('category-form').addEventListener('submit', (e) => this.handleCategorySubmit(e));

        // Sidebar filters
        document.querySelectorAll('.nav-item[data-filter]').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.state.filter = item.dataset.filter;
                this.state.categoryFilter = 'all';
                UI.elements.viewTitle.textContent = item.querySelector('span').textContent;
                this.refreshTasks();
            });
        });

        // Search
        UI.elements.searchInput.addEventListener('input', (e) => {
            this.state.searchQuery = e.target.value;
            this.refreshTasks();
        });

        // Sorting
        UI.elements.sortSelect.addEventListener('change', (e) => {
            this.state.sortBy = e.target.value;
            this.refreshTasks();
        });

        // Theme Toggle (Light -> Dark -> Blue -> Light)
        document.getElementById('theme-toggle').addEventListener('click', () => {
            if (this.state.theme === 'light') {
                this.state.theme = 'dark';
            } else if (this.state.theme === 'dark') {
                this.state.theme = 'blue';
            } else {
                this.state.theme = 'light';
            }
            Store.saveTheme(this.state.theme);
            UI.setTheme(this.state.theme);
        });

        // Mobile Menu
        document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
            UI.elements.sidebar.classList.add('active');
        });
        document.getElementById('close-sidebar').addEventListener('click', () => {
            UI.elements.sidebar.classList.remove('active');
        });

        // Drag and Drop reordering
        UI.elements.taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            const siblings = [...UI.elements.taskList.querySelectorAll('.task-card:not(.dragging)')];
            
            const nextSibling = siblings.find(sibling => {
                return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
            });
            
            UI.elements.taskList.insertBefore(draggingItem, nextSibling);
        });

        UI.elements.taskList.addEventListener('drop', () => {
            // Save new order
            const taskCards = [...UI.elements.taskList.querySelectorAll('.task-card')];
            const newTasks = taskCards.map(card => {
                return this.state.tasks.find(t => t.id === card.dataset.id);
            });
            this.state.tasks = newTasks;
            Store.saveTasks(this.state.tasks);
        });
    },

    /**
     * Handle task form submission (Add/Edit)
     */
    handleTaskSubmit(e) {
        e.preventDefault();
        const taskId = document.getElementById('task-id').value;
        const formData = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-desc').value,
            priority: document.getElementById('task-priority').value,
            category: document.getElementById('task-category').value,
            dueDate: document.getElementById('task-date').value
        };

        if (taskId) {
            // Edit existing
            const index = this.state.tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.state.tasks[index] = { ...this.state.tasks[index], ...formData };
            }
        } else {
            // Add new
            const newTask = Tasks.createTask(formData);
            this.state.tasks.unshift(newTask);
        }

        Store.saveTasks(this.state.tasks);
        UI.toggleTaskModal(false);
        this.refreshTasks();
    },

    /**
     * Handle category form submission
     */
    handleCategorySubmit(e) {
        e.preventDefault();
        const name = document.getElementById('cat-name').value;
        const color = document.getElementById('cat-color').value;

        const newCategory = {
            id: 'cat-' + Date.now(),
            name: name,
            color: color
        };

        this.state.categories.push(newCategory);
        Store.saveCategories(this.state.categories);
        UI.toggleCategoryModal(false);
        UI.renderCategories(this.state.categories, this.state.categoryFilter);
    },

    /**
     * Handle filtering by category
     */
    handleCategoryFilter(categoryName) {
        this.state.categoryFilter = categoryName;
        this.state.filter = 'all';
        UI.elements.viewTitle.textContent = categoryName;
        UI.renderCategories(this.state.categories, categoryName);
        
        // Remove active from nav items
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        
        this.refreshTasks();
    },

    /**
     * Handle task toggle (complete/incomplete)
     */
    handleToggleTask(id) {
        const task = this.state.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            Store.saveTasks(this.state.tasks);
            this.refreshTasks();
        }
    },

    /**
     * Handle task edit button click
     */
    handleEditTask(id) {
        const task = this.state.tasks.find(t => t.id === id);
        if (task) {
            UI.toggleTaskModal(true, task);
        }
    },

    /**
     * Handle task delete button click
     */
    handleDeleteTask(id) {
        const canDelete = this.state.settings.confirmDelete 
            ? confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')
            : true;

        if (canDelete) {
            this.state.tasks = this.state.tasks.filter(t => t.id !== id);
            Store.saveTasks(this.state.tasks);
            this.refreshTasks();
        }
    },

    /**
     * Handle saving settings
     */
    handleSaveSettings() {
        const newSettings = {
            userName: document.getElementById('set-username').value,
            language: document.getElementById('set-language').value,
            confirmDelete: document.getElementById('set-confirm-delete').checked,
            compactView: document.getElementById('set-compact-view').checked,
            autoDeleteCompleted: document.getElementById('set-auto-delete').checked
        };

        this.state.settings = newSettings;
        Store.saveSettings(newSettings);
        this.applySettings();
        UI.updateLanguage(newSettings.language);
        UI.toggleSettingsModal(false);
        this.refreshTasks();
    },

    /**
     * Apply settings to the UI
     */
    applySettings() {
        // Apply compact view
        if (this.state.settings.compactView) {
            UI.elements.taskList.classList.add('compact-view');
        } else {
            UI.elements.taskList.classList.remove('compact-view');
        }

        // Update username if needed
        if (this.state.settings.userName) {
            document.querySelector('.logo span').textContent = `Bonjour, ${this.state.settings.userName}`;
        }
    },

    /**
     * Handle Export Data
     */
    handleExportData() {
        const data = {
            tasks: this.state.tasks,
            categories: this.state.categories,
            settings: this.state.settings,
            theme: this.state.theme
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `abuni_todo_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    },

    /**
     * Handle Import Data
     */
    handleImportData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.tasks) {
                    this.state.tasks = data.tasks;
                    Store.saveTasks(data.tasks);
                }
                if (data.categories) {
                    this.state.categories = data.categories;
                    Store.saveCategories(data.categories);
                }
                if (data.settings) {
                    this.state.settings = data.settings;
                    Store.saveSettings(data.settings);
                }
                alert('Données importées avec succès !');
                window.location.reload();
            } catch (err) {
                alert('Erreur lors de l\'importation des données.');
            }
        };
        reader.readAsText(file);
    },

    /**
     * Refresh tasks UI based on current state
     */
    refreshTasks() {
        // Auto-delete completed tasks if enabled
        if (this.state.settings.autoDeleteCompleted) {
            this.state.tasks = this.state.tasks.filter(t => !t.completed);
            Store.saveTasks(this.state.tasks);
        }

        const filteredTasks = Tasks.filterTasks(this.state.tasks, {
            filter: this.state.filter,
            category: this.state.categoryFilter,
            search: this.state.searchQuery
        });

        const sortedTasks = Tasks.sortTasks(filteredTasks, this.state.sortBy);
        
        UI.renderTasks(sortedTasks);
        UI.updateStats(Tasks.getStats(this.state.tasks));

        // Update counts in sidebar
        const stats = Tasks.getStats(this.state.tasks);
        const today = new Date().toISOString().split('T')[0];
        const todayCount = this.state.tasks.filter(t => t.dueDate === today).length;
        
        UI.elements.countAll.textContent = stats.total;
        UI.elements.countToday.textContent = todayCount;
        UI.elements.countCompleted.textContent = stats.completed;
    }
};

// Global expose for event handlers in HTML
window.App = App;

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
