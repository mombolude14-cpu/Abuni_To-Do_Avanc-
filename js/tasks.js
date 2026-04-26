/**
 * Tasks Module - Handles task logic and data management
 */
const Tasks = {
    /**
     * Create a new task object
     */
    createTask(data) {
        return {
            id: 'task-' + Date.now(),
            title: data.title,
            description: data.description || '',
            priority: data.priority || 'medium',
            category: data.category || 'Travail',
            dueDate: data.dueDate || '',
            completed: false,
            createdAt: new Date().toISOString(),
            order: 0 // For drag and drop reordering
        };
    },

    /**
     * Filter tasks based on view/criteria
     */
    filterTasks(tasks, criteria) {
        const { filter, search, category } = criteria;
        
        let filtered = [...tasks];

        // Filter by status/view
        if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.dueDate === today);
        } else if (filter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (filter === 'pending') {
            filtered = filtered.filter(t => !t.completed);
        }

        // Filter by category
        if (category && category !== 'all') {
            filtered = filtered.filter(t => t.category === category);
        }

        // Search filter
        if (search) {
            const query = search.toLowerCase();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(query) || 
                t.description.toLowerCase().includes(query)
            );
        }

        return filtered;
    },

    /**
     * Sort tasks
     */
    sortTasks(tasks, sortBy) {
        const [field, direction] = sortBy.split('-');
        
        return [...tasks].sort((a, b) => {
            let valA = a[field];
            let valB = b[field];

            // Handle special cases
            if (field === 'priority') {
                const priorityMap = { 'low': 1, 'medium': 2, 'high': 3 };
                valA = priorityMap[a.priority];
                valB = priorityMap[b.priority];
            }

            if (direction === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
    },

    /**
     * Get statistics
     */
    getStats(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, pending, percent };
    }
};

window.Tasks = Tasks;
