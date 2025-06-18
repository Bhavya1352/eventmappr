// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const navType = this.getAttribute('data-nav');
            
            // For ABOUT US and other non-home links, prevent default and handle active state
            if (navType === 'about') {
                e.preventDefault();
            }
            
            // Remove active class from all nav links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Badge generation functionality
    const eventNameInput = document.getElementById('eventName');
    const eventDateInput = document.getElementById('eventDate');
    const eventLocationInput = document.getElementById('eventLocation');
    const badgeStyleSelect = document.getElementById('badgeStyle');
    const badgePreview = document.getElementById('badgePreview');
    const badgeTitle = document.querySelector('.badge-title');
    const badgeDate = document.querySelector('.badge-date');
    const badgeLocation = document.querySelector('.badge-location');
    
    // Update badge preview in real-time
    function updateBadgePreview() {
        if (badgeTitle) badgeTitle.textContent = eventNameInput.value || 'Event Name';
        if (badgeLocation) badgeLocation.textContent = eventLocationInput.value || 'Location';
        
        // Format date
        if (badgeDate && eventDateInput.value) {
            const date = new Date(eventDateInput.value);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            badgeDate.textContent = date.toLocaleDateString('en-US', options);
        }
        
        // Update badge theme
        if (badgePreview) {
            // Remove all theme classes
            badgePreview.className = 'badge';
            
            // Add selected theme
            const selectedTheme = badgeStyleSelect.value;
            badgePreview.classList.add(`${selectedTheme}-theme`);
        }
    }
    
    // Add event listeners for real-time updates
    if (eventNameInput) eventNameInput.addEventListener('input', updateBadgePreview);
    if (eventDateInput) eventDateInput.addEventListener('change', updateBadgePreview);
    if (eventLocationInput) eventLocationInput.addEventListener('input', updateBadgePreview);
    if (badgeStyleSelect) badgeStyleSelect.addEventListener('change', updateBadgePreview);
    
    // Preview button functionality
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            // Add a pulse animation to show preview is working
            if (badgePreview) {
                badgePreview.classList.add('success-pulse');
                setTimeout(() => {
                    badgePreview.classList.remove('success-pulse');
                }, 600);
            }
        });
    }
    
    // Download functionality
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const badge = document.getElementById('badgePreview');
            if (badge && typeof html2canvas !== 'undefined') {
                // Add loading state
                downloadBtn.textContent = 'Generating...';
                downloadBtn.disabled = true;
                
                html2canvas(badge, {
                    backgroundColor: null,
                    scale: 2,
                    useCORS: true
                }).then(canvas => {
                    // Create download link
                    const link = document.createElement('a');
                    link.download = `${eventNameInput.value || 'event'}-badge.png`;
                    link.href = canvas.toDataURL();
                    
                    // Trigger download
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Reset button
                    downloadBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Download Badge
                    `;
                    downloadBtn.disabled = false;
                }).catch(error => {
                    console.error('Error generating badge:', error);
                    alert('Failed to generate badge. Please try again.');
                    
                    // Reset button
                    downloadBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Download Badge
                    `;
                    downloadBtn.disabled = false;
                });
            } else {
                alert('Download functionality is not available. Please ensure all scripts are loaded.');
            }
        });
    }
    
    // Initialize badge preview
    updateBadgePreview();
});