document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('inventory-search');
  const catPills = document.querySelectorAll('.cat-pill');
  const tbody = document.querySelector('.inventory-table tbody');

  function filterTable() {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const activePill = document.querySelector('.cat-pill.active');
    const selectedCategory = (activePill?.getAttribute('data-category') || 'all').toLowerCase();
    const rows = document.querySelectorAll('.inventory-table tbody tr');

    rows.forEach(row => {
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

  function bindStepper(btn) {
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
  }

  document.querySelectorAll('.btn-step').forEach(bindStepper);

  const modal = document.getElementById('modalTambahBahan');
  const btnOpenModal = document.getElementById('btn-open-modal-tambah');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-modal-cancel');
  const formTambah = document.getElementById('formTambahBahan');

  function openModal() {
    if (modal) modal.classList.add('show');
  }

  function closeModal() {
    if (modal) modal.classList.remove('show');
    if (formTambah) formTambah.reset();
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (formTambah && tbody) {
    formTambah.addEventListener('submit', (e) => {
      e.preventDefault();

      const nama = document.getElementById('inputNamaBahan')?.value.trim() || '';
      const kategori = document.getElementById('selectKategori')?.value || '';
      const satuan = document.getElementById('selectSatuan')?.value || '';
      const stokAwal = parseInt(document.getElementById('inputStokAwal')?.value, 10) || 0;
      const stokMin = parseInt(document.getElementById('inputStokMin')?.value, 10) || 0;
      const harga = parseInt(document.getElementById('inputHargaSatuan')?.value, 10) || 0;

      if (!nama || !kategori || !satuan) return;

      const isDanger = stokAwal < stokMin;
      const initial = nama.charAt(0).toUpperCase();

      const newRow = document.createElement('tr');
      newRow.setAttribute('data-category', kategori.toLowerCase());
      newRow.innerHTML = `
        <td>
          <div class="material-cell">
            <span class="material-avatar">${initial}</span>
            <div class="material-info">
              <strong class="material-name">${nama}</strong>
              <span class="material-min">Min. ${stokMin.toLocaleString('id-ID')} ${satuan}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="category-tag">${kategori}</span>
        </td>
        <td>
          <strong class="stock-value">${stokAwal.toLocaleString('id-ID')}</strong>
          <span class="unit-label">${satuan}</span>
        </td>
        <td>
          <strong class="price-value">Rp ${harga.toLocaleString('id-ID')}</strong>
          <span class="unit-label">/ ${satuan}</span>
        </td>
        <td>
          <span class="badge-status ${isDanger ? 'badge-danger' : 'badge-success'}">
            <span class="status-dot"></span>
            ${isDanger ? 'Stok rendah' : 'Aman'}
          </span>
        </td>
        <td>
          <div class="action-stepper">
            <button type="button" class="btn-step btn-decrement" aria-label="Kurangi stok">-</button>
            <button type="button" class="btn-step btn-increment" aria-label="Tambah stok">+</button>
          </div>
        </td>
      `;

      tbody.insertBefore(newRow, tbody.firstChild);
      newRow.querySelectorAll('.btn-step').forEach(bindStepper);

      const totalCount = tbody.querySelectorAll('tr').length;
      const metaBadge = document.querySelector('.meta-count-badge');
      const totalBahanCard = document.querySelector('.summary-card:first-child .metric-number');

      if (metaBadge) metaBadge.textContent = `${totalCount} bahan`;
      if (totalBahanCard) totalBahanCard.textContent = totalCount;

      if (isDanger) {
        const warningCard = document.querySelector('.metric-number--warning');
        if (warningCard) {
          const count = parseInt(warningCard.textContent, 10) || 0;
          warningCard.textContent = count + 1;
        }
      }

      closeModal();
      filterTable();
    });
  }
});
