/**
 * KOPIFY POS - Interactive Controller
 * Handles live clock, category filtering, search input,
 * order quantity stepping, payment method toggle, and checkout.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live DateTime Clock in Indonesian Format
  const liveDateTimeElement = document.getElementById('live-datetime');

  function updateLiveClock() {
    if (!liveDateTimeElement) return;
    const now = new Date();
    
    // Days array in Indonesian
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    // Months array in Indonesian
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
  setInterval(updateLiveClock, 30000);

  // 2. Category Filter Pills
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

  // 3. Search Input Filtering
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

  // 4. Order Calculations & Quantity Steppers
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

  // Attach event listeners to quantity steppers
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
            // Remove item row if decreased to 0
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

  // 5. Add Product from Menu Grid
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

      // Check if already in order
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

  // 6. Payment Method Toggle (QRIS / Tunai)
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

  // 7. Checkout Action
  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const activePayment = document.querySelector('.payment-btn.active span')?.textContent || 'Tunai';
      const totalAmount = totalEl?.textContent || 'Rp 0';
      alert(`Pesanan #005 siap diproses!\nMetode Pembayaran: ${activePayment}\nTotal: ${totalAmount}`);
    });
  }
});
