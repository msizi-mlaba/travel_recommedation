/**
 * travel_recommendation.js
 * JavaScript logic for TravelBloom travel recommendation website
 */


// Local backup data in case fetch from local file fails in certain browser environments
const FALLBACK_TRAVEL_DATA = {
  countries: [
    {
      id: 1,
      name: "Australia",
      cities: [
        {
          name: "Sydney, Australia",
          imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1000&q=80",
          description: "A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge.",
          timeZone: "Australia/Sydney"
        },
        {
          name: "Melbourne, Australia",
          imageUrl: "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1000&q=80",
          description: "A cultural hub famous for its art, food, and diverse neighborhoods.",
          timeZone: "Australia/Melbourne"
        }
      ]
    },
    {
      id: 2,
      name: "Japan",
      cities: [
        {
          name: "Tokyo, Japan",
          imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
          description: "A bustling metropolis blending tradition and modernity, famous for its cherry blossoms and rich culture.",
          timeZone: "Asia/Tokyo"
        },
        {
          name: "Kyoto, Japan",
          imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
          description: "Known for its historic temples, gardens, and traditional tea houses.",
          timeZone: "Asia/Tokyo"
        }
      ]
    },
    {
      id: 3,
      name: "Brazil",
      cities: [
        {
          name: "Rio de Janeiro, Brazil",
          imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1000&q=80",
          description: "A lively city known for its stunning beaches, vibrant carnival celebrations, and iconic landmarks.",
          timeZone: "America/Sao_Paulo"
        },
        {
          name: "São Paulo, Brazil",
          imageUrl: "https://images.unsplash.com/photo-1578059427060-4326dd931c81?auto=format&fit=crop&w=1000&q=80",
          description: "The financial hub with diverse culture, arts, and a vibrant nightlife.",
          timeZone: "America/Sao_Paulo"
        }
      ]
    }
  ],
  temples: [
    {
      id: 1,
      name: "Angkor Wat, Cambodia",
      imageUrl: "https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=1000&q=80",
      description: "A UNESCO World Heritage site and the largest religious monument in the world.",
      timeZone: "Asia/Phnom_Penh"
    },
    {
      id: 2,
      name: "Taj Mahal, India",
      imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80",
      description: "An iconic symbol of love and a masterpiece of Mughal architecture.",
      timeZone: "Asia/Kolkata"
    }
  ],
  beaches: [
    {
      id: 1,
      name: "Bora Bora, French Polynesia",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      description: "An island known for its stunning turquoise waters and luxurious overwater bungalows.",
      timeZone: "Pacific/Tahiti"
    },
    {
      id: 2,
      name: "Copacabana Beach, Brazil",
      imageUrl: "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=1000&q=80",
      description: "A famous beach in Rio de Janeiro, Brazil, with a vibrant atmosphere and scenic views.",
      timeZone: "America/Sao_Paulo"
    }
  ]
};

// Fetch the travel data from travel_recommendation_api.json
async function fetchTravelData() {
  try {
    const response = await fetch('travel_recommendation_api.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    travelData = await response.json();
    console.log('Successfully fetched travel_recommendation_api.json:', travelData);
  } catch (err) {
    console.warn('Could not fetch travel_recommendation_api.json directly, using bundled copy:', err);
    travelData = FALLBACK_TRAVEL_DATA;
  }
}

// Format live time string for a given timeZone
function getDestinationLocalTime(timeZone) {
  try {
    const options = {
      timeZone: timeZone || 'UTC',
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date().toLocaleTimeString('en-US', options);
  } catch (e) {
    return new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
  }
}

// Filter recommendations based on user keyword
function getRecommendations(query) {
  if (!travelData) return [];
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results = [];

  // 1. Any form of the word "beach" (e.g. beach, beaches, beaching)
  if (q.includes('beach')) {
    travelData.beaches.forEach(item => {
      results.push({
        name: item.name,
        imageUrl: item.imageUrl,
        description: item.description,
        category: 'Beach',
        timeZone: item.timeZone
      });
    });
    return results;
  }

  // 2. Any form of the word "temple" (e.g. temple, temples)
  if (q.includes('temple')) {
    travelData.temples.forEach(item => {
      results.push({
        name: item.name,
        imageUrl: item.imageUrl,
        description: item.description,
        category: 'Temple',
        timeZone: item.timeZone
      });
    });
    return results;
  }

  // 3. Any form of the word "country" or "countries"
  if (q.includes('countr')) {
    travelData.countries.forEach(country => {
      country.cities.forEach(city => {
        results.push({
          name: city.name,
          imageUrl: city.imageUrl,
          description: city.description,
          category: country.name,
          timeZone: city.timeZone
        });
      });
    });
    return results;
  }

  // 4. Specific country name search (e.g. "Australia", "Japan", "Brazil")
  const matchedCountry = travelData.countries.find(
    c => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())
  );
  if (matchedCountry) {
    matchedCountry.cities.forEach(city => {
      results.push({
        name: city.name,
        imageUrl: city.imageUrl,
        description: city.description,
        category: matchedCountry.name,
        timeZone: city.timeZone
      });
    });
    return results;
  }

  // 5. General search over cities
  travelData.countries.forEach(country => {
    country.cities.forEach(city => {
      if (city.name.toLowerCase().includes(q) || city.description.toLowerCase().includes(q)) {
        results.push({
          name: city.name,
          imageUrl: city.imageUrl,
          description: city.description,
          category: country.name,
          timeZone: city.timeZone
        });
      }
    });
  });

  // 6. Search over temples
  travelData.temples.forEach(item => {
    if (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
      if (!results.some(r => r.name === item.name)) {
        results.push({
          name: item.name,
          imageUrl: item.imageUrl,
          description: item.description,
          category: 'Temple',
          timeZone: item.timeZone
        });
      }
    }
  });

  // 7. Search over beaches
  travelData.beaches.forEach(item => {
    if (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
      if (!results.some(r => r.name === item.name)) {
        results.push({
          name: item.name,
          imageUrl: item.imageUrl,
          description: item.description,
          category: 'Beach',
          timeZone: item.timeZone
        });
      }
    }
  });

  return results;
}

// Render the search results into the DOM
function renderResults(results, query) {
  const homeHero = document.getElementById('home-hero-content');
  const resultsContainer = document.getElementById('recommendations-container');
  const resultsGrid = document.getElementById('recommendations-grid');
  const queryLabel = document.getElementById('results-query-label');
  const countLabel = document.getElementById('results-count-label');

  if (!resultsContainer || !resultsGrid) return;

  if (homeHero) {
    homeHero.style.display = 'none';
  }
  resultsContainer.style.display = 'block';

  if (queryLabel) queryLabel.textContent = query;
  if (countLabel) countLabel.textContent = `${results.length} ${results.length === 1 ? 'destination' : 'destinations'} found`;

  resultsGrid.innerHTML = '';

  if (results.length === 0) {
    resultsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; background: rgba(17,35,46,0.85); padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.18);">
        <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">No Destinations Found</h3>
        <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 16px;">We couldn't find recommendations matching "${escapeHtml(query)}". Try keywords like beach, temple, or country.</p>
        <div>
          <button class="tag-btn" onclick="executeSearch('beach')">Beaches</button>
          <button class="tag-btn" onclick="executeSearch('temple')">Temples</button>
          <button class="tag-btn" onclick="executeSearch('country')">Countries</button>
        </div>
      </div>
    `;
    return;
  }

  results.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card-destination';

    const localTime = getDestinationLocalTime(item.timeZone);

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" class="card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'">
        ${item.category ? `<span class="card-category-badge">${escapeHtml(item.category)}</span>` : ''}
        <span class="card-time-badge" id="time-badge-${index}">🕒 ${localTime}</span>
      </div>
      <div class="card-body">
        <div>
          <h3 class="card-title">${escapeHtml(item.name)}</h3>
          <p class="card-desc">${escapeHtml(item.description)}</p>
        </div>
        <div class="card-footer">
          <span style="font-size: 12px; color: rgba(255,255,255,0.6);">${escapeHtml(item.category || 'Destination')}</span>
          <button class="btn-visit" onclick="openDestinationModal('${escapeJsString(item.name)}', '${escapeJsString(item.description)}', '${escapeJsString(item.imageUrl)}')">Visit</button>
        </div>
      </div>
    `;

    resultsGrid.appendChild(card);
  });
}

// Clear search input and restore default Home hero view
function clearSearch() {
  const searchInput = document.getElementById('search-input');
  const homeHero = document.getElementById('home-hero-content');
  const resultsContainer = document.getElementById('recommendations-container');
  const resultsGrid = document.getElementById('recommendations-grid');

  if (searchInput) searchInput.value = '';
  if (resultsContainer) resultsContainer.style.display = 'none';
  if (resultsGrid) resultsGrid.innerHTML = '';
  if (homeHero) homeHero.style.display = 'block';
}

// Helper to execute search directly (used by quick buttons and form)
function executeSearch(keyword) {
  const searchInput = document.getElementById('search-input');
  const query = keyword !== undefined ? keyword : (searchInput ? searchInput.value : '');

  if (searchInput && keyword !== undefined) {
    searchInput.value = keyword;
  }

  if (!query.trim()) {
    clearSearch();
    return;
  }

  // If recommendations grid is not present on this page (e.g. on about_us.html or contact_us.html), redirect to index.html with query
  const resultsGrid = document.getElementById('recommendations-grid');
  if (!resultsGrid) {
    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    return;
  }

  // Switch to home tab if on another section
  showTab('home');

  const results = getRecommendations(query);
  renderResults(results, query);
}

// Utility to switch active view if in single-page mode
function showTab(tabName) {
  const homeSec = document.getElementById('section-home');
  const aboutSec = document.getElementById('section-about');
  const contactSec = document.getElementById('section-contact');

  const navHome = document.getElementById('nav-home');
  const navAbout = document.getElementById('nav-about');
  const navContact = document.getElementById('nav-contact');

  if (homeSec) homeSec.style.display = (tabName === 'home') ? 'block' : 'none';
  if (aboutSec) aboutSec.style.display = (tabName === 'about') ? 'block' : 'none';
  if (contactSec) contactSec.style.display = (tabName === 'contact') ? 'block' : 'none';

  if (navHome) navHome.classList.toggle('active', tabName === 'home');
  if (navAbout) navAbout.classList.toggle('active', tabName === 'about');
  if (navContact) navContact.classList.toggle('active', tabName === 'contact');
}

// Open booking modal
function openBookingModal(destinationName) {
  const modal = document.getElementById('booking-modal');
  const destInput = document.getElementById('book-destination');
  if (modal) {
    modal.style.display = 'flex';
    if (destInput && destinationName) {
      destInput.value = destinationName;
    }
  }
}

// Close booking modal
function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.style.display = 'none';
}

// Open destination detail modal
function openDestinationModal(name, description, imageUrl) {
  const modal = document.getElementById('destination-modal');
  if (!modal) return;

  const titleEl = document.getElementById('modal-dest-title');
  const descEl = document.getElementById('modal-dest-desc');
  const imgEl = document.getElementById('modal-dest-img');

  if (titleEl) titleEl.textContent = name;
  if (descEl) descEl.textContent = description;
  if (imgEl) imgEl.src = imageUrl;

  modal.style.display = 'flex';
}

// Close destination detail modal
function closeDestinationModal() {
  const modal = document.getElementById('destination-modal');
  if (modal) modal.style.display = 'none';
}

// Copy Live Deployed URL
function copyLiveUrl() {
  const btn = document.getElementById('btn-copy-url');
  navigator.clipboard.writeText(LIVE_URL).then(() => {
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }
  }).catch(() => {
    if (btn) {
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy URL'; }, 2000);
    }
  });
}

// Handle contact form submission
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name')?.value || '';
  const email = document.getElementById('contact-email')?.value || '';
  const message = document.getElementById('contact-message')?.value || '';

  const formBox = document.getElementById('contact-form-card');
  if (formBox) {
    formBox.innerHTML = `
      <div class="form-success-msg">
        <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Thank You, ${escapeHtml(name)}!</h3>
        <p>Your message has been prepared. Our TravelBloom team will reach out to you at <strong>${escapeHtml(email)}</strong> shortly.</p>
        <button class="btn-visit" style="margin-top: 16px;" onclick="window.location.reload()">Send Another Message</button>
      </div>
    `;
  }

  // Open email client
  const subject = encodeURIComponent(`Travel Inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:contact@travelbloom.com?subject=${subject}&body=${body}`;
}

// HTML escape helper
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJsString(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  fetchTravelData();

  // Wire up search button
  const searchBtn = document.getElementById('search-button') || document.getElementById('btn-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => executeSearch());
  }

  // Wire up clear button
  const clearBtn = document.getElementById('clear-button') || document.getElementById('btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => clearSearch());
  }

  // Wire up enter key on search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }

  // Wire up copy button
  const copyBtn = document.getElementById('btn-copy-url');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyLiveUrl);
  }

  // Update live URL display if browser URL is valid
  const urlDisplay = document.getElementById('live-url-display');
  if (urlDisplay && window.location.href && !window.location.href.includes('localhost')) {
    urlDisplay.textContent = window.location.href.split('?')[0];
    urlDisplay.href = window.location.href.split('?')[0];
  }

  // Check URL parameter ?search=
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam) {
    setTimeout(() => {
      executeSearch(searchParam);
    }, 150);
  }
});
