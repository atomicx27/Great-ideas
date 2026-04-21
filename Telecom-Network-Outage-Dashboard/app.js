// Mock Data for Cell Towers (Centered roughly around a generic city)
const TOWER_DATA = [
    { id: 'T001', name: 'Downtown Main', lat: 40.7128, lng: -74.0060, status: 'online', crewsDispatched: false },
    { id: 'T002', name: 'Westside Hub', lat: 40.7200, lng: -74.0100, status: 'online', crewsDispatched: false },
    { id: 'T003', name: 'East River Node', lat: 40.7300, lng: -73.9900, status: 'offline', crewsDispatched: false },
    { id: 'T004', name: 'North Park', lat: 40.7500, lng: -73.9800, status: 'maintenance', crewsDispatched: true },
    { id: 'T005', name: 'South Heights', lat: 40.6900, lng: -74.0200, status: 'online', crewsDispatched: false },
    { id: 'T006', name: 'Industrial Sector', lat: 40.6800, lng: -73.9700, status: 'offline', crewsDispatched: true },
    { id: 'T007', name: 'Suburban Ring A', lat: 40.7600, lng: -73.9500, status: 'online', crewsDispatched: false },
    { id: 'T008', name: 'Suburban Ring B', lat: 40.7800, lng: -73.9600, status: 'online', crewsDispatched: false }
];

let map;
let markers = {};
let currentFilter = 'all';

// Initialize Map
function initMap() {
    map = L.map('map').setView([40.7200, -73.9900], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    renderMapMarkers();
}

// Map Status to Colors
function getStatusColor(status) {
    switch(status) {
        case 'online': return '#2ecc71';
        case 'offline': return '#e74c3c';
        case 'maintenance': return '#f1c40f';
        default: return '#95a5a6';
    }
}

// Render Markers on Map
function renderMapMarkers() {
    // Clear existing
    for (let id in markers) {
        map.removeLayer(markers[id]);
    }

    TOWER_DATA.forEach(tower => {
        if (currentFilter !== 'all' && tower.status !== currentFilter) return;

        const markerOptions = {
            color: getStatusColor(tower.status),
            fillColor: getStatusColor(tower.status),
            fillOpacity: 0.8,
            radius: 8
        };

        const marker = L.circleMarker([tower.lat, tower.lng], markerOptions).addTo(map);
        marker.bindPopup(`<b>${tower.name} (${tower.id})</b><br>Status: ${tower.status.toUpperCase()}`);
        markers[tower.id] = marker;
    });
}

// Render Tower List
function renderTowerList() {
    const listEl = document.getElementById('tower-list');
    listEl.innerHTML = '';

    const filteredTowers = TOWER_DATA.filter(t => currentFilter === 'all' || t.status === currentFilter);

    filteredTowers.forEach(tower => {
        const li = document.createElement('li');
        li.className = `tower-item ${tower.status}`;

        let dispatchAction = '';
        if (tower.status === 'offline' || tower.status === 'maintenance') {
            if (tower.crewsDispatched) {
                dispatchAction = `<button class="dispatch-btn" disabled>Crew En Route</button>`;
            } else {
                dispatchAction = `<button class="dispatch-btn" onclick="dispatchCrew('${tower.id}')">Dispatch Crew</button>`;
            }
        }

        li.innerHTML = `
            <div class="tower-info">
                <h4>${tower.name} <span class="status-indicator status-${tower.status}">${tower.status.toUpperCase()}</span></h4>
                <p>ID: ${tower.id} | Lat: ${tower.lat}, Lng: ${tower.lng}</p>
            </div>
            ${dispatchAction}
        `;
        listEl.appendChild(li);
    });

    updateStats();
}

// Dispatch Crew Logic
function dispatchCrew(towerId) {
    const tower = TOWER_DATA.find(t => t.id === towerId);
    if (tower && !tower.crewsDispatched) {
        tower.crewsDispatched = true;
        renderTowerList();
        renderMapMarkers();
        // Simulate repair after random time
        setTimeout(() => {
            tower.status = 'online';
            tower.crewsDispatched = false;
            renderTowerList();
            renderMapMarkers();
            showNotification(`${tower.name} is back online.`);
        }, Math.random() * 10000 + 5000); // 5-15 seconds
    }
}

// Update Dashboard Statistics
function updateStats() {
    const outages = TOWER_DATA.filter(t => t.status === 'offline').length;
    const crews = TOWER_DATA.filter(t => t.crewsDispatched).length;

    document.getElementById('outage-count').innerText = outages;
    document.getElementById('crews-count').innerText = crews;

    const overallStatusEl = document.getElementById('overall-status');
    if (outages > 2) {
        overallStatusEl.className = 'status-indicator status-offline';
        overallStatusEl.innerText = 'Critical Outages';
    } else if (outages > 0 || TOWER_DATA.some(t => t.status === 'maintenance')) {
        overallStatusEl.className = 'status-indicator status-maintenance';
        overallStatusEl.innerText = 'Degraded';
    } else {
        overallStatusEl.className = 'status-indicator status-online';
        overallStatusEl.innerText = 'All Systems Operational';
    }
}

// Simulate random network events
function simulateNetworkEvents() {
    setInterval(() => {
        // Randomly take a healthy tower offline
        if (Math.random() > 0.8) {
            const onlineTowers = TOWER_DATA.filter(t => t.status === 'online');
            if (onlineTowers.length > 0) {
                const target = onlineTowers[Math.floor(Math.random() * onlineTowers.length)];
                target.status = 'offline';
                renderTowerList();
                renderMapMarkers();
                showNotification(`ALERT: ${target.name} went offline!`);
            }
        }
    }, 15000);
}

// Simple notification UI
function showNotification(msg) {
    const el = document.createElement('div');
    el.innerText = msg;
    el.style.position = 'fixed';
    el.style.bottom = '20px';
    el.style.right = '20px';
    el.style.backgroundColor = 'rgba(44, 62, 80, 0.9)';
    el.style.color = 'white';
    el.style.padding = '1rem';
    el.style.borderRadius = '5px';
    el.style.zIndex = '9999';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

// Event Listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTowerList();
        renderMapMarkers();
    });
});

// Init
window.onload = () => {
    initMap();
    renderTowerList();
    simulateNetworkEvents();
};
