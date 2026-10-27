document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  const days = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, '0'));

  const salesData = [
    980000, 1050000, 990000, 1180000, 1150000, 1420000, 1580000,
    1120000, 1190000, 1260000, 1020000, 1240000, 1490000, 1620000,
    1210000, 1180000, 1160000, 1280000, 1340000, 1720000, 1590000,
    1200000, 1310000, 1290000, 1450000, 1220000, 1560000, 1690000,
    1430000, 1610000
  ];

  const costData = [
    350000, 390000, 350000, 460000, 450000, 500000, 570000,
    400000, 440000, 490000, 360000, 480000, 600000, 650000,
    460000, 440000, 430000, 490000, 530000, 680000, 610000,
    450000, 520000, 510000, 580000, 480000, 640000, 690000,
    570000, 650000
  ];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          type: 'line',
          label: 'Omzet harian',
          data: salesData,
          borderColor: '#2B1810',
          borderWidth: 2.5,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#2B1810',
          fill: false,
          order: 1
        },
        {
          type: 'bar',
          label: 'Biaya bahan',
          data: costData,
          backgroundColor: '#D8C7B7',
          hoverBackgroundColor: '#C7B4A2',
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 10,
          order: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#2B1810',
          titleFont: {
            family: "'IBM Plex Sans', sans-serif",
            size: 13,
            weight: '600'
          },
          bodyFont: {
            family: "'IBM Plex Sans', sans-serif",
            size: 12
          },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            title: function (items) {
              return 'Hari ke-' + items[0].label;
            },
            label: function (context) {
              return context.dataset.label + ': Rp ' + context.parsed.y.toLocaleString('id-ID');
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#887A70',
            font: {
              family: "'IBM Plex Sans', sans-serif",
              size: 11
            },
            callback: function (val, index) {
              const label = days[index];
              if (['01', '05', '10', '15', '20', '25', '30'].includes(label)) {
                return label;
              }
              return '';
            }
          }
        },
        y: {
          min: 0,
          max: 2000000,
          grid: {
            color: '#EAE4DD',
            lineWidth: 1
          },
          ticks: {
            stepSize: 500000,
            color: '#887A70',
            font: {
              family: "'IBM Plex Sans', sans-serif",
              size: 11
            },
            callback: function (value) {
              if (value === 0) return '0';
              if (value === 500000) return '0,5 jt';
              if (value === 1000000) return '1 jt';
              if (value === 1500000) return '1,5 jt';
              if (value === 2000000) return '2 jt';
              return value;
            }
          }
        }
      }
    }
  });

  // Date filter buttons
  const dateBtns = document.querySelectorAll('.date-btn');
  const dateRangeDisplay = document.querySelector('.date-range-display');
  dateBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      dateBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const text = this.textContent.trim();
      if (dateRangeDisplay) {
        if (text === 'Hari Ini') dateRangeDisplay.textContent = '27 Okt 2026';
        else if (text === '7 Hari') dateRangeDisplay.textContent = '21 Okt – 27 Okt 2026';
        else if (text === '30 Hari') dateRangeDisplay.textContent = '01 Okt – 30 Okt 2026';
        else if (text === 'Bulan Ini') dateRangeDisplay.textContent = '01 Okt – 31 Okt 2026';
      }
    });
  });

  // Download button
  const downloadBtn = document.querySelector('.btn-download');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      window.print();
    });
  }
});
