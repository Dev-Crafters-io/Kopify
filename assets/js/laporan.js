document.addEventListener('DOMContentLoaded', function () {
  const dateBtns = document.querySelectorAll('.date-btn');
  const dateRangeDisplay = document.querySelector('.date-range-display');

  dateBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      dateBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const text = this.textContent.trim();
      if (dateRangeDisplay) {
        if (text === 'Hari Ini' || text === 'Hari ini') dateRangeDisplay.textContent = '27 Okt 2026';
        else if (text === '7 Hari') dateRangeDisplay.textContent = '21 Okt – 27 Okt 2026';
        else if (text === '30 Hari') dateRangeDisplay.textContent = '01 Okt – 30 Okt 2026';
        else if (text === 'Bulan Ini') dateRangeDisplay.textContent = '01 Okt – 31 Okt 2026';
      }
    });
  });

  const downloadBtn = document.querySelector('.btn-download');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      window.print();
    });
  }
});
