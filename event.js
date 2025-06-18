// ----------------------------
// ✅ FINAL event.js
// ----------------------------

const events = JSON.parse(localStorage.getItem('events')) || [];
const now = new Date();
const validEvents = events.filter(ev => new Date(`${ev.date}T${ev.time}`) >= now);
localStorage.setItem('events', JSON.stringify(validEvents));

const eventList = document.getElementById('eventList');
const sortSelect = document.getElementById('sortSelect');

function renderEvents(list) {
    eventList.innerHTML = '';
    if (list.length === 0) {
        eventList.innerHTML = `<li class="list-group-item text-center py-4">📭 <strong>No Upcoming Events!</strong></li>`;
        return;
    }
    list.forEach(ev => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${ev.name} — ${ev.type} — ${ev.date} ${ev.time} — ${ev.address}`;
        eventList.appendChild(li);
    });
}

sortSelect.addEventListener('change', () => {
    const sorted = [...validEvents].sort((a, b) => a.address.localeCompare(b.address));
    renderEvents(sorted);
});

// Show on page load:
renderEvents(validEvents);