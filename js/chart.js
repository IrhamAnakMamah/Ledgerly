let status = 'pengeluaran';

export function createChart(jumlahPemasukan, jumlahPengeluaran) {
  destroyChart();
  const element = document.getElementById("myChart");
  const data = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: [jumlahPemasukan, jumlahPengeluaran],
        backgroundColor: ["#22c55e", "#ef4444"],
        hoverOffset: 4,
      },
    ],
  };
  const config = new Chart(element, {
    type: "doughnut",
    data: data,
  });

  const changeHtml = ((key) => {
      const listHtml = getElement(key);
      const ket = document.getElementById('ket-transaksi');
      ket.innerHTML = `<div class="scroll-area on-chart">${listHtml}</div>`;
  });

  element.onclick = (evt) => {
    const chart = Chart.getChart(myChart);
    if (chart) {
      const points = chart.getElementsAtEventForMode(
        evt,
        "nearest",
        { intersect: true },
        true
      );

      if (points.length === 0) {
        return;
      }

      const firstPoint = points[0];
      console.log(firstPoint);
      const oldLabel = chart.data.labels[firstPoint.index];
      const label = oldLabel.replace("P", "p");
      status = label;
      console.log(label);
      changeHtml(status);
    }
  };

  changeHtml(status);
}

function getElement(key) {
  const temp = localStorage.getItem("data");
  let data = JSON.parse(temp) || [];

  const listHtml = data.filter(({transaksi}) => {
    return transaksi === key;
  }).map(({ id, transaksi, keterangan, jumlah, tanggal }) => {
      const isExpense = transaksi === "pengeluaran";
      const cssClass = isExpense ? "pengeluaran" : "pemasukan";
      const formatRupiah = new Intl.NumberFormat("id-ID").format(jumlah);
      return `
              <div class="card-transaksi ${cssClass}">
                  <div class="info">
                      <h4>${keterangan}</h4>
                      <small>${transaksi.toUpperCase()} • ${
        tanggal || "-"
      }</small> </div>
                  <div class="harga-wrapper">
                      <span class="nominal" style="color: white">
                          Rp ${formatRupiah}
                      </span>
                  </div>
              </div>
              `;
    })
    .join("");

  return listHtml;
}

function destroyChart() {
  let chartStatus = Chart.getChart(myChart);
  if (chartStatus) {
    chartStatus.destroy();
  }
}
