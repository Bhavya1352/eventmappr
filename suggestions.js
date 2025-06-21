// Event Suggestions Management
class EventSuggestions {
    constructor() {
        this.suggestions = this.loadSuggestions();
        this.currentFilter = 'all';
        this.deleteTargetId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.displaySuggestions();
        this.updateCharCounter();
    }

    bindEvents() {
        // Form submission
        const form = document.getElementById('suggestionForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Character counter
        const textarea = document.getElementById('eventDescription');
        textarea.addEventListener('input', () => this.updateCharCounter());

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        }

        // Delete modal events
        const deleteModal = document.getElementById('deleteModal');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

        confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        cancelDeleteBtn.addEventListener('click', () => this.cancelDelete());
        
        // Close modal when clicking outside
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                this.cancelDelete();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && deleteModal.classList.contains('show')) {
                this.cancelDelete();
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const suggestion = {
            id: Date.now(),
            category: formData.get('eventCategory'),
            description: formData.get('eventDescription'),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        // Add to suggestions array
        this.suggestions.unshift(suggestion);
        
        // Save to localStorage
        this.saveSuggestions();
        
        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        e.target.reset();
        
        // Update display
        this.displaySuggestions();
        this.updateCharCounter();
        
        // Scroll to suggestions section
        setTimeout(() => {
            document.querySelector('.suggestions-list-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 1000);
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }

    updateCharCounter() {
        const textarea = document.getElementById('eventDescription');
        const charCount = document.getElementById('charCount');
        const currentLength = textarea.value.length;
        
        charCount.textContent = currentLength;
        
        // Change color based on character count
        if (currentLength > 450) {
            charCount.style.color = '#ef4444';
        } else if (currentLength > 400) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#64748b';
        }
    }

    handleFilter(e) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Set current filter
        this.currentFilter = e.target.dataset.category;
        
        // Display filtered suggestions
        this.displaySuggestions();
    }

    handleDelete(suggestionId) {
        this.deleteTargetId = suggestionId;
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    confirmDelete() {
        if (this.deleteTargetId) {
            // Remove suggestion from array
            this.suggestions = this.suggestions.filter(s => s.id !== this.deleteTargetId);
            
            // Save to localStorage
            this.saveSuggestions();
            
            // Update display
            this.displaySuggestions();
            
            // Show success feedback
            this.showDeleteSuccess();
        }
        
        this.cancelDelete();
    }

    cancelDelete() {
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        this.deleteTargetId = null;
    }

    showDeleteSuccess() {
        // Create a temporary success message for deletion
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message show';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Suggestion Deleted</h3>
            <p>Your event suggestion has been successfully removed.</p>
        `;
        
        const container = document.querySelector('.suggestions-list-section .container');
        container.insertBefore(successDiv, container.firstChild);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    displaySuggestions() {
        const container = document.getElementById('suggestionsList');
        const emptyState = document.getElementById('emptyState');
        
        // Filter suggestions based on current filter
        let filteredSuggestions = this.suggestions;
        if (this.currentFilter !== 'all') {
            filteredSuggestions = this.suggestions.filter(s => s.category === this.currentFilter);
        }
        
        // Show/hide empty state
        if (filteredSuggestions.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hide');
            return;
        } else {
            emptyState.classList.add('hide');
        }
        
        // Generate HTML for suggestions
        container.innerHTML = filteredSuggestions.map(suggestion => this.generateSuggestionHTML(suggestion)).join('');
        
        // Bind delete button events
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const suggestionId = parseInt(btn.dataset.id);
                this.handleDelete(suggestionId);
            });
        });
    }

    generateSuggestionHTML(suggestion) {
        const categoryIcons = {
            'Music': 'fas fa-music',
            'Tech': 'fas fa-laptop-code',
            'Art': 'fas fa-palette',
            'Volunteering': 'fas fa-hands-helping',
            'Market': 'fas fa-store',
            'Sports': 'fas fa-futbol',
            'Food': 'fas fa-utensils',
            'Education': 'fas fa-graduation-cap',
            'Community': 'fas fa-users'
        };

        return `
            <div class="suggestion-card">
                <div class="suggestion-category">
                    <i class="${categoryIcons[suggestion.category] || 'fas fa-calendar'}"></i>
                    ${suggestion.category}
                </div>
                <div class="suggestion-description">
                    ${suggestion.description}
                </div>
                <div class="suggestion-meta">
                    <div class="suggestion-date">
                        <i class="fas fa-clock"></i>
                        Suggested on ${suggestion.date}
                    </div>
                    <button class="delete-btn" data-id="${suggestion.id}" title="Delete this suggestion">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    loadSuggestions() {
        try {
            const stored = localStorage.getItem('eventSuggestions');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading suggestions:', error);
            return [];
        }
    }

    saveSuggestions() {
        try {
            localStorage.setItem('eventSuggestions', JSON.stringify(this.suggestions));
        } catch (error) {
            console.error('Error saving suggestions:', error);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventSuggestions();
});

// Add some sample data for demonstration (only if no existing data)
document.addEventListener('DOMContentLoaded', () => {
    const existingSuggestions = localStorage.getItem('eventSuggestions');
    
    if (!existingSuggestions) {
        const sampleSuggestions = [
            {
                id: 1,
                category: 'Music',
                description: 'Outdoor jazz festival in Central Park with local bands and food vendors. A perfect way to enjoy summer evenings with great music and community vibes.',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            },
            {
                id: 2,
                category: 'Tech',
                description: 'Monthly coding meetup for beginners and professionals to network, share knowledge, and work on collaborative projects. Includes workshops and guest speakers.',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                date: new Date(Date.now() - 172800000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            },
            {
                id: 3,
                category: 'Volunteering',
                description: 'Community garden cleanup and planting event. Help beautify our neighborhood while learning about sustainable gardening practices. All skill levels welcome!',
                timestamp: new Date(Date.now() - 259200000).toISOString(),
                date: new Date(Date.now() - 259200000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
        ];
        
        localStorage.setItem('eventSuggestions', JSON.stringify(sampleSuggestions));
    }
});