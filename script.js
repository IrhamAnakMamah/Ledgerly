const submit = document.getElementById("btn-submit");

submit.addEventListener("click", getData);

function getData() {
  // Jenis Transaksi
  let getValue = (key) => {
    const element = document.getElementById(key);
    return element.value;
  };

  const jenisTransaksi = getValue("transaksi");
  const keteranganTransaksi = getValue("keterangan");
  const jumlahTransaksi = getValue("jumlah");

  // cek input
  console.log(jenisTransaksi);
  console.log(keteranganTransaksi);
  console.log(jumlahTransaksi);

  // validasi input
  let cekInput = (Keterangan, Jumlah) => {
    if (Keterangan.trim() === "" || Jumlah.trim() === "") {
      return false;
    }
    return Number.isFinite(Number(Jumlah)) && (Jumlah > 0);
  };

  if (!cekInput(keteranganTransaksi, jumlahTransaksi)) {
    alert("Isi yang Bener!");
  } else {
    const today = new Date();
    const dateString = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`;
    const data = {
      id: Date.now(),
      transaksi: jenisTransaksi,
      keterangan: keteranganTransaksi,
      jumlah: jumlahTransaksi,
      tanggal: dateString,
    };

    const temp = localStorage.getItem("data");
    let storedData = JSON.parse(temp) || [];

    console.log(storedData);
    storedData.push(data);

    localStorage.setItem("data", JSON.stringify(storedData));
    viewData();
    clearInput();
  }
}

function clearInput() {
  let getElement = (key) => {
    return document.getElementById(key);
  };

  getElement("transaksi").value = "pengeluaran";
  getElement("keterangan").value = "";
  getElement("jumlah").value = "";
}

function deleteData(idDelete) {
  const temp = localStorage.getItem("data");
  let getData = JSON.parse(temp);

  data = getData.filter(({ id }) => {
    return id != idDelete;
  });

  localStorage.setItem("data", JSON.stringify(data));
  viewData();
  alert("Data Berhasil Dihapus!");
}

function viewData() {
  const container = document.getElementById("result-container");
  const temp = localStorage.getItem("data");
  let data = JSON.parse(temp) || [];

  if (data.length > 0) {
    const listHtml = data
      .map(({ id, transaksi, keterangan, jumlah, tanggal }) => {
        const isExpense = transaksi === "pengeluaran";
        const cssClass = isExpense ? "pengeluaran" : "pemasukan";
        const sign = isExpense ? "-" : "+";
        const formatRupiah = new Intl.NumberFormat("id-ID").format(jumlah);
        return `
        <div class="card-transaksi ${cssClass}">
            <div class="info">
                <h4>${keterangan}</h4>
                <small>${transaksi.toUpperCase()} • ${
          tanggal || "-"
        }</small> </div>
            <div class="harga-wrapper">
                <span class="nominal" style="color: ${
                  isExpense ? "#ef4444" : "#22c55e"
                }">
                    ${sign} Rp ${formatRupiah}
                </span>
                <button class="btn-delete" onclick="deleteData(${id})">Hapus</button>
            </div>
        </div>
        `;
      })
      .join("");

    let hitung = (key) => {
      return data
        .filter(({ transaksi }) => transaksi === key)
        .reduce((sum, item) => sum + Number(item.jumlah), 0);
    };

    const jumlahPemasukan = hitung("pemasukan");
    const jumlahPengeluaran = hitung("pengeluaran");

    const formatMasuk = new Intl.NumberFormat("id-ID").format(jumlahPemasukan);
    const formatKeluar = new Intl.NumberFormat("id-ID").format(
      jumlahPengeluaran
    );

    const summaryHtml = `
      <div class="summary-box">
          <div class="summary-item">
              <h5>PEMASUKAN</h5>
              <span class="text-green">Rp ${new Intl.NumberFormat(
                "id-ID"
              ).format(jumlahPemasukan)}</span>
          </div>
          <div class="summary-item">
              <div style="border-left: 1px solid #475569; height: 100%; mx: 10px;"></div>
          </div>
          <div class="summary-item">
              <h5>PENGELUARAN</h5>
              <span class="text-red">Rp ${new Intl.NumberFormat("id-ID").format(
                jumlahPengeluaran
              )}</span>
          </div>
      </div>
    `;

    container.innerHTML =
      summaryHtml + `<div class="scroll-area">${listHtml}</div>`;
  } else {
    container.innerHTML = `
      <div style="text-align: center; color: #94a3b8; padding: 20px;">
          <h3>Belum ada data transaksi</h3>
      </div>
    `;
  }
}

viewData();
