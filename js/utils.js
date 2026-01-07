export function createCardHTML(
  { id, transaksi, keterangan, jumlah, tanggal },
  from
) {
  const isExpense = transaksi === "pengeluaran";
  const cssClass = isExpense ? "pengeluaran" : "pemasukan";
  const sign = isExpense ? "-" : "+";
  const formatRupiah = new Intl.NumberFormat("id-ID").format(jumlah);
  const btt = `<button class="btn-delete" onclick="deleteData(${id})">Hapus</button>`;
  return `
        <div class="card-transaksi ${cssClass}">
            <div class="info">
                <h4>${keterangan}</h4>
                <small>${transaksi.toUpperCase()} • ${
    tanggal || "-"
  }</small> </div>
            <div class="harga-wrapper">
                <span class="nominal" style="color: ${
                  from == "information"
                    ? isExpense
                      ? "#ef4444"
                      : "#22c55e"
                    : "white"
                }">
                    ${from == "information" ? sign : ""} Rp ${formatRupiah}
                </span>
                ${from == "information" ? btt : ""}
            </div>
        </div>
        `;
}

export function getLocalStorage () {
  const temp = localStorage.getItem("data");
  let storedData = JSON.parse(temp) || [];
  return storedData;
}