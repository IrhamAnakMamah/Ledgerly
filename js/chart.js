import { createCardHTML, getLocalStorage } from "./utils.js";

let status = "pengeluaran";

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

  const changeHtml = (key) => {
    const listHtml = getElement(key);
    const ket = document.getElementById("ket-transaksi");
    ket.innerHTML = `<div class="scroll-area on-chart">${listHtml}</div>`;
  };

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
      const label = oldLabel.toLowerCase();
      status = label;
      console.log(label);
      changeHtml(status);
    }
  };

  changeHtml(status);
}

function getElement(key) {
  let data = getLocalStorage();

  const listHtml = data
    .filter(({ transaksi }) => {
      return transaksi === key;
    })
    .map((data) => {
      return createCardHTML(data, "chart");
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
