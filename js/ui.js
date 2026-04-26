/**
 * UI Module - Handles DOM manipulation and rendering
 */
const UI = {
    // Selectors
    elements: {
        taskList: document.getElementById('task-list'),
        categoryList: document.getElementById('category-list'),
        taskForm: document.getElementById('task-form'),
        taskModal: document.getElementById('task-modal'),
        categoryModal: document.getElementById('category-modal'),
        searchInput: document.getElementById('search-input'),
        sortSelect: document.getElementById('sort-select'),
        viewTitle: document.getElementById('current-view-title'),
        emptyState: document.getElementById('empty-state'),
        helpModal: document.getElementById('help-modal'),
        settingsModal: document.getElementById('settings-modal'),
        
        // Stats
        countAll: document.getElementById('count-all'),
        countToday: document.getElementById('count-today'),
        countCompleted: document.getElementById('count-completed'),
        progressPercent: document.getElementById('progress-percent'),
        progressFill: document.getElementById('progress-fill'),
        
        // Forms
        taskId: document.getElementById('task-id'),
        taskTitle: document.getElementById('task-title'),
        taskDesc: document.getElementById('task-desc'),
        taskPriority: document.getElementById('task-priority'),
        taskCategory: document.getElementById('task-category'),
        taskDate: document.getElementById('task-date'),
        modalTitle: document.getElementById('modal-title'),
        
        // Sidebar/Theme
        sidebar: document.getElementById('sidebar'),
        themeIcon: document.getElementById('theme-icon'),
        themeText: document.getElementById('theme-text')
    },

    translations: {
        fr: {
            all_tasks: "Toutes les tâches",
            today: "Aujourd'hui",
            completed: "Terminées",
            views: "Vues",
            categories: "Catégories",
            stats: "Statistiques",
            progress: "Progression",
            help_center: "Centre d'aide",
            settings: "Paramètres",
            new_task: "Nouvelle tâche",
            search: "Rechercher des tâches...",
            no_tasks: "Aucune tâche trouvée. Commencez par en ajouter une !",
            priority: "Priorité",
            priority_low: "Basse",
            priority_medium: "Moyenne",
            priority_high: "Haute",
            due_date: "Date d'échéance",
            no_date: "Pas de date",
            edit_task: "Modifier la tâche",
            create_task: "Créer une tâche",
            cancel: "Annuler",
            save: "Enregistrer",
            theme_light: "Mode Clair",
            theme_dark: "Mode Sombre",
            theme_blue: "Mode Bleu"
        },
        en: {
            all_tasks: "All Tasks",
            today: "Today",
            completed: "Completed",
            views: "Views",
            categories: "Categories",
            stats: "Statistics",
            progress: "Progress",
            help_center: "Help Center",
            settings: "Settings",
            new_task: "New Task",
            search: "Search tasks...",
            no_tasks: "No tasks found. Start by adding one!",
            priority: "Priority",
            priority_low: "Low",
            priority_medium: "Medium",
            priority_high: "High",
            due_date: "Due Date",
            no_date: "No date",
            edit_task: "Edit Task",
            create_task: "Create Task",
            cancel: "Cancel",
            save: "Save",
            theme_light: "Light Mode",
            theme_dark: "Dark Mode",
            theme_blue: "Blue Mode"
        }
    },

    currentLang: 'fr',

    /**
     * Render the task list
     */
    renderTasks(tasks, onToggle, onEdit, onDelete) {
        this.elements.taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            this.elements.emptyState.style.display = 'flex';
            return;
        }

        this.elements.emptyState.style.display = 'none';

        tasks.forEach(task => {
            const card = this.createTaskCard(task, onToggle, onEdit, onDelete);
            this.elements.taskList.appendChild(card);
        });

        // Re-initialize icons for new elements
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    /**
     * Create a task card element
     */
    createTaskCard(task, onToggle, onEdit, onDelete) {
        const div = document.createElement('div');
        div.className = `task-card ${task.completed ? 'completed' : ''}`;
        div.draggable = true;
        div.dataset.id = task.id;

        const dict = this.translations[this.currentLang];
        const dateFormatted = task.dueDate ? new Date(task.dueDate).toLocaleDateString(this.currentLang === 'fr' ? 'fr-FR' : 'en-US') : dict.no_date;
        
        const priorityLabels = { 
            'low': dict.priority_low, 
            'medium': dict.priority_medium, 
            'high': dict.priority_high 
        };
        const priorityLabel = priorityLabels[task.priority] || task.priority;
        
        div.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="window.App.handleToggleTask('${task.id}')">
                <i data-lucide="check"></i>
            </div>
            <div class="task-info">
                <h3 class="task-title">${task.title}</h3>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                <div class="task-meta">
                    <span class="meta-item">
                        <i data-lucide="calendar"></i>
                        ${dateFormatted}
                    </span>
                    <span class="meta-item">
                        <i data-lucide="tag"></i>
                        ${task.category}
                    </span>
                    <span class="badge priority-${task.priority}">${priorityLabel}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn edit-btn" onclick="window.App.handleEditTask('${task.id}')">
                    <i data-lucide="edit-3"></i>
                </button>
                <button class="action-btn delete-btn" onclick="window.App.handleDeleteTask('${task.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        // Add drag events
        div.addEventListener('dragstart', () => div.classList.add('dragging'));
        div.addEventListener('dragend', () => div.classList.remove('dragging'));

        return div;
    },

    /**
     * Render category items in sidebar and select dropdown
     */
    renderCategories(categories, activeCategory) {
        // Render in sidebar
        this.elements.categoryList.innerHTML = '';
        categories.forEach(cat => {
            const li = document.createElement('li');
            li.className = `nav-item ${activeCategory === cat.name ? 'active' : ''}`;
            li.dataset.category = cat.name;
            li.innerHTML = `
                <div class="category-dot" style="background-color: ${cat.color}"></div>
                <span>${cat.name}</span>
            `;
            li.onclick = () => window.App.handleCategoryFilter(cat.name);
            this.elements.categoryList.appendChild(li);
        });

        // Render in task modal select
        this.elements.taskCategory.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name;
            this.elements.taskCategory.appendChild(option);
        });
    },

    /**
     * Update statistics UI
     */
    updateStats(stats) {
        this.elements.countAll.textContent = stats.total;
        this.elements.countCompleted.textContent = stats.completed;
        this.elements.progressPercent.textContent = `${stats.percent}%`;
        this.elements.progressFill.style.width = `${stats.percent}%`;
    },

    /**
     * Show/Hide Task Modal
     */
    toggleTaskModal(show, task = null) {
        if (show) {
            this.elements.taskModal.classList.add('active');
            if (task) {
                this.elements.modalTitle.textContent = 'Modifier la tâche';
                this.elements.taskId.value = task.id;
                this.elements.taskTitle.value = task.title;
                this.elements.taskDesc.value = task.description;
                this.elements.taskPriority.value = task.priority;
                this.elements.taskCategory.value = task.category;
                this.elements.taskDate.value = task.dueDate;
            } else {
                this.elements.modalTitle.textContent = 'Créer une nouvelle tâche';
                this.elements.taskForm.reset();
                this.elements.taskId.value = '';
            }
            this.elements.taskTitle.focus();
        } else {
            this.elements.taskModal.classList.remove('active');
        }
    },

    /**
     * Show/Hide Category Modal
     */
    toggleCategoryModal(show) {
        if (show) {
            this.elements.categoryModal.classList.add('active');
            document.getElementById('cat-name').focus();
        } else {
            this.elements.categoryModal.classList.remove('active');
            document.getElementById('category-form').reset();
        }
    },

    /**
     * Show/Hide Help Modal
     */
    toggleHelpModal(show) {
        if (show) {
            this.elements.helpModal.classList.add('active');
        } else {
            this.elements.helpModal.classList.remove('active');
        }
    },

    /**
     * Show/Hide Settings Modal
     */
    toggleSettingsModal(show) {
        if (show) {
            this.elements.settingsModal.classList.add('active');
        } else {
            this.elements.settingsModal.classList.remove('active');
        }
    },

    /**
     * Fill settings form with current state
     */
    fillSettingsForm(settings) {
        document.getElementById('set-username').value = settings.userName || '';
        document.getElementById('set-language').value = settings.language || 'fr';
        document.getElementById('set-confirm-delete').checked = settings.confirmDelete !== false;
        document.getElementById('set-compact-view').checked = !!settings.compactView;
        document.getElementById('set-auto-delete').checked = !!settings.autoDeleteCompleted;
    },

    /**
     * Toggle Theme UI
     */
    setTheme(theme) {
        document.body.classList.remove('light-mode', 'dark-mode', 'blue-mode');
        document.body.classList.add(`${theme}-mode`);

        if (theme === 'dark') {
            this.elements.themeIcon.setAttribute('data-lucide', 'sun');
            this.elements.themeText.textContent = 'Mode Clair';
        } else if (theme === 'blue') {
            this.elements.themeIcon.setAttribute('data-lucide', 'moon');
            this.elements.themeText.textContent = 'Mode Sombre';
        } else {
            this.elements.themeIcon.setAttribute('data-lucide', 'droplets');
            this.elements.themeText.textContent = 'Mode Bleu';
        }

        if (window.lucide) window.lucide.createIcons();
    },

    /**
     * Update application language
     */
    updateLanguage(lang) {
        this.currentLang = lang;
        const dict = this.translations[lang];
        
        // Update static elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key]) {
                if (el.tagName === 'INPUT' && el.type === 'text') {
                    el.placeholder = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // Update complex elements manually if needed
        this.elements.searchInput.placeholder = dict.search;
        
        // Refresh tasks to update card labels
        if (window.App && window.App.refreshTasks) {
            window.App.refreshTasks();
        }
    }
};

window.UI = UI;
