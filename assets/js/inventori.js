document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modalTambahBahan');
  const btnOpenModal = document.getElementById('btn-open-modal-tambah');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const formTambah = document.getElementById('formTambahBahan');

  const modalTitle = document.getElementById('modalTambahTitle');
  const btnSubmit = formTambah.querySelector('.btn-modal-submit');
  let editingRow = null;

  function openModal() {
    if (modal) modal.classList.add('show');
  }

  // Mode tambah dan edit memakai modal yang sama; editingRow menandai baris yang sedang diedit
  function setMode(row) {
    editingRow = row;
    modalTitle.textContent = row ? 'Edit Bahan Baku' : 'Tambah Bahan Baku Baru';
    btnSubmit.textContent = row ? 'Simpan Perubahan' : 'Simpan Bahan Baku';
  }

  // Angka di tabel berformat Indonesia ("2.500"), titik adalah pemisah ribuan
  const toNumber = (text) => text.replace(/\D/g, '');
  const toRupiah = (n) => Number(n).toLocaleString('id-ID');

  function closeModal() {
    if (modal) modal.classList.remove('show');
    if (formTambah) formTambah.reset();
    setMode(null);
  }

  function openEdit(row) {
    const stock = row.querySelectorAll('td')[2];
    document.getElementById('inputNamaBahan').value = row.querySelector('.material-name').textContent;
    document.getElementById('selectKategori').value = row.dataset.category;
    document.getElementById('selectSatuan').value = stock.querySelector('.unit-label').textContent.trim();
    document.getElementById('inputStokAwal').value = toNumber(stock.querySelector('.stock-value').textContent);
    document.getElementById('inputStokMin').value = toNumber(row.querySelector('.material-min').textContent);
    document.getElementById('inputHargaSatuan').value = toNumber(row.querySelector('.price-value').textContent);
    setMode(row);
    openModal();
  }

  document.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => openEdit(btn.closest('tr')));
  });

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (formTambah) {
    formTambah.addEventListener('submit', (e) => {
      e.preventDefault();
      if (editingRow) {
        const unit = document.getElementById('selectSatuan').value;
        const category = document.getElementById('selectKategori');
        const cells = editingRow.querySelectorAll('td');
        editingRow.dataset.category = category.value;
        editingRow.querySelector('.material-name').textContent = document.getElementById('inputNamaBahan').value;
        editingRow.querySelector('.material-avatar').textContent = document.getElementById('inputNamaBahan').value.charAt(0).toUpperCase();
        editingRow.querySelector('.material-min').textContent = 'Min. ' + toRupiah(document.getElementById('inputStokMin').value) + ' ' + unit;
        editingRow.querySelector('.category-tag').textContent = category.options[category.selectedIndex].text;
        editingRow.querySelector('.stock-value').textContent = toRupiah(document.getElementById('inputStokAwal').value);
        cells[2].querySelector('.unit-label').textContent = unit;
        editingRow.querySelector('.price-value').textContent = 'Rp ' + toRupiah(document.getElementById('inputHargaSatuan').value);
        cells[3].querySelector('.unit-label').textContent = '/ ' + unit;
      }
      closeModal();
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
