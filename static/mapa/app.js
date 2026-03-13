// ========================================
// CMP Bandas Filarmónicas — Map Application
// ========================================

(function () {
  'use strict';

  // Initialize Lucide icons
  lucide.createIcons();

  // State
  let bands = [];
  let map = null;
  let markers = null;
  let markerRefs = {};

  // DOM refs
  const mapEl = document.getElementById('map');
  const mapLoading = document.getElementById('mapLoading');
  const bandPanel = document.getElementById('bandPanel');
  const panelTitle = document.getElementById('panelTitle');
  const panelBody = document.getElementById('panelBody');
  const panelClose = document.getElementById('panelClose');
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const searchResults = document.getElementById('searchResults');
  const bandCountEl = document.getElementById('bandCount');
  const cityCountEl = document.getElementById('cityCount');
  const oldestBandEl = document.getElementById('oldestBand');

  // ========================================
  // Initialize Map
  // ========================================

  function initMap() {
    map = L.map('map', {
      center: [39.5, -8.0],
      zoom: 7,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true
    });

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    // Marker cluster group
    markers = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 14,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count >= 50) size = 'large';
        else if (count >= 20) size = 'medium';

        return L.divIcon({
          html: '<div>' + count + '</div>',
          className: 'marker-cluster marker-cluster-' + size,
          iconSize: L.point(40, 40)
        });
      }
    });

    map.addLayer(markers);
  }

  // ========================================
  // Load Band Data
  // ========================================

  async function loadBands() {
    try {
      const res = await fetch('./bands.json');
      bands = await res.json();
      populateMap();
      updateStats();
      mapLoading.classList.add('hidden');
    } catch (err) {
      console.error('Error loading bands:', err);
      mapLoading.innerHTML = '<p style="color:#a13544;">Erro ao carregar dados das bandas.</p>';
    }
  }

  // ========================================
  // Populate Map with Markers
  // ========================================

  function populateMap() {
    bands.forEach(function (band) {
      if (!band.lat || !band.lng) return;

      const marker = L.marker([band.lat, band.lng], {
        icon: L.divIcon({
          className: 'band-marker',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      });

      marker.bindPopup(function () {
        return createPopupContent(band);
      }, {
        maxWidth: 320,
        minWidth: 260,
        closeButton: true
      });

      markerRefs[band.nr] = marker;
      markers.addLayer(marker);
    });
  }

  // ========================================
  // Create Popup Content
  // ========================================

  function createPopupContent(band) {
    const fields = [];

    if (band.founding_date) {
      fields.push(fieldHTML('calendar', 'Data de Fundação', band.founding_date));
    }

    if (band.nr) {
      fields.push(fieldHTML('hash', 'N.º Filiação CMP', band.nr));
    }

    if (band.address || band.postal_code || band.city) {
      const addr = [band.address, band.postal_code, band.city].filter(Boolean).join(', ');
      fields.push(fieldHTML('map-pin', 'Morada', addr));
    }

    if (band.telefone) {
      const phones = band.telefone.split(';').map(function (p) {
        p = p.trim();
        return '<a href="tel:' + p + '">' + p + '</a>';
      }).join(' / ');
      fields.push(fieldHTML('phone', 'Telefone', phones));
    }

    if (band.telemovel) {
      const mobiles = band.telemovel.split(';').map(function (p) {
        p = p.trim();
        return '<a href="tel:' + p + '">' + p + '</a>';
      }).join(' / ');
      fields.push(fieldHTML('smartphone', 'Telemóvel', mobiles));
    }

    if (band.email) {
      const emails = band.email.split(';').map(function (e) {
        e = e.trim();
        return '<a href="mailto:' + e + '">' + e + '</a>';
      }).join('<br>');
      fields.push(fieldHTML('mail', 'Email', emails));
    }

    const hasFields = fields.length > 0;

    return '<div class="popup-card">' +
      '<div class="popup-header">' +
      '<div class="popup-nr">Filiação CMP N.º ' + band.nr + '</div>' +
      '<div class="popup-name">' + escapeHtml(band.name) + '</div>' +
      '</div>' +
      (hasFields
        ? '<div class="popup-body">' + fields.join('') + '</div>'
        : '<div class="popup-empty">Sem informações de contacto disponíveis.</div>') +
      '</div>';
  }

  function fieldHTML(icon, label, value) {
    return '<div class="popup-field">' +
      '<svg class="popup-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      getIconPath(icon) +
      '</svg>' +
      '<div class="popup-field-content">' +
      '<span class="popup-field-label">' + label + '</span>' +
      '<span class="popup-field-value">' + value + '</span>' +
      '</div></div>';
  }

  function getIconPath(name) {
    const icons = {
      'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
      'hash': '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>',
      'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
      'smartphone': '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
      'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'
    };
    return icons[name] || '';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========================================
  // Statistics
  // ========================================

  function updateStats() {
    // Total bands
    bandCountEl.textContent = bands.length;

    // Unique cities
    const cities = new Set();
    bands.forEach(function (b) {
      if (b.city) cities.add(b.city.toUpperCase());
    });
    cityCountEl.textContent = cities.size;

    // Oldest band
    let oldest = null;
    let oldestDate = new Date();
    bands.forEach(function (b) {
      if (b.founding_date) {
        const parts = b.founding_date.split('/');
        if (parts.length === 3) {
          const d = new Date(parts[2], parts[1] - 1, parts[0]);
          if (d < oldestDate) {
            oldestDate = d;
            oldest = b;
          }
        }
      }
    });
    if (oldest) {
      oldestBandEl.textContent = oldestDate.getFullYear();
      oldestBandEl.title = oldest.name + ' (' + oldest.founding_date + ')';
    }
  }

  // ========================================
  // Search
  // ========================================

  searchToggle.addEventListener('click', function () {
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
      searchInput.focus();
    }
  });

  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  searchInput.addEventListener('input', function () {
    const query = this.value.trim().toLowerCase();
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    const results = bands.filter(function (b) {
      return b.name.toLowerCase().includes(query) ||
        (b.city && b.city.toLowerCase().includes(query)) ||
        (b.postal_code && b.postal_code.includes(query)) ||
        (b.nr && b.nr.toString().includes(query));
    }).slice(0, 15);

    searchResults.innerHTML = results.map(function (b) {
      return '<div class="search-result-item" data-nr="' + b.nr + '">' +
        '<span class="result-nr">#' + b.nr + '</span>' +
        '<span class="result-name">' + escapeHtml(b.name) + '</span>' +
        '<span class="result-city">' + escapeHtml(b.city || '') + '</span>' +
        '</div>';
    }).join('');
  });

  searchResults.addEventListener('click', function (e) {
    const item = e.target.closest('.search-result-item');
    if (!item) return;

    const nr = item.dataset.nr;
    const band = bands.find(function (b) { return b.nr === nr; });
    if (!band || !band.lat || !band.lng) return;

    // Zoom to band
    map.setView([band.lat, band.lng], 15, { animate: true });

    // Open popup
    const marker = markerRefs[nr];
    if (marker) {
      markers.zoomToShowLayer(marker, function () {
        marker.openPopup();
      });
    }

    // Close search
    searchBar.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  // Close search on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      searchBar.classList.remove('active');
      bandPanel.classList.remove('active');
    }
  });

  // ========================================
  // Panel
  // ========================================

  panelClose.addEventListener('click', function () {
    bandPanel.classList.remove('active');
  });

  // ========================================
  // Init
  // ========================================

  initMap();
  loadBands();

})();
