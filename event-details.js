// Enhanced events data with more details
const eventsData = {
    "Community Cleanup": {
        name: "Community Cleanup",
        type: "Volunteering",
        lat: 28.604047,
        lng: 77.227003,
        description: "Join us for a community cleanup event to make our neighborhood cleaner and greener. We'll be collecting litter, planting trees, and beautifying our local parks. All ages welcome!",
        address: "Central Park, New Delhi",
        dateTime: "March 15, 2025 • 9:00 AM - 2:00 PM",
        organizer: "Green Earth Initiative",
        contact: "greenearth@email.com • +91 98765 43210",
        image: "🌱",
        photos: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
        ]
    },
    "Local Music Night": {
        name: "Local Music Night",
        type: "Music",
        lat: 28.626646,
        lng: 77.190096,
        description: "An evening of live music featuring local artists and bands. Enjoy acoustic performances, indie rock, and folk music in a cozy atmosphere. Food and beverages available.",
        address: "The Music Cafe, Connaught Place",
        dateTime: "March 20, 2025 • 7:00 PM - 11:00 PM",
        organizer: "Delhi Music Collective",
        contact: "music@delhicollective.com • +91 98765 43211",
        image: "🎵",
        photos: [
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
        ]
    },
    "Tech Meetup": {
        name: "Tech Meetup",
        type: "Technology",
        lat: 28.613999,
        lng: 77.226603,
        description: "Monthly tech meetup featuring talks on AI, machine learning, and web development. Network with fellow developers, share knowledge, and stay updated with the latest tech trends.",
        address: "Innovation Hub, Cyber City",
        dateTime: "March 25, 2025 • 6:30 PM - 9:00 PM",
        organizer: "Delhi Tech Community",
        contact: "tech@delhimeetup.com • +91 98765 43212",
        image: "💻",
        photos: [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=400&fit=crop"
        ]
    },
    "Farmers Market": {
        name: "Farmers Market",
        type: "Market",
        lat: 28.616373,
        lng: 77.204582,
        description: "Fresh produce, organic vegetables, homemade bread, and artisanal products from local farmers and vendors. Support local agriculture and enjoy fresh, healthy food.",
        address: "Sunday Market Square, Lajpat Nagar",
        dateTime: "Every Sunday • 8:00 AM - 2:00 PM",
        organizer: "Local Farmers Association",
        contact: "farmers@localmarket.com • +91 98765 43213",
        image: "🥬",
        photos: [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
        ]
    },
    "Art & Craft Fair": {
        name: "Art & Craft Fair",
        type: "Art",
        lat: 28.601078,
        lng: 77.208121,
        description: "Discover unique handmade crafts, paintings, sculptures, and jewelry from local artists. Perfect for finding one-of-a-kind gifts or adding to your art collection.",
        address: "Art Gallery District, Hauz Khas",
        dateTime: "March 30, 2025 • 10:00 AM - 6:00 PM",
        organizer: "Delhi Artists Guild",
        contact: "art@delhiguild.com • +91 98765 43214",
        image: "🎨",
        photos: [
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
        ]
    }
};

// Global variables for photo functionality
let currentEventPhotos = [];
let currentPhotoIndex = 0;

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to initialize the mini map
function initializeMap(lat, lng, eventName) {
    const map = L.map('eventMap').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for the event
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<strong>${eventName}</strong>`)
        .openPopup();
}

// Function to load event details
function loadEventDetails() {
    const eventName = getUrlParameter('event');

    if (!eventName) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        return;
    }

    let event = eventsData[eventName];

    // If event not found in predefined data, check for dynamic events
    if (!event) {
        // Try to get from localStorage (for newly added events)
        const dynamicEvents = JSON.parse(localStorage.getItem('dynamicEvents') || '{}');
        event = dynamicEvents[eventName];

        if (!event) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            return;
        }
    }

    // Update page title
    document.title = `${event.name} - EventMappr`;

    // Populate event details
    document.getElementById('eventName').textContent = event.name;
    document.getElementById('eventType').textContent = event.type;
    document.getElementById('eventDescription').textContent = event.description || `A ${event.type.toLowerCase()} event. More details coming soon!`;
    document.getElementById('eventAddress').textContent = event.address || "Location details to be announced";
    document.getElementById('eventCoordinates').textContent = `${event.lat.toFixed(6)}, ${event.lng.toFixed(6)}`;
    document.getElementById('eventDateTime').textContent = event.dateTime || "Date and time to be announced";
    document.getElementById('eventOrganizer').textContent = event.organizer || "Event Organizer";
    document.getElementById('eventContact').textContent = event.contact || "Contact information to be announced";

    // Populate meta information
    document.getElementById('eventDate').textContent = event.dateTime ? event.dateTime.split('•')[0].trim() : 'TBD';
    document.getElementById('eventLocation').textContent = event.address ? event.address.split(',')[0].trim() : 'TBD';
    document.getElementById('eventCategory').textContent = event.type;

    // Load and display photos
    loadEventPhotos(event);

    // Initialize the mini map
    initializeMap(event.lat, event.lng, event.name);

    // Set up action buttons
    setupActionButtons(event);

    // Set up photo functionality
    setupPhotoFunctionality(eventName);

    // Hide loading and show content
    document.getElementById('loading').style.display = 'none';

    // Call animations after content is loaded
    if (typeof initializeAnimations === 'function') {
        initializeAnimations();
    }
}

// Function to load event photos
function loadEventPhotos(event) {
    currentEventPhotos = event.photos || [];

    if (currentEventPhotos.length > 0) {
        displayPhotos(currentEventPhotos);
    } else {
        showPhotoPlaceholder();
    }
}

// Function to display photos in gallery
function displayPhotos(photos) {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryPlaceholder = document.getElementById('galleryPlaceholder');

    galleryPlaceholder.style.display = 'none';
    galleryGrid.style.display = 'grid';
    galleryGrid.innerHTML = '';

    photos.forEach((photo, index) => {
        const photoItem = createPhotoItem(photo, index);
        galleryGrid.appendChild(photoItem);
    });
}

// Function to create photo item
function createPhotoItem(photoSrc, index) {
    const photoItem = document.createElement('div');
    photoItem.className = 'gallery-item';
    photoItem.innerHTML = `
        <img src="${photoSrc}" alt="Event photo ${index + 1}" loading="lazy">
        <div class="gallery-item-overlay">
            <div class="gallery-item-actions">
                <button class="gallery-action-btn" onclick="openPhotoModal(${index})" title="View full size">
                    <i class="fas fa-expand"></i>
                </button>
                <button class="gallery-action-btn delete" onclick="deletePhoto(${index})" title="Delete photo">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return photoItem;
}

// Function to show photo placeholder
function showPhotoPlaceholder() {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryPlaceholder = document.getElementById('galleryPlaceholder');

    galleryGrid.style.display = 'none';
    galleryPlaceholder.style.display = 'block';
}

// Function to set up photo functionality
function setupPhotoFunctionality(eventName) {
    const uploadBtn = document.getElementById('uploadBtn');
    const photoInput = document.getElementById('photoInput');

    uploadBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        handlePhotoUpload(e.target.files, eventName);
    });

    // Set up modal functionality
    setupPhotoModal();
}

// Function to handle photo upload
function handlePhotoUpload(files, eventName) {
    if (files.length === 0) return;

    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    uploadProgress.style.display = 'block';

    let uploadedCount = 0;
    const totalFiles = files.length;

    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const photoData = e.target.result;
                currentEventPhotos.push(photoData);

                uploadedCount++;
                const progress = (uploadedCount / totalFiles) * 100;

                progressFill.style.width = `${progress}%`;
                progressText.textContent = `Uploading ${uploadedCount}/${totalFiles}...`;

                if (uploadedCount === totalFiles) {
                    // All photos uploaded
                    setTimeout(() => {
                        uploadProgress.style.display = 'none';
                        progressFill.style.width = '0%';
                        displayPhotos(currentEventPhotos);
                        saveEventPhotos(eventName, currentEventPhotos);
                        showNotification(`${totalFiles} photo(s) uploaded successfully!`, 'success');
                    }, 500);
                }
            };

            reader.readAsDataURL(file);
        }
    });
}

// Function to save event photos
function saveEventPhotos(eventName, photos) {
    const dynamicEvents = JSON.parse(localStorage.getItem('dynamicEvents') || '{}');

    if (dynamicEvents[eventName]) {
        dynamicEvents[eventName].photos = photos;
    } else if (eventsData[eventName]) {
        eventsData[eventName].photos = photos;
    }

    localStorage.setItem('dynamicEvents', JSON.stringify(dynamicEvents));
}

// Function to open photo modal
function openPhotoModal(index) {
    currentPhotoIndex = index;
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalCounter = document.getElementById('modalCounter');

    modalImage.src = currentEventPhotos[index];
    modalCounter.textContent = `${index + 1} / ${currentEventPhotos.length}`;
    modal.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Function to close photo modal
function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Function to navigate photos in modal
function navigatePhoto(direction) {
    if (direction === 'next') {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentEventPhotos.length;
    } else {
        currentPhotoIndex = currentPhotoIndex === 0 ? currentEventPhotos.length - 1 : currentPhotoIndex - 1;
    }

    const modalImage = document.getElementById('modalImage');
    const modalCounter = document.getElementById('modalCounter');

    modalImage.src = currentEventPhotos[currentPhotoIndex];
    modalCounter.textContent = `${currentPhotoIndex + 1} / ${currentEventPhotos.length}`;
}

// Function to delete photo
function deletePhoto(index) {
    if (confirm('Are you sure you want to delete this photo?')) {
        currentEventPhotos.splice(index, 1);

        if (currentEventPhotos.length === 0) {
            showPhotoPlaceholder();
        } else {
            displayPhotos(currentEventPhotos);
        }

        const eventName = getUrlParameter('event');
        saveEventPhotos(eventName, currentEventPhotos);
        showNotification('Photo deleted successfully!', 'success');
    }
}

// Function to set up photo modal
function setupPhotoModal() {
    const modal = document.getElementById('photoModal');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');

    modalClose.addEventListener('click', closePhotoModal);
    modalPrev.addEventListener('click', () => navigatePhoto('prev'));
    modalNext.addEventListener('click', () => navigatePhoto('next'));

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePhotoModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closePhotoModal();
            } else if (e.key === 'ArrowLeft') {
                navigatePhoto('prev');
            } else if (e.key === 'ArrowRight') {
                navigatePhoto('next');
            }
        }
    });
}

// Function to set up action buttons
function setupActionButtons(event) {
    const shareBtn = document.getElementById('shareBtn');
    const googleCalendarBtn = document.getElementById('googleCalendarBtn');
    const outlookCalendarBtn = document.getElementById('outlookCalendarBtn');
    const icsDownloadBtn = document.getElementById('icsDownloadBtn');

    // Share button functionality
    shareBtn.addEventListener('click', function (e) {
        e.preventDefault();
        shareEvent(event);
    });

    // Calendar buttons functionality
    googleCalendarBtn.addEventListener('click', function (e) {
        e.preventDefault();
        addToGoogleCalendar(event);
    });

    outlookCalendarBtn.addEventListener('click', function (e) {
        e.preventDefault();
        addToOutlookCalendar(event);
    });

    icsDownloadBtn.addEventListener('click', function (e) {
        e.preventDefault();
        downloadIcsFile(event);
    });
}

// Function to share event
function shareEvent(event) {
    const shareText = `Check out this event: ${event.name} - ${event.description}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: event.name,
            text: shareText,
            url: shareUrl
        }).catch(console.error);
    } else {
        // Fallback to copying to clipboard
        const shareData = `${shareText}\n\n${shareUrl}`;
        navigator.clipboard.writeText(shareData).then(() => {
            showNotification('Event link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareData;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Event link copied to clipboard!', 'success');
        });
    }
}

function parseEventDateTime(dateTimeStr) {
    if (!dateTimeStr || !dateTimeStr.includes('•')) {
        // Fallback for unknown format
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1); // Tomorrow
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 1);
        return { startDate, endDate };
    }

    const parts = dateTimeStr.split('•').map(s => s.trim());
    let datePart = parts[0];
    const timePart = parts[1];

    // Handle recurring dates like "Every Sunday"
    if (datePart.toLowerCase().startsWith('every')) {
        const dayOfWeek = datePart.split(' ')[1];
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = days.indexOf(dayOfWeek.toLowerCase());
        if (targetDay !== -1) {
            const today = new Date();
            const currentDay = today.getDay();
            let daysUntilTarget = targetDay - currentDay;
            if (daysUntilTarget <= 0) {
                daysUntilTarget += 7;
            }
            const nextEventDate = new Date();
            nextEventDate.setDate(today.getDate() + daysUntilTarget);
            datePart = nextEventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
    }
    
    if (!timePart || !timePart.includes('-')) {
        // Fallback for unknown time format
        const startDate = new Date(datePart);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2); // Default to 2 hours
        return { startDate, endDate };
    }


    const [startTimeStr, endTimeStr] = timePart.split('-').map(s => s.trim());

    const startDate = new Date(`${datePart} ${startTimeStr}`);
    const endDate = new Date(`${datePart} ${endTimeStr}`);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        // Fallback for parsing errors
        const sDate = new Date();
        sDate.setDate(sDate.getDate() + 1); // Tomorrow
        const eDate = new Date(sDate);
        eDate.setHours(eDate.getHours() + 1);
        return { startDate: sDate, endDate: eDate };
    }

    if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
    }

    return { startDate, endDate };
}

function addToGoogleCalendar(event) {
    const { startDate, endDate } = parseEventDateTime(event.dateTime);
    
    const formatForGoogle = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formatForGoogle(startDate)}/${formatForGoogle(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.address)}`;
    
    window.open(url, '_blank');
    showNotification('Opening Google Calendar...', 'info');
}

function addToOutlookCalendar(event) {
    const { startDate, endDate } = parseEventDateTime(event.dateTime);

    const formatForOutlook = (date) => date.toISOString();

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.name)}&startdt=${formatForOutlook(startDate)}&enddt=${formatForOutlook(endDate)}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.address)}`;

    window.open(url, '_blank');
    showNotification('Opening Outlook Calendar...', 'info');
}

// Function to download event as .ics file
function downloadIcsFile(event) {
    const { startDate, endDate } = parseEventDateTime(event.dateTime);

    const toIcsDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, '');

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `UID:${new Date().getTime()}@eventmappr.com`,
        `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(startDate)}`,
        `DTEND:${toIcsDate(endDate)}`,
        `SUMMARY:${event.name}`,
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.address}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.name.replace(/ /g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Downloading .ics file...', 'success');
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        ">
            ${message}
        </div>
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Function to save dynamic event data
function saveDynamicEvent(eventName, eventData) {
    const dynamicEvents = JSON.parse(localStorage.getItem('dynamicEvents') || '{}');
    dynamicEvents[eventName] = eventData;
    localStorage.setItem('dynamicEvents', JSON.stringify(dynamicEvents));
}

// Function to handle dynamic event loading (for newly added events)
function loadDynamicEvent(eventName, eventData) {
    // Store the event data temporarily
    if (!eventsData[eventName]) {
        const newEventData = {
            name: eventName,
            type: eventData.type,
            lat: eventData.lat,
            lng: eventData.lng,
            description: eventData.description || `A ${eventData.type.toLowerCase()} event. More details coming soon!`,
            address: eventData.address || "Location details to be announced",
            dateTime: eventData.dateTime || "Date and time to be announced",
            organizer: eventData.organizer || "Event Organizer",
            contact: eventData.contact || "Contact information to be announced",
            image: getEventIcon(eventData.type)
        };

        // Save to localStorage
        saveDynamicEvent(eventName, newEventData);
        eventsData[eventName] = newEventData;
    }

    loadEventDetails();
}

// Function to get event icon based on type
function getEventIcon(type) {
    const icons = {
        'Music': '🎵',
        'Volunteering': '🌱',
        'Technology': '💻',
        'Market': '🥬',
        'Art': '🎨'
    };
    return icons[type] || '📅';
}

// Load event details when page loads
document.addEventListener('DOMContentLoaded', loadEventDetails);

// Handle browser back/forward buttons
window.addEventListener('popstate', loadEventDetails);