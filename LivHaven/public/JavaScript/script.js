// Centralized initialization for page behaviors
// Each feature is implemented in a small init* function and invoked on DOMContentLoaded

// ===============================
// Form validation
// ===============================
function initFormValidation() {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
}


// ===============================
// Card click navigation
// ===============================
function initCardNavigation() {
  const cards = document.querySelectorAll('.listing-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id) window.location.href = `/listing/${id}`;
    });
  });
}


// ===============================
// Navbar Button Message Animation
// ===============================
function initNavBtnAnimation() {
  const navBtn = document.getElementById('nav-btn');
  if (!navBtn) return;
  const hasFlash = document.querySelectorAll('.alert').length > 0;
  if (!hasFlash) {
    setTimeout(() => {
      navBtn.className = 'btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm';
      navBtn.innerHTML = `Welcome to LivHaven! <i class="fa-solid fa-magnifying-glass-location"></i>`;
    }, 4000);
  }
}


// ===============================
// Category Filter Functionality
// ===============================
function initFilters() {
  const filters = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.listing-card');

  const normalize = text =>
    (text || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]/g, '');

  const normalizeBare = text => normalize(text).replace(/[-_]+/g, '');

  const applyFilter = category => {
    const normalized = normalize(category);
    const normalizedBare = normalizeBare(category);

    cards.forEach(card => {
      const col = card.closest('[class*="col-"]');
      const cardCategory = normalize(card.dataset.category);
      const cardCategoryBare = normalizeBare(card.dataset.category);

      const match =
        normalized === '' ||
        normalized === 'all' ||
        cardCategory === normalized ||
        cardCategoryBare === normalizedBare;

      (col || card).classList.toggle('hide', !match);
    });
  };

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      const category = filter.dataset.category || filter.textContent.trim();
      console.debug('[filter] clicked', { category, normalized: normalize(category), normalizedBare: normalizeBare(category) });
      applyFilter(category);
    });
  });

  const active = document.querySelector('.filter.active');
  applyFilter(active ? active.dataset.category || '' : '');
}


// ===============================
// Price Toggle
// ===============================
function initPriceToggle() {
  const priceSwitch = document.getElementById('switchCheckDefault');
  if (!priceSwitch) return;

  priceSwitch.addEventListener('change', () => {
    const titles = document.querySelectorAll('.list-title');
    titles.forEach(title => {
      const baseTitle = title.getAttribute('data-base-title') || title.textContent.split(' - ₹')[0];
      const price = title.getAttribute('data-price') || '';
      if (priceSwitch.checked && price) {
        title.textContent = `${baseTitle} - ₹ ${price}`;
      } else {
        title.textContent = baseTitle;
      }
      title.setAttribute('data-base-title', baseTitle);
    });
  });
}


// ===============================
// Country Search (center navbar)
// ===============================
function initCountrySearch() {
  const navBtn = document.getElementById('nav-btn');
  const countryInput = document.getElementById('country-input');
  if (!navBtn || !countryInput) return;

  navBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (!country) {
      countryInput.classList.add('is-invalid');
      setTimeout(() => countryInput.classList.remove('is-invalid'), 1500);
      countryInput.focus();
      return;
    }
    // Replace with real search logic when available
    alert(`Searching listings in ${country}...`);
  });

  countryInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') navBtn.click();
  });
}


// Single entry point
document.addEventListener('DOMContentLoaded', () => {
  initFormValidation();
  initCardNavigation();
  initNavBtnAnimation();
  initFilters();
  initPriceToggle();
  initCountrySearch();
});
