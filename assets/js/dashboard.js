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
});
