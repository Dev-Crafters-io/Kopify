document.addEventListener('DOMContentLoaded', () => {
  const menuSearchInput = document.getElementById('menu-search');
  const menuPills = document.querySelectorAll('.menu-pill');
  const menuItems = document.querySelectorAll('.product-menu-item');

  function filterMenus() {
    const query = (menuSearchInput?.value || '').toLowerCase().trim();
    const activePill = document.querySelector('.menu-pill.active');
    const selectedCategory = (activePill?.getAttribute('data-category') || 'all').toLowerCase();

    menuItems.forEach(item => {
      const title = (item.querySelector('.item-title')?.textContent || '').toLowerCase();
      const category = (item.getAttribute('data-category') || '').toLowerCase();

      const matchesSearch = !query || title.includes(query);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      if (matchesSearch && matchesCategory) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', filterMenus);
  }

  menuPills.forEach(pill => {
    pill.addEventListener('click', () => {
      menuPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterMenus();
    });
  });

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => {
        i.classList.remove('active-menu');
        const icon = i.querySelector('.item-indicator-icon');
        if (icon) {
          icon.src = './assets/icons/chevron-right.svg';
        }
      });
      item.classList.add('active-menu');
      const activeIcon = item.querySelector('.item-indicator-icon');
      if (activeIcon) {
        activeIcon.src = './assets/icons/circle-check.svg';
      }
    });
  });

  const saveBtn = document.getElementById('btn-save-recipe');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const originalText = saveBtn.querySelector('span')?.textContent || 'Simpan Resep';
      if (saveBtn.querySelector('span')) {
        saveBtn.querySelector('span').textContent = 'Tersimpan!';
      }
      setTimeout(() => {
        if (saveBtn.querySelector('span')) {
          saveBtn.querySelector('span').textContent = originalText;
        }
      }, 2000);
    });
  }

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
});
