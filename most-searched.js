(function () {
  const MONTH = 'March';

  // 1x1 transparent GIF — placeholder until real images are added
  const BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  const categories = [
    {
      label: 'SUV',
      viewAllLabel: 'View All SUV Cars',
      cars: [
        { name: 'Renault Duster',  price: '₹10.49 - 18.69 Lakh', launched: 'Mar 17, 2026' },
        { name: 'Tata Punch',      price: '₹5.60 - 10.55 Lakh' },
        { name: 'Tata Sierra',     price: '₹11.49 - 21.29 Lakh' },
        { name: 'Tata Nexon',      price: '₹7.32 - 14.15 Lakh' },
        { name: 'Hyundai Creta',   price: '₹11.11 - 20.15 Lakh' },
        { name: 'Maruti Brezza',   price: '₹8.34 - 14.14 Lakh' },
      ]
    },
    {
      label: 'Hatchback',
      viewAllLabel: 'View All Hatchback Cars',
      cars: [
        { name: 'Maruti Swift',    price: '₹6.49 - 9.64 Lakh' },
        { name: 'Hyundai i20',     price: '₹7.04 - 11.21 Lakh' },
        { name: 'Tata Altroz',     price: '₹6.59 - 10.96 Lakh' },
        { name: 'Maruti Baleno',   price: '₹6.61 - 9.88 Lakh' },
        { name: 'Toyota Glanza',   price: '₹6.73 - 10.03 Lakh' },
      ]
    },
    {
      label: 'Sedan',
      viewAllLabel: 'View All Sedan Cars',
      cars: [
        { name: 'Maruti Dzire',    price: '₹6.79 - 9.94 Lakh' },
        { name: 'Honda Amaze',     price: '₹8.00 - 10.40 Lakh' },
        { name: 'Honda City',      price: '₹11.90 - 16.62 Lakh' },
        { name: 'Hyundai Aura',    price: '₹6.49 - 9.05 Lakh' },
        { name: 'VW Virtus',       price: '₹11.56 - 19.41 Lakh' },
      ]
    },
    {
      label: 'MUV',
      viewAllLabel: 'View All MUV Cars',
      cars: [
        { name: 'Maruti Ertiga',        price: '₹8.69 - 13.03 Lakh' },
        { name: 'Kia Carens',           price: '₹10.69 - 19.99 Lakh' },
        { name: 'Toyota Innova Crysta', price: '₹19.77 - 26.13 Lakh' },
        { name: 'Mahindra Marazzo',     price: '₹14.78 - 17.59 Lakh' },
      ]
    },
    {
      label: 'Luxury',
      viewAllLabel: 'View All Luxury Cars',
      cars: [
        { name: 'Mercedes-Benz C-Class', price: '₹57.00 - 62.00 Lakh' },
        { name: 'BMW 3 Series',          price: '₹46.90 - 60.50 Lakh' },
        { name: 'Audi Q5',               price: '₹67.66 - 80.60 Lakh' },
        { name: 'Volvo XC40',            price: '₹48.90 - 55.90 Lakh' },
      ]
    }
  ];

  const tabsEl       = document.querySelector('.ms-tabs');
  const containersEl = document.querySelector('.ms-panels-container');

  if (!tabsEl || !containersEl) return;

  categories.forEach(function (cat, i) {
    // ── Tab button ──────────────────────────────────────────────────
    var btn = document.createElement('button');
    btn.className   = 'ms-tab' + (i === 0 ? ' active' : '');
    btn.textContent = cat.label;
    btn.dataset.index = i;
    tabsEl.appendChild(btn);

    // ── Panel ───────────────────────────────────────────────────────
    var panel = document.createElement('div');
    panel.className   = 'ms-panel' + (i === 0 ? ' active' : '');
    panel.dataset.index = i;

    // Cards track
    var track = document.createElement('div');
    track.className = 'ms-cards-track';

    cat.cars.forEach(function (car) {
      var card = document.createElement('div');
      card.className = 'ms-card';

      var badge = car.launched
        ? '<span class="ms-launch-badge">LAUNCHED ON : ' + car.launched + '</span>'
        : '';

      card.innerHTML =
        '<div class="ms-card-img-wrap">' +
          badge +
          '<img class="ms-car-img" src="' + BLANK + '" alt="' + car.name + '">' +
        '</div>' +
        '<div class="ms-card-body">' +
          '<div class="ms-car-name">' + car.name + '</div>' +
          '<div class="ms-car-price">' + car.price + '<sup>*</sup></div>' +
          '<a href="#" class="ms-offers-btn">View ' + MONTH + ' Offers</a>' +
        '</div>';

      track.appendChild(card);
    });

    // Scroll buttons
    var prevBtn = document.createElement('button');
    prevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.setAttribute('aria-label', 'Scroll left');

    var nextBtn = document.createElement('button');
    nextBtn.className = 'ms-scroll-btn ms-scroll-next';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.setAttribute('aria-label', 'Scroll right');

    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -300, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: 300, behavior: 'smooth' });
    });

    // Update arrow visibility
    function updateArrows() {
      prevBtn.style.opacity = track.scrollLeft > 0 ? '1' : '0';
      prevBtn.style.pointerEvents = track.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      nextBtn.style.opacity = atEnd ? '0' : '1';
      nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }

    track.addEventListener('scroll', updateArrows, { passive: true });

    panel.appendChild(prevBtn);
    panel.appendChild(track);
    panel.appendChild(nextBtn);

    // View All link
    var viewAll = document.createElement('a');
    viewAll.href      = '#';
    viewAll.className = 'ms-view-all';
    viewAll.innerHTML = cat.viewAllLabel + ' <span class="ms-view-arrow">&#x27A4;</span>';
    panel.appendChild(viewAll);

    containersEl.appendChild(panel);

    // Set initial arrow state after DOM is ready
    setTimeout(updateArrows, 0);
  });

  // ── Electric Cars Section ───────────────────────────────────────
  var electricCars = [
    { name: 'Maruti Suzuki e Vitara', price: '₹15.99 - 20.01 Lakh' },
    { name: 'Mahindra BE 6',          price: '₹18.90 - 28.49 Lakh' },
    { name: 'Tata Punch EV',          price: '₹9.69 - 12.59 Lakh'  },
    { name: 'Mahindra XEV 9e',        price: '₹21.90 - 31.25 Lakh' },
  ];

  var msContainer = document.querySelector('.ms-container');
  if (msContainer) {
    var evSection = document.createElement('div');
    evSection.className = 'ms-electric-section';

    var evTitle = document.createElement('h3');
    evTitle.className = 'ms-electric-title';
    evTitle.textContent = 'Electric cars';
    evSection.appendChild(evTitle);

    var evTrackWrap = document.createElement('div');
    evTrackWrap.className = 'ms-electric-track-wrap';

    var evTrack = document.createElement('div');
    evTrack.className = 'ms-cards-track';

    electricCars.forEach(function (car) {
      var card = document.createElement('div');
      card.className = 'ms-card';
      card.innerHTML =
        '<div class="ms-card-img-wrap">' +
          '<img class="ms-car-img" src="' + BLANK + '" alt="' + car.name + '">' +
        '</div>' +
        '<div class="ms-card-body">' +
          '<div class="ms-car-name">' + car.name + '</div>' +
          '<div class="ms-car-price">' + car.price + '<sup>*</sup></div>' +
          '<a href="#" class="ms-offers-btn">View ' + MONTH + ' Offers</a>' +
        '</div>';
      evTrack.appendChild(card);
    });

    var evNextBtn = document.createElement('button');
    evNextBtn.className = 'ms-scroll-btn ms-scroll-next';
    evNextBtn.innerHTML = '&#8250;';
    evNextBtn.setAttribute('aria-label', 'Scroll right');

    var evPrevBtn = document.createElement('button');
    evPrevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    evPrevBtn.innerHTML = '&#8249;';
    evPrevBtn.setAttribute('aria-label', 'Scroll left');

    evPrevBtn.addEventListener('click', function () {
      evTrack.scrollBy({ left: -300, behavior: 'smooth' });
    });
    evNextBtn.addEventListener('click', function () {
      evTrack.scrollBy({ left: 300, behavior: 'smooth' });
    });

    function updateEvArrows() {
      evPrevBtn.style.opacity = evTrack.scrollLeft > 0 ? '1' : '0';
      evPrevBtn.style.pointerEvents = evTrack.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = evTrack.scrollLeft + evTrack.clientWidth >= evTrack.scrollWidth - 4;
      evNextBtn.style.opacity = atEnd ? '0' : '1';
      evNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }
    evTrack.addEventListener('scroll', updateEvArrows, { passive: true });
    setTimeout(updateEvArrows, 0);

    evTrackWrap.appendChild(evPrevBtn);
    evTrackWrap.appendChild(evTrack);
    evTrackWrap.appendChild(evNextBtn);
    evSection.appendChild(evTrackWrap);

    var evViewAll = document.createElement('a');
    evViewAll.href = '#';
    evViewAll.className = 'ms-view-all';
    evViewAll.innerHTML = 'View All Electric Cars <span class="ms-view-arrow">&#x27A4;</span>';
    evSection.appendChild(evViewAll);

    msContainer.appendChild(evSection);
  }

  // ── Upcoming Cars Section ────────────────────────────────────────
  var upcomingCars = [
    { name: 'Lexus ES',                    price: '₹89.99 Lakh',   estimated: true,  expectedLaunch: 'Mar 31, 2026', type: 'New Variant', typeIcon: '&#x1F5D3;' },
    { name: 'Volkswagen Taigun Facelift',  price: null,            estimated: false, expectedLaunch: 'Apr 9, 2026',  type: 'Facelift',    typeIcon: '&#x1F536;' },
    { name: 'Mercedes-Benz CLA Electric',  price: '₹55 - 59 Lakh', estimated: true,  expectedLaunch: 'Apr 15, 2026', type: 'Electric',    typeIcon: '&#x26A1;' },
    { name: 'Toyota Urban Cruiser EBELLA', price: '₹18 - 21 Lakh', estimated: true,  expectedLaunch: 'Apr 15, 2026', type: 'Electric',    typeIcon: '&#x26A1;' },
  ];

  if (msContainer) {
    var upSection = document.createElement('div');
    upSection.className = 'ms-electric-section';

    var upTitle = document.createElement('h3');
    upTitle.className = 'ms-electric-title';
    upTitle.textContent = 'Upcoming cars';
    upSection.appendChild(upTitle);

    var upTrackWrap = document.createElement('div');
    upTrackWrap.className = 'ms-electric-track-wrap';

    var upTrack = document.createElement('div');
    upTrack.className = 'ms-cards-track';

    upcomingCars.forEach(function (car) {
      var card = document.createElement('div');
      card.className = 'ms-card';

      var priceHtml = car.price
        ? car.price + (car.estimated ? ' <span class="ms-price-estimated">Estimated</span>' : '')
        : 'Price To Be Announced';

      var typeClass = car.type === 'Facelift' ? 'ms-type-badge ms-type-facelift'
                    : car.type === 'Electric'  ? 'ms-type-badge ms-type-electric'
                    : 'ms-type-badge ms-type-variant';

      card.innerHTML =
        '<div class="ms-card-img-wrap">' +
          '<span class="ms-launch-badge">EXPECTED LAUNCH : ' + car.expectedLaunch + '</span>' +
          '<img class="ms-car-img" src="' + BLANK + '" alt="' + car.name + '">' +
          '<span class="' + typeClass + '">' + car.typeIcon + ' ' + car.type + '</span>' +
        '</div>' +
        '<div class="ms-card-body">' +
          '<div class="ms-car-name">' + car.name + '</div>' +
          '<div class="ms-car-price">' + priceHtml + '</div>' +
          '<a href="#" class="ms-offers-btn ms-alert-btn">Alert Me When Launched</a>' +
        '</div>';

      upTrack.appendChild(card);
    });

    var upNextBtn = document.createElement('button');
    upNextBtn.className = 'ms-scroll-btn ms-scroll-next';
    upNextBtn.innerHTML = '&#8250;';
    upNextBtn.setAttribute('aria-label', 'Scroll right');

    var upPrevBtn = document.createElement('button');
    upPrevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    upPrevBtn.innerHTML = '&#8249;';
    upPrevBtn.setAttribute('aria-label', 'Scroll left');

    upPrevBtn.addEventListener('click', function () {
      upTrack.scrollBy({ left: -300, behavior: 'smooth' });
    });
    upNextBtn.addEventListener('click', function () {
      upTrack.scrollBy({ left: 300, behavior: 'smooth' });
    });

    function updateUpArrows() {
      upPrevBtn.style.opacity = upTrack.scrollLeft > 0 ? '1' : '0';
      upPrevBtn.style.pointerEvents = upTrack.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = upTrack.scrollLeft + upTrack.clientWidth >= upTrack.scrollWidth - 4;
      upNextBtn.style.opacity = atEnd ? '0' : '1';
      upNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }
    upTrack.addEventListener('scroll', updateUpArrows, { passive: true });
    setTimeout(updateUpArrows, 0);

    upTrackWrap.appendChild(upPrevBtn);
    upTrackWrap.appendChild(upTrack);
    upTrackWrap.appendChild(upNextBtn);
    upSection.appendChild(upTrackWrap);

    var upViewAll = document.createElement('a');
    upViewAll.href = '#';
    upViewAll.className = 'ms-view-all';
    upViewAll.innerHTML = 'View All Upcoming Cars <span class="ms-view-arrow">&#x27A4;</span>';
    upSection.appendChild(upViewAll);

    msContainer.appendChild(upSection);
  }

  // ── Latest Cars Section ──────────────────────────────────────────
  var latestCars = [
    { name: 'Skoda Kushaq',   price: '₹10.69 - 18.99 Lakh', launched: 'Mar 21, 2026', types: [] },
    { name: 'Tata Harrier EV', price: '₹21.49 - 30.23 Lakh', launched: 'Mar 21, 2026', types: ['Electric', 'New Variant'] },
    { name: 'Hyundai Exter',  price: '₹5.80 - 9.42 Lakh',   launched: 'Mar 20, 2026', types: ['Facelift'] },
    { name: 'Lexus ES',       price: '₹89.99 Lakh',          launched: 'Mar 20, 2026', types: ['Electric', 'Facelift'] },
  ];

  var typeIconMap = { 'Electric': '&#x26A1;', 'New Variant': '&#x1F5D3;', 'Facelift': '&#x1F536;' };
  var typeClassMap = { 'Electric': 'ms-type-electric', 'New Variant': 'ms-type-variant', 'Facelift': 'ms-type-facelift' };

  if (msContainer) {
    var ltSection = document.createElement('div');
    ltSection.className = 'ms-electric-section';

    var ltTitle = document.createElement('h3');
    ltTitle.className = 'ms-electric-title';
    ltTitle.textContent = 'Latest cars';
    ltSection.appendChild(ltTitle);

    var ltTrackWrap = document.createElement('div');
    ltTrackWrap.className = 'ms-electric-track-wrap';

    var ltTrack = document.createElement('div');
    ltTrack.className = 'ms-cards-track';

    latestCars.forEach(function (car) {
      var card = document.createElement('div');
      card.className = 'ms-card';

      var typeBadgesHtml = car.types.map(function (t) {
        return '<span class="ms-type-badge ' + (typeClassMap[t] || '') + '">' + (typeIconMap[t] || '') + ' ' + t + '</span>';
      }).join('');

      card.innerHTML =
        '<div class="ms-card-img-wrap">' +
          '<span class="ms-launch-badge">LAUNCHED ON : ' + car.launched + '</span>' +
          '<img class="ms-car-img" src="' + BLANK + '" alt="' + car.name + '">' +
          (typeBadgesHtml ? '<div class="ms-type-badges-row">' + typeBadgesHtml + '</div>' : '') +
        '</div>' +
        '<div class="ms-card-body">' +
          '<div class="ms-car-name">' + car.name + '</div>' +
          '<div class="ms-car-price">' + car.price + '<sup>*</sup></div>' +
          '<a href="#" class="ms-offers-btn">View ' + MONTH + ' Offers</a>' +
        '</div>';

      ltTrack.appendChild(card);
    });

    var ltNextBtn = document.createElement('button');
    ltNextBtn.className = 'ms-scroll-btn ms-scroll-next';
    ltNextBtn.innerHTML = '&#8250;';
    ltNextBtn.setAttribute('aria-label', 'Scroll right');

    var ltPrevBtn = document.createElement('button');
    ltPrevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    ltPrevBtn.innerHTML = '&#8249;';
    ltPrevBtn.setAttribute('aria-label', 'Scroll left');

    ltPrevBtn.addEventListener('click', function () {
      ltTrack.scrollBy({ left: -300, behavior: 'smooth' });
    });
    ltNextBtn.addEventListener('click', function () {
      ltTrack.scrollBy({ left: 300, behavior: 'smooth' });
    });

    function updateLtArrows() {
      ltPrevBtn.style.opacity = ltTrack.scrollLeft > 0 ? '1' : '0';
      ltPrevBtn.style.pointerEvents = ltTrack.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = ltTrack.scrollLeft + ltTrack.clientWidth >= ltTrack.scrollWidth - 4;
      ltNextBtn.style.opacity = atEnd ? '0' : '1';
      ltNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }
    ltTrack.addEventListener('scroll', updateLtArrows, { passive: true });
    setTimeout(updateLtArrows, 0);

    ltTrackWrap.appendChild(ltPrevBtn);
    ltTrackWrap.appendChild(ltTrack);
    ltTrackWrap.appendChild(ltNextBtn);
    ltSection.appendChild(ltTrackWrap);

    var ltViewAll = document.createElement('a');
    ltViewAll.href = '#';
    ltViewAll.className = 'ms-view-all';
    ltViewAll.innerHTML = 'View All Latest Cars <span class="ms-view-arrow">&#x27A4;</span>';
    ltSection.appendChild(ltViewAll);

    msContainer.appendChild(ltSection);
  }

  // ── Popular Brands Section ───────────────────────────────────────
  var popularBrands = [
    { name: 'Maruti Suzuki' },
    { name: 'Tata' },
    { name: 'Kia' },
    { name: 'Toyota' },
    { name: 'Hyundai' },
    { name: 'Mahindra' },
  ];

  if (msContainer) {
    var brSection = document.createElement('div');
    brSection.className = 'ms-electric-section';

    var brTitle = document.createElement('h3');
    brTitle.className = 'ms-electric-title';
    brTitle.textContent = 'Popular brands';
    brSection.appendChild(brTitle);

    var brTrackWrap = document.createElement('div');
    brTrackWrap.className = 'ms-electric-track-wrap';

    var brTrack = document.createElement('div');
    brTrack.className = 'ms-brand-track';

    popularBrands.forEach(function (brand) {
      var card = document.createElement('a');
      card.href = '#';
      card.className = 'ms-brand-card';
      card.innerHTML =
        '<div class="ms-brand-logo-wrap">' +
          '<img class="ms-brand-logo" src="' + BLANK + '" alt="' + brand.name + ' logo">' +
        '</div>' +
        '<span class="ms-brand-name">' + brand.name + '</span>';
      brTrack.appendChild(card);
    });

    var brNextBtn = document.createElement('button');
    brNextBtn.className = 'ms-scroll-btn ms-scroll-next';
    brNextBtn.innerHTML = '&#8250;';
    brNextBtn.setAttribute('aria-label', 'Scroll right');

    var brPrevBtn = document.createElement('button');
    brPrevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    brPrevBtn.innerHTML = '&#8249;';
    brPrevBtn.setAttribute('aria-label', 'Scroll left');

    brPrevBtn.addEventListener('click', function () {
      brTrack.scrollBy({ left: -300, behavior: 'smooth' });
    });
    brNextBtn.addEventListener('click', function () {
      brTrack.scrollBy({ left: 300, behavior: 'smooth' });
    });

    function updateBrArrows() {
      brPrevBtn.style.opacity = brTrack.scrollLeft > 0 ? '1' : '0';
      brPrevBtn.style.pointerEvents = brTrack.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = brTrack.scrollLeft + brTrack.clientWidth >= brTrack.scrollWidth - 4;
      brNextBtn.style.opacity = atEnd ? '0' : '1';
      brNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }
    brTrack.addEventListener('scroll', updateBrArrows, { passive: true });
    setTimeout(updateBrArrows, 0);

    brTrackWrap.appendChild(brPrevBtn);
    brTrackWrap.appendChild(brTrack);
    brTrackWrap.appendChild(brNextBtn);
    brSection.appendChild(brTrackWrap);

    var brViewAll = document.createElement('a');
    brViewAll.href = '#';
    brViewAll.className = 'ms-view-all';
    brViewAll.innerHTML = 'View All Brands <span class="ms-view-arrow">&#x27A4;</span>';
    brSection.appendChild(brViewAll);

    msContainer.appendChild(brSection);
  }

  // ── Compare Section ──────────────────────────────────────────────
  var comparisons = [
    {
      car1: { brand: 'Nissan',        model: 'Gravite', price: '₹5.65 - 8.94 Lakh' },
      car2: { brand: 'Renault',       model: 'Triber',  price: '₹5.76 - 8.60 Lakh' },
    },
    {
      car1: { brand: 'Tata',          model: 'Punch',   price: '₹5.60 - 10.55 Lakh' },
      car2: { brand: 'Tata',          model: 'Nexon',   price: '₹7.32 - 14.15 Lakh' },
    },
    {
      car1: { brand: 'Maruti Suzuki', model: 'Baleno',  price: '₹5.99 - 9.10 Lakh' },
      car2: { brand: 'Maruti Suzuki', model: 'FRONX',   price: '₹6.85 - 11.98 Lakh' },
    },
  ];

  if (msContainer) {
    var cmpSection = document.createElement('div');
    cmpSection.className = 'ms-electric-section';

    var cmpTitle = document.createElement('h3');
    cmpTitle.className = 'ms-electric-title';
    cmpTitle.textContent = 'Compare car';
    cmpSection.appendChild(cmpTitle);

    var cmpTrackWrap = document.createElement('div');
    cmpTrackWrap.className = 'ms-electric-track-wrap';

    var cmpTrack = document.createElement('div');
    cmpTrack.className = 'ms-compare-track';

    comparisons.forEach(function (cmp) {
      var card = document.createElement('div');
      card.className = 'ms-compare-card';
      card.innerHTML =
        '<div class="ms-compare-img-row">' +
          '<img class="ms-compare-img" src="' + BLANK + '" alt="' + cmp.car1.model + '">' +
          '<span class="ms-vs-badge">VS</span>' +
          '<img class="ms-compare-img ms-compare-img-right" src="' + BLANK + '" alt="' + cmp.car2.model + '">' +
        '</div>' +
        '<div class="ms-compare-info-row">' +
          '<div class="ms-compare-car">' +
            '<span class="ms-compare-brand">' + cmp.car1.brand + '</span>' +
            '<span class="ms-compare-model">' + cmp.car1.model + '</span>' +
            '<span class="ms-compare-price">' + cmp.car1.price + ' <sup>*</sup></span>' +
          '</div>' +
          '<div class="ms-compare-car ms-compare-car-right">' +
            '<span class="ms-compare-brand">' + cmp.car2.brand + '</span>' +
            '<span class="ms-compare-model">' + cmp.car2.model + '</span>' +
            '<span class="ms-compare-price">' + cmp.car2.price + ' <sup>*</sup></span>' +
          '</div>' +
        '</div>' +
        '<a href="#" class="ms-offers-btn">' + cmp.car1.model + ' vs ' + cmp.car2.model + '</a>';
      cmpTrack.appendChild(card);
    });

    var cmpNextBtn = document.createElement('button');
    cmpNextBtn.className = 'ms-scroll-btn ms-scroll-next';
    cmpNextBtn.innerHTML = '&#8250;';
    cmpNextBtn.setAttribute('aria-label', 'Scroll right');

    var cmpPrevBtn = document.createElement('button');
    cmpPrevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    cmpPrevBtn.innerHTML = '&#8249;';
    cmpPrevBtn.setAttribute('aria-label', 'Scroll left');

    cmpPrevBtn.addEventListener('click', function () {
      cmpTrack.scrollBy({ left: -360, behavior: 'smooth' });
    });
    cmpNextBtn.addEventListener('click', function () {
      cmpTrack.scrollBy({ left: 360, behavior: 'smooth' });
    });

    function updateCmpArrows() {
      cmpPrevBtn.style.opacity = cmpTrack.scrollLeft > 0 ? '1' : '0';
      cmpPrevBtn.style.pointerEvents = cmpTrack.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = cmpTrack.scrollLeft + cmpTrack.clientWidth >= cmpTrack.scrollWidth - 4;
      cmpNextBtn.style.opacity = atEnd ? '0' : '1';
      cmpNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }
    cmpTrack.addEventListener('scroll', updateCmpArrows, { passive: true });
    setTimeout(updateCmpArrows, 0);

    cmpTrackWrap.appendChild(cmpPrevBtn);
    cmpTrackWrap.appendChild(cmpTrack);
    cmpTrackWrap.appendChild(cmpNextBtn);
    cmpSection.appendChild(cmpTrackWrap);

    var cmpViewAll = document.createElement('a');
    cmpViewAll.href = '#';
    cmpViewAll.className = 'ms-view-all';
    cmpViewAll.innerHTML = 'View All Car Comparisons <span class="ms-view-arrow">&#x27A4;</span>';
    cmpSection.appendChild(cmpViewAll);

    msContainer.appendChild(cmpSection);
  }

  // ── News Section ─────────────────────────────────────────────────
  var newsArticles = [
    {
      label: 'Hyundai Exter Facelift Variant-wise Colours',
      title: '2026 Hyundai Exter Colours Explained: Which Variants Get Wha...',
      desc:  'While colours like Golden Bronze and Titanium Black M are new, older Red...',
      author: 'Cardekho', date: 'Mar 24, 2026'
    },
    {
      label: 'New Renault Duster Authentic • Evolution Variant',
      title: 'New Renault Duster Authentic vs Evolution Variants Compared:...',
      desc:  'The Duster Authentic is a well-packaged base variant, the Evolution trim brings...',
      author: 'Bikramjit', date: 'Mar 24, 2026'
    },
    {
      label: 'Compared Renault Duster • Grand Vitara',
      title: 'New Renault Duster Vs Maruti Grand Vitara Compared: Which SU...',
      desc:  'They may look tough, but both SUVs differ quite a lot.',
      author: 'Vad', date: 'Mar 24, 2026'
    },
    {
      label: 'Hyundai Exter Facelift Variant-wise Powertrains',
      title: '2026 Hyundai Exter Variant-wise Engine And Gearbox Options E...',
      desc:  'The New Exter still gets the same engine and gearbox options as the pre-facelift...',
      author: 'Rohit', date: 'Mar 23, 2026'
    },
  ];

  if (msContainer) {
    var newsSection = document.createElement('div');
    newsSection.className = 'ms-electric-section';

    var newsTitle = document.createElement('h3');
    newsTitle.className = 'ms-electric-title';
    newsTitle.textContent = 'News to help choose your car';
    newsSection.appendChild(newsTitle);

    var newsTrackWrap = document.createElement('div');
    newsTrackWrap.className = 'ms-electric-track-wrap';

    var newsTrack = document.createElement('div');
    newsTrack.className = 'ms-news-track';

    newsArticles.forEach(function (article) {
      var card = document.createElement('div');
      card.className = 'ms-news-card';
      card.innerHTML =
        '<div class="ms-news-img-wrap">' +
          '<img class="ms-news-img" src="' + BLANK + '" alt="' + article.label + '">' +
          '<span class="ms-news-label">' + article.label + '</span>' +
        '</div>' +
        '<div class="ms-news-body">' +
          '<div class="ms-news-title">' + article.title + '</div>' +
          '<div class="ms-news-desc">' + article.desc + '</div>' +
          '<div class="ms-news-meta">By ' + article.author + ' &bull; ' + article.date + '</div>' +
        '</div>';
      newsTrack.appendChild(card);
    });

    var newsNextBtn = document.createElement('button');
    newsNextBtn.className = 'ms-scroll-btn ms-scroll-next';
    newsNextBtn.innerHTML = '&#8250;';
    newsNextBtn.setAttribute('aria-label', 'Scroll right');

    var newsPrevBtn = document.createElement('button');
    newsPrevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    newsPrevBtn.innerHTML = '&#8249;';
    newsPrevBtn.setAttribute('aria-label', 'Scroll left');

    newsPrevBtn.addEventListener('click', function () { newsTrack.scrollBy({ left: -300, behavior: 'smooth' }); });
    newsNextBtn.addEventListener('click', function () { newsTrack.scrollBy({ left: 300, behavior: 'smooth' }); });

    function updateNewsArrows() {
      newsPrevBtn.style.opacity = newsTrack.scrollLeft > 0 ? '1' : '0';
      newsPrevBtn.style.pointerEvents = newsTrack.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = newsTrack.scrollLeft + newsTrack.clientWidth >= newsTrack.scrollWidth - 4;
      newsNextBtn.style.opacity = atEnd ? '0' : '1';
      newsNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }
    newsTrack.addEventListener('scroll', updateNewsArrows, { passive: true });
    setTimeout(updateNewsArrows, 0);

    newsTrackWrap.appendChild(newsPrevBtn);
    newsTrackWrap.appendChild(newsTrack);
    newsTrackWrap.appendChild(newsNextBtn);
    newsSection.appendChild(newsTrackWrap);

    var newsViewAll = document.createElement('a');
    newsViewAll.href = '#';
    newsViewAll.className = 'ms-view-all';
    newsViewAll.innerHTML = 'View All Latest News <span class="ms-view-arrow">&#x27A4;</span>';
    newsSection.appendChild(newsViewAll);

    msContainer.appendChild(newsSection);
  }

  // ── Know More Section ────────────────────────────────────────────
  var knowMoreTabs = [
    {
      label: 'Expert Reviews',
      viewAllLabel: 'View All Expert Reviews',
      articles: [
        { title: 'Kia Carens Clavis 6000 km Review: A Big Change In Lifestyle',          desc: 'With the diesel gone, the turbo-petrol became the daily commuter, and that cam...', author: 'Ansh',     date: 'Mar 12, 2026' },
        { title: 'Maruti Victoris 3000km Long Term Review: Shaadi Season Dutie...',       desc: 'Managing frustrations with Mumbai traffic while still handling wedding-related...',  author: 'Cardekho', date: 'Mar 08, 2026' },
        { title: 'MG Windsor EV Long Term Review: One Month On A Full Charge?',           desc: 'The Windsor was the best-selling electric car in the country in 2025, why?',          author: 'Arun',     date: 'Feb 06, 2026' },
        { title: 'Maruti Victoris Long Term Introduction: New Beginnings!',               desc: "Can Maruti's new compact SUV be victorious over our hearts?",                          author: 'Ujjawal',  date: 'Jan 22, 2026' },
      ]
    },
    { label: 'Videos',           viewAllLabel: 'View All Videos',           articles: [] },
    { label: 'Featured Stories', viewAllLabel: 'View All Featured Stories', articles: [] },
  ];

  if (msContainer) {
    var knowSection = document.createElement('div');
    knowSection.className = 'ms-electric-section';

    var knowTitle = document.createElement('h3');
    knowTitle.className = 'ms-electric-title';
    knowTitle.textContent = 'Know more to choose better';
    knowSection.appendChild(knowTitle);

    // Tabs
    var knowTabsEl = document.createElement('div');
    knowTabsEl.className = 'ms-know-tabs';
    knowMoreTabs.forEach(function (tab, i) {
      var btn = document.createElement('button');
      btn.className = 'ms-know-tab' + (i === 0 ? ' active' : '');
      btn.textContent = tab.label;
      btn.dataset.index = i;
      knowTabsEl.appendChild(btn);
    });
    knowSection.appendChild(knowTabsEl);

    // Track wrap (shared, swaps content on tab click)
    var knowTrackWrap = document.createElement('div');
    knowTrackWrap.className = 'ms-electric-track-wrap';

    var knowTrack = document.createElement('div');
    knowTrack.className = 'ms-know-track';

    var knowNextBtn = document.createElement('button');
    knowNextBtn.className = 'ms-scroll-btn ms-scroll-next';
    knowNextBtn.innerHTML = '&#8250;';
    knowNextBtn.setAttribute('aria-label', 'Scroll right');

    var knowPrevBtn = document.createElement('button');
    knowPrevBtn.className = 'ms-scroll-btn ms-scroll-prev';
    knowPrevBtn.innerHTML = '&#8249;';
    knowPrevBtn.setAttribute('aria-label', 'Scroll left');

    knowPrevBtn.addEventListener('click', function () { knowTrack.scrollBy({ left: -300, behavior: 'smooth' }); });
    knowNextBtn.addEventListener('click', function () { knowTrack.scrollBy({ left: 300, behavior: 'smooth' }); });

    var knowViewAll = document.createElement('a');
    knowViewAll.href = '#';
    knowViewAll.className = 'ms-view-all';

    function renderKnowTab(idx) {
      var tab = knowMoreTabs[idx];
      knowTrack.innerHTML = '';
      knowTrack.scrollLeft = 0;
      tab.articles.forEach(function (article) {
        var card = document.createElement('div');
        card.className = 'ms-know-card';
        card.innerHTML =
          '<div class="ms-know-img-wrap">' +
            '<img class="ms-know-img" src="' + BLANK + '" alt="' + article.title + '">' +
          '</div>' +
          '<div class="ms-know-body">' +
            '<div class="ms-know-title">' + article.title + '</div>' +
            '<div class="ms-know-desc">' + article.desc + '</div>' +
            '<div class="ms-news-meta">By ' + article.author + ' &bull; ' + article.date + '</div>' +
          '</div>';
        knowTrack.appendChild(card);
      });
      knowViewAll.innerHTML = tab.viewAllLabel + ' <span class="ms-view-arrow">&#x27A4;</span>';
      updateKnowArrows();
    }

    function updateKnowArrows() {
      knowPrevBtn.style.opacity = knowTrack.scrollLeft > 0 ? '1' : '0';
      knowPrevBtn.style.pointerEvents = knowTrack.scrollLeft > 0 ? 'auto' : 'none';
      var atEnd = knowTrack.scrollLeft + knowTrack.clientWidth >= knowTrack.scrollWidth - 4;
      knowNextBtn.style.opacity = atEnd ? '0' : '1';
      knowNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
    }
    knowTrack.addEventListener('scroll', updateKnowArrows, { passive: true });

    knowTabsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.ms-know-tab');
      if (!btn) return;
      knowTabsEl.querySelectorAll('.ms-know-tab').forEach(function (t) { t.classList.remove('active'); });
      btn.classList.add('active');
      renderKnowTab(+btn.dataset.index);
    });

    knowTrackWrap.appendChild(knowPrevBtn);
    knowTrackWrap.appendChild(knowTrack);
    knowTrackWrap.appendChild(knowNextBtn);
    knowSection.appendChild(knowTrackWrap);
    knowSection.appendChild(knowViewAll);

    msContainer.appendChild(knowSection);
    renderKnowTab(0);
  }

  // ── Tab switching ────────────────────────────────────────────────
  tabsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.ms-tab');
    if (!btn) return;
    var idx = +btn.dataset.index;

    tabsEl.querySelectorAll('.ms-tab').forEach(function (t, i) {
      t.classList.toggle('active', i === idx);
    });
    containersEl.querySelectorAll('.ms-panel').forEach(function (p, i) {
      p.classList.toggle('active', i === idx);
    });
  });
})();
