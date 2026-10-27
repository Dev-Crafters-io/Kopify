document.addEventListener('DOMContentLoaded', () => {
  const liveDateTimeElement = document.getElementById('live-datetime');

  function updateLiveClock() {
    if (!liveDateTimeElement) return;
    const now = new Date();
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    liveDateTimeElement.textContent = `${dayName}, ${date} ${monthName} ${year} — ${hours}:${minutes} WIB`;
  }

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  const categoryPills = document.querySelectorAll('.category-pill');
  const productCards = document.querySelectorAll('.product-card');

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-category');
      const searchTerm = (document.getElementById('menu-search-input')?.value || '').toLowerCase().trim();

      filterProducts(selectedCategory, searchTerm);
    });
  });

  const searchInput = document.getElementById('menu-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      const activePill = document.querySelector('.category-pill.active');
      const currentCategory = activePill ? activePill.getAttribute('data-category') : 'all';

      filterProducts(currentCategory, searchTerm);
    });
  }

  function filterProducts(category, searchTerm) {
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardName = (card.getAttribute('data-name') || '').toLowerCase();

      const matchesCategory = (category === 'all' || cardCategory === category);
      const matchesSearch = (!searchTerm || cardName.includes(searchTerm));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  const subtotalEl = document.getElementById('order-subtotal');
  const totalEl = document.getElementById('order-total');

  function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  function updateOrderTotals() {
    let subtotal = 0;
    let totalItems = 0;
    const itemRows = document.querySelectorAll('.order-item-row');

    itemRows.forEach(row => {
      const unitPrice = parseInt(row.getAttribute('data-price'), 10) || 0;
      const valEl = row.querySelector('.stepper-value');
      const qty = parseInt(valEl.textContent, 10) || 0;
      const rowPrice = unitPrice * qty;

      const priceDisplay = row.querySelector('.order-item-price');
      if (priceDisplay) {
        priceDisplay.textContent = formatRupiah(rowPrice);
      }

      subtotal += rowPrice;
      totalItems += qty;
    });

    if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
    if (totalEl) totalEl.textContent = formatRupiah(subtotal);

    // Sync badges & floating trigger
    const orderBadge = document.getElementById('order-badge-count');
    if (orderBadge) orderBadge.textContent = `${totalItems} item`;

    const topbarCartBadge = document.getElementById('topbar-cart-badge');
    if (topbarCartBadge) topbarCartBadge.textContent = totalItems;

    const floatingCartCount = document.getElementById('floating-cart-count');
    if (floatingCartCount) floatingCartCount.textContent = totalItems;

    const floatingOrderItemsText = document.getElementById('floating-order-items-text');
    if (floatingOrderItemsText) floatingOrderItemsText.textContent = `${totalItems} Menu Dipilih`;

    const floatingOrderTotal = document.getElementById('floating-order-total');
    if (floatingOrderTotal) floatingOrderTotal.textContent = formatRupiah(subtotal);
  }

  // Order Summary Panel Toggle (Open / Close)
  const orderSummaryPanel = document.getElementById('order-summary-panel');
  const btnCloseOrder = document.getElementById('btn-close-order');
  const floatingOrderTrigger = document.getElementById('floating-order-trigger');
  const topbarCartBtn = document.getElementById('topbar-cart-btn');

  function openOrderPanel() {
    if (!orderSummaryPanel) return;
    orderSummaryPanel.classList.remove('is-closed');
    if (floatingOrderTrigger) floatingOrderTrigger.style.display = 'none';
    if (window.innerWidth <= 992) {
      orderSummaryPanel.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function closeOrderPanel() {
    if (!orderSummaryPanel) return;
    orderSummaryPanel.classList.add('is-closed');
    if (floatingOrderTrigger) {
      floatingOrderTrigger.style.display = 'flex';
      floatingOrderTrigger.classList.add('bounce-in');
      setTimeout(() => floatingOrderTrigger.classList.remove('bounce-in'), 400);
    }
  }

  if (btnCloseOrder) {
    btnCloseOrder.addEventListener('click', closeOrderPanel);
  }

  if (floatingOrderTrigger) {
    floatingOrderTrigger.addEventListener('click', openOrderPanel);
  }

  if (topbarCartBtn) {
    topbarCartBtn.addEventListener('click', () => {
      if (orderSummaryPanel && orderSummaryPanel.classList.contains('is-closed')) {
        openOrderPanel();
      } else {
        closeOrderPanel();
      }
    });
  }

  // Initial sync of order totals and badges
  updateOrderTotals();

  // Auto-close order summary panel on mobile screens
  if (window.innerWidth <= 992) {
    closeOrderPanel();
  }

  let lastWindowWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const currentWidth = window.innerWidth;
    if (lastWindowWidth > 992 && currentWidth <= 992) {
      closeOrderPanel();
    } else if (lastWindowWidth <= 992 && currentWidth > 992) {
      openOrderPanel();
    }
    lastWindowWidth = currentWidth;
  });

  function bindSteppers() {
    const itemRows = document.querySelectorAll('.order-item-row');

    itemRows.forEach(row => {
      const minusBtn = row.querySelector('.stepper-btn--minus');
      const plusBtn = row.querySelector('.stepper-btn--plus');
      const valEl = row.querySelector('.stepper-value');

      if (minusBtn && !minusBtn.dataset.bound) {
        minusBtn.dataset.bound = 'true';
        minusBtn.addEventListener('click', () => {
          let currentVal = parseInt(valEl.textContent, 10) || 0;
          if (currentVal > 1) {
            valEl.textContent = currentVal - 1;
            updateOrderTotals();
          } else {
            row.remove();
            updateOrderTotals();
          }
        });
      }

      if (plusBtn && !plusBtn.dataset.bound) {
        plusBtn.dataset.bound = 'true';
        plusBtn.addEventListener('click', () => {
          let currentVal = parseInt(valEl.textContent, 10) || 0;
          valEl.textContent = currentVal + 1;
          updateOrderTotals();
        });
      }
    });
  }

  bindSteppers();

  const addButtons = document.querySelectorAll('.btn-add-product');
  const orderItemsContainer = document.getElementById('order-items-container');

  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card) return;

      const title = card.getAttribute('data-name');
      const price = parseInt(card.getAttribute('data-price'), 10) || 0;
      const id = card.querySelector('h3')?.textContent.trim() || title;

      let existingRow = Array.from(document.querySelectorAll('.order-item-row')).find(row => {
        return row.querySelector('.order-item-title')?.textContent.trim() === id;
      });

      if (existingRow) {
        const valEl = existingRow.querySelector('.stepper-value');
        valEl.textContent = parseInt(valEl.textContent, 10) + 1;
      } else {
        const newRow = document.createElement('div');
        newRow.className = 'order-item-row';
        newRow.setAttribute('data-price', price);
        newRow.innerHTML = `
          <div class="order-item-info">
            <h4 class="order-item-title">${title}</h4>
            <span class="order-item-subtitle">Regular</span>
          </div>
          <div class="quantity-stepper">
            <button class="stepper-btn stepper-btn--minus" aria-label="Kurangi kuantitas">−</button>
            <span class="stepper-value">1</span>
            <button class="stepper-btn stepper-btn--plus" aria-label="Tambah kuantitas">+</button>
          </div>
          <strong class="order-item-price">${formatRupiah(price)}</strong>
        `;
        orderItemsContainer.appendChild(newRow);
      }

      bindSteppers();
      updateOrderTotals();

      if (orderSummaryPanel && orderSummaryPanel.classList.contains('is-closed') && floatingOrderTrigger) {
        floatingOrderTrigger.classList.add('pulse-anim');
        setTimeout(() => floatingOrderTrigger.classList.remove('pulse-anim'), 400);
      }
    });
  });

  const qrisBtn = document.getElementById('btn-pay-qris');
  const cashBtn = document.getElementById('btn-pay-cash');

  if (qrisBtn && cashBtn) {
    qrisBtn.addEventListener('click', () => {
      qrisBtn.classList.add('active');
      qrisBtn.setAttribute('aria-checked', 'true');
      cashBtn.classList.remove('active');
      cashBtn.setAttribute('aria-checked', 'false');
    });

    cashBtn.addEventListener('click', () => {
      cashBtn.classList.add('active');
      cashBtn.setAttribute('aria-checked', 'true');
      qrisBtn.classList.remove('active');
      qrisBtn.setAttribute('aria-checked', 'false');
    });
  }

  const checkoutBtn = document.getElementById('btn-checkout');
  const receiptModal = document.getElementById('receiptModal');
  const closeReceiptBtn = document.getElementById('close-receipt-btn');
  const printReceiptBtn = document.getElementById('print-receipt-btn');

  if (checkoutBtn && receiptModal) {
    checkoutBtn.addEventListener('click', () => {
      const receiptDate = document.getElementById('receipt-date');
      if (receiptDate) {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const day = days[now.getDay()];
        const d = now.getDate();
        const m = months[now.getMonth()];
        const y = now.getFullYear();
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        receiptDate.textContent = `${day}, ${d} ${m} ${y} • ${h}:${min}`;
      }
      receiptModal.classList.add('show');
    });
  }

  if (closeReceiptBtn && receiptModal) {
    closeReceiptBtn.addEventListener('click', () => {
      receiptModal.classList.remove('show');
    });
  }

  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (receiptModal) {
    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) {
        receiptModal.classList.remove('show');
      }
    });
  }
});
