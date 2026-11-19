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

  const orderSummaryPanel = document.getElementById('order-summary-panel');
  const btnCloseOrder = document.getElementById('btn-close-order');
  const floatingOrderTrigger = document.getElementById('floating-order-trigger');

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

  const btnHamburger = document.getElementById('btn-hamburger');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  if (btnHamburger && mobileNavDrawer) {
    btnHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.toggle('is-open');
      mobileNavDrawer.classList.toggle('show', isOpen);
      btnHamburger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!mobileNavDrawer.contains(e.target) && !btnHamburger.contains(e.target)) {
        mobileNavDrawer.classList.remove('is-open');
        mobileNavDrawer.classList.remove('show');
        btnHamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  // Tombol bayar berperan sebagai radio (role="radio"), jadi status terpilih diatur manual
  const paymentButtons = document.querySelectorAll('.payment-btn');
  const receiptPaymentMethod = document.getElementById('receipt-payment-method');

  paymentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      paymentButtons.forEach((other) => {
        const isSelected = other === button;
        other.classList.toggle('active', isSelected);
        other.setAttribute('aria-checked', String(isSelected));
      });
      if (receiptPaymentMethod) {
        receiptPaymentMethod.textContent = button.querySelector('span').textContent;
      }
    });
  });

  const receiptModal = document.getElementById('receiptModal');
  const btnCheckout = document.getElementById('btn-checkout');
  const btnCloseReceipt = document.getElementById('close-receipt-btn');

  // Fokus dipindah ke modal saat dibuka dan dikembalikan ke tombol bayar saat ditutup
  const receiptDate = document.getElementById('receipt-date');

  function openReceipt() {
    // Tanggal struk diambil dari jam topbar supaya sama dengan waktu transaksi
    if (receiptDate && liveDateTimeElement) receiptDate.textContent = liveDateTimeElement.textContent;
    receiptModal.classList.add('show');
    btnCloseReceipt.focus();
  }

  function closeReceipt() {
    receiptModal.classList.remove('show');
    btnCheckout.focus();
  }

  if (receiptModal && btnCheckout && btnCloseReceipt) {
    btnCheckout.addEventListener('click', openReceipt);
    btnCloseReceipt.addEventListener('click', closeReceipt);

    receiptModal.addEventListener('click', (e) => {
      if (e.target === receiptModal) closeReceipt();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && receiptModal.classList.contains('show')) closeReceipt();
    });
  }
});
