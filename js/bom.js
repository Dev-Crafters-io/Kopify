document.addEventListener('DOMContentLoaded', () => {
  const menuSearchInput = document.getElementById('menu-search');
  const menuPills = document.querySelectorAll('.menu-pill');
  const menuItems = document.querySelectorAll('.product-menu-item');
  const tableRows = document.querySelectorAll('.ingredients-table tbody tr');
  const totalCostDisplay = document.querySelector('.total-bar-cost');
  const metricHppValue = document.querySelector('.metric-data-value');

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
          icon.src = '../assets/icons/chevron-right.svg';
        }
      });
      item.classList.add('active-menu');
      const activeIcon = item.querySelector('.item-indicator-icon');
      if (activeIcon) {
        activeIcon.src = '../assets/icons/circle-check.svg';
      }
    });
  });

  function calculateHpp() {
    let total = 0;
    tableRows.forEach(row => {
      const input = row.querySelector('.quantity-number-input');
      const unitCost = parseInt(row.getAttribute('data-unit-cost'), 10) || 0;
      const subtotalEl = row.querySelector('.subtotal-cell-value');

      const qty = parseFloat(input?.value) || 0;
      const subtotal = Math.round(qty * unitCost);

      if (subtotalEl) {
        subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
      }
      total += subtotal;
    });

    if (totalCostDisplay) {
      totalCostDisplay.textContent = `Total HPP: Rp ${total.toLocaleString('id-ID')}`;
    }
    if (metricHppValue) {
      metricHppValue.textContent = `Rp ${total.toLocaleString('id-ID')} / cup`;
    }
  }

  tableRows.forEach(row => {
    const input = row.querySelector('.quantity-number-input');
    if (input) {
      input.addEventListener('input', calculateHpp);
    }

    const removeBtn = row.querySelector('.btn-remove-material');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        row.remove();
        calculateHpp();
      });
    }
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
});
