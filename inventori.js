document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('inventory-search');
  const catPills = document.querySelectorAll('.cat-pill');
  const tableRows = document.querySelectorAll('.inventory-table tbody tr');

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const activePill = document.querySelector('.cat-pill.active');
    const selectedCategory = (activePill?.getAttribute('data-category') || 'all').toLowerCase();

    tableRows.forEach(row => {
      const name = (row.querySelector('.material-name')?.textContent || '').toLowerCase();
      const category = (row.getAttribute('data-category') || '').toLowerCase();

      const matchesSearch = !query || name.includes(query);
      const matchesCategory = selectedCategory === 'all' || category.includes(selectedCategory);

      if (matchesSearch && matchesCategory) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterTable);
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterTable();
    });
  });

  const stepButtons = document.querySelectorAll('.btn-step');
  stepButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      if (!row) return;

      const stockEl = row.querySelector('.stock-value');
      if (!stockEl) return;

      let currentVal = parseInt(stockEl.textContent.replace(/\./g, ''), 10) || 0;
      const isIncrement = btn.classList.contains('btn-increment');

      if (isIncrement) {
        currentVal += 1;
      } else {
        if (currentVal > 0) currentVal -= 1;
      }

      stockEl.textContent = currentVal.toLocaleString('id-ID');
    });
  });
});
