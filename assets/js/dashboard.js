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
    });

    if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
    if (totalEl) totalEl.textContent = formatRupiah(subtotal);
  }

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
