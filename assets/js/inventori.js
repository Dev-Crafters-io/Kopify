document.addEventListener('DOMContentLoaded', () => {
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

  if (formTambah) {
    formTambah.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
    });
  }
});
