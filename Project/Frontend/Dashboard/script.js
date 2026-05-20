// ══════════════════════════════════════
//   STATE
// ══════════════════════════════════════
let menuData = [];
let kategoriData = [];
let mejaData = [];
let metodeData = [];
let cart = []; // {id_menu, nama_menu, harga, nama_kategori, qty}
let activeKat = "all";
let kasirData = JSON.parse(
    localStorage.getItem("kasir") || '{"nama":"Kasir","jabatan":"Kasir"}',
);

// ══════════════════════════════════════
//   INIT
// ══════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("kasir")) {
        window.location.href = "../login/index.php";
        return;
    }
    initClock();
    initTopbar();
    loadAllData();

    // Tipe order change → toggle meja
    document.getElementById("tipeOrder").addEventListener("change", function() {
        document.getElementById("selectMeja").disabled = this.value !== "Dine-in";
    });
});

function initClock() {
    const update = () => {
        const now = new Date();
        const opt = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        document.getElementById("topbarDate").textContent = now.toLocaleDateString(
            "id-ID",
            opt,
        );
        document.getElementById("topbarTime").textContent =
            now.toLocaleTimeString("id-ID");
    };
    update();
    setInterval(update, 1000);
}

function initTopbar() {
    const nama = kasirData.nama || "Kasir";
    document.getElementById("topbarName").textContent = nama;
    document.getElementById("topbarAvatar").textContent = nama
        .charAt(0)
        .toUpperCase();
}

// ══════════════════════════════════════
//   LOAD DATA (dari API)
// ══════════════════════════════════════
async function loadAllData() {
    try {
        const [resKategori, resMenu, resMeja, resMetode] = await Promise.all([
            fetch("../../api/data.php?action=get_kategori"),
            fetch("../../api/data.php?action=get_menu"),
            fetch("../../api/data.php?action=get_meja"),
            fetch("../../api/data.php?action=get_metode"),
        ]);

        kategoriData = await resKategori.json();
        menuData = await resMenu.json();
        mejaData = await resMeja.json();
        metodeData = await resMetode.json();

        renderKategoriFilter();
        renderMenuGrid();
        renderMejaOptions();
        renderMetodeOptions();
        loadRiwayat();
    } catch (err) {
        console.error("Gagal memuat data:", err);
        showToast("Gagal memuat data dari server.", "error");
    }
}

// ══════════════════════════════════════
//   RENDER KATEGORI FILTER
// ══════════════════════════════════════
function renderKategoriFilter() {
    const icons = {
        "Lauk Daging": "fa-drumstick-bite",
        "Lauk Ayam": "fa-egg",
        "Ikan & Seafood": "fa-fish",
        Sayuran: "fa-leaf",
        "Sambal & Pelengkap": "fa-pepper-hot",
        "Nasi & Karbohidrat": "fa-bowl-rice",
        "Minuman Dingin": "fa-glass-water",
        "Minuman Panas": "fa-mug-hot",
        Camilan: "fa-cookie-bite",
        "Paket Hemat": "fa-box-open",
    };
    const wrap = document.getElementById("kategoriFilter");
    kategoriData.forEach((k) => {
        const ic = icons[k.nama_kategori] || "fa-utensils";
        wrap.innerHTML += `<button class="kat-btn" data-kat="${k.id_kategori}" onclick="filterKategori('${k.id_kategori}', this)">
            <i class="fa-solid ${ic}"></i> ${k.nama_kategori}
        </button>`;
    });
}

// ══════════════════════════════════════
//   RENDER MENU GRID
// ══════════════════════════════════════
function renderMenuGrid() {
    const grid = document.getElementById("menuGrid");
    const search = document.getElementById("menuSearch").value.toLowerCase();

    let filtered = menuData.filter((m) => {
        const matchKat = activeKat === "all" || m.id_kategori == activeKat;
        const matchQ = m.nama_menu.toLowerCase().includes(search);
        return matchKat && matchQ;
    });

    if (!filtered.length) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim);font-size:13px"><i class="fa-solid fa-bowl-food" style="font-size:28px;display:block;margin-bottom:10px"></i>Menu tidak ditemukan</div>`;
        return;
    }

    grid.innerHTML = filtered
        .map((m) => {
                const cartItem = cart.find((c) => c.id_menu == m.id_menu);
                const qty = cartItem ? cartItem.qty : 0;
                return `
        <div class="menu-card ${qty > 0 ? "in-cart" : ""}" onclick="addToCart(${m.id_menu})">
            ${qty > 0 ? `<div class="menu-card-qty-badge">${qty}</div>` : ""}
            <div class="menu-card-kat">${m.nama_kategori}</div>
            <div class="menu-card-name">${m.nama_menu}</div>
            <div class="menu-card-footer">
                <span class="menu-card-price">${formatRp(m.harga)}</span>
                <button class="menu-card-add" onclick="event.stopPropagation();addToCart(${m.id_menu})">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>`;
    })
    .join("");
}

function filterKategori(kat, el) {
  activeKat = kat;
  document
    .querySelectorAll(".kat-btn")
    .forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  renderMenuGrid();
}

// ══════════════════════════════════════
//   CART
// ══════════════════════════════════════
function addToCart(id_menu) {
  const menu = menuData.find((m) => m.id_menu == id_menu);
  if (!menu) return;
  const existing = cart.find((c) => c.id_menu == id_menu);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...menu, qty: 1 });
  }
  renderCart();
  renderMenuGrid();
}

function changeQty(id_menu, delta) {
  const idx = cart.findIndex((c) => c.id_menu == id_menu);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
  renderMenuGrid();
}

function renderCart() {
  const wrap = document.getElementById("cartItems");
  const total = cart.reduce((s, c) => s + c.harga * c.qty, 0);
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);

  document.getElementById("cartCount").textContent = `${totalQty} item`;
  document.getElementById("totalSubtotal").textContent = formatRp(total);
  document.getElementById("totalGrand").textContent = formatRp(total);

  const btn = document.getElementById("btnSubmit");
  btn.disabled = cart.length === 0;

  if (!cart.length) {
    wrap.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-bowl-rice"></i>Belum ada pesanan.<br>Pilih menu di kiri.</div>`;
    return;
  }

  wrap.innerHTML = cart
    .map(
      (c) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${c.nama_menu}</div>
                <div class="cart-item-price">${formatRp(c.harga)} × ${c.qty} = <strong>${formatRp(c.harga * c.qty)}</strong></div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn minus" onclick="changeQty(${c.id_menu}, -1)"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-num">${c.qty}</span>
                <button class="qty-btn" onclick="changeQty(${c.id_menu}, 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
    `,
    )
    .join("");
}

// ══════════════════════════════════════
//   MEJA & METODE OPTIONS
// ══════════════════════════════════════
function renderMejaOptions() {
  const sel = document.getElementById("selectMeja");
  mejaData.forEach((m) => {
    sel.innerHTML += `<option value="${m.id_meja}">${m.nomor_meja} — ${m.lokasi} (${m.kapasitas} org)</option>`;
  });
}
function renderMetodeOptions() {
  const sel = document.getElementById("selectMetode");
  metodeData.forEach((m) => {
    sel.innerHTML += `<option value="${m.id_metode}">${m.nama_metode}</option>`;
  });
}

// ══════════════════════════════════════
//   SUBMIT TRANSAKSI
// ══════════════════════════════════════
async function submitTransaksi() {
  if (!cart.length) return;

  const btn = document.getElementById("btnSubmit");
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

  const payload = {
    kasir_id: kasirData.id || null,
    tipe_order: document.getElementById("tipeOrder").value,
    id_meja: document.getElementById("selectMeja").value || null,
    id_metode: document.getElementById("selectMetode").value,
    catatan: document.getElementById("catatanOrder").value,
    items: cart.map((c) => ({
      id_menu: c.id_menu,
      qty: c.qty,
      subtotal: c.harga * c.qty,
    })),
    total: cart.reduce((s, c) => s + c.harga * c.qty, 0),
  };

  try {
    const res = await fetch("../../api/transaksi.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || !data.success)
      throw new Error(data.message || "Gagal menyimpan transaksi");

    // Reset
    cart = [];
    renderCart();
    renderMenuGrid();
    document.getElementById("catatanOrder").value = "";

    showToast(
      `Transaksi #${data.id_transaksi} berhasil! Total ${formatRp(payload.total)}`,
      "success",
    );

    const metodeText =
      document.getElementById("selectMetode").options[
        document.getElementById("selectMetode").selectedIndex
      ].text;

    if (metodeText.toLowerCase().includes("qris")) {
      tampilkanQris(payload.total, data.id_transaksi);
    }
    loadRiwayat();
  } catch (err) {
    console.error(err);
    showToast("Gagal menyimpan transaksi: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Proses Transaksi';
  }
}

// ══════════════════════════════════════
//   RIWAYAT
// ══════════════════════════════════════
async function loadRiwayat() {
  const tanggal = document.getElementById("filterTanggal").value;
  const status = document.getElementById("filterStatus").value;
  const tipe = document.getElementById("filterTipe").value;

  const params = new URLSearchParams({ action: "get_riwayat" });
  if (tanggal) params.append("tanggal", tanggal);
  if (status) params.append("status", status);
  if (tipe) params.append("tipe", tipe);

  const tbody = document.getElementById("riwayatBody");
  tbody.innerHTML = `<tr><td colspan="9" class="empty-table"><i class="fa-solid fa-spinner fa-spin"></i><p>Memuat data...</p></td></tr>`;

  try {
    const res = await fetch(`../../api/riwayat.php?${params}`);
    const filtered = await res.json();

    // Stats
    const selesai = filtered.filter((t) => t.status === "Selesai");
    const batal = filtered.filter((t) => t.status === "Dibatalkan");
    const pendapatan = selesai.reduce((s, t) => s + Number(t.total), 0);

    document.getElementById("statTotal").textContent = filtered.length;
    document.getElementById("statSelesai").textContent = selesai.length;
    document.getElementById("statBatal").textContent = batal.length;
    document.getElementById("statPendapatan").textContent =
      formatRp(pendapatan);
    document.getElementById("badgeCount").textContent = filtered.length;

    updateSidebarStats(selesai.length, pendapatan);

    // Table
    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="empty-table"><i class="fa-solid fa-inbox"></i><p>Tidak ada transaksi</p></td></tr>`;
      return;
    }

    tbody.innerHTML = filtered
      .map(
        (t) => `
           <tr>
    <td class="td-id">#${t.id_transaksi}</td>
    <td class="td-time">${t.waktu}</td>
    <td>${t.nama_kasir}</td>
    <td><span class="badge-tipe">${t.tipe_order}</span></td>
    <td>${t.nomor_meja ?? "—"}</td>
    <td>${t.metode_bayar}</td>
    <td><span class="badge-status badge-${t.status.toLowerCase().replace("dibatalkan", "batal").replace("selesai", "selesai").replace("menunggu", "pending")}">
        <i class="fa-solid ${t.status === "Selesai" ? "fa-check" : t.status === "Menunggu" ? "fa-clock" : "fa-xmark"}"></i> ${t.status}
    </span></td>
    <td class="td-total">${formatRp(t.total)}</td>
    <td><button class="btn-detail" onclick='showDetail(${JSON.stringify(t)})'><i class="fa-solid fa-eye"></i> Detail</button></td>
</tr>
        `,
      )
      .join("");
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="9" class="empty-table"><i class="fa-solid fa-triangle-exclamation"></i><p>Gagal memuat data riwayat</p></td></tr>`;
  }
}

function updateSidebarStats(trxCount, income) {
  document.getElementById("sidebarTrxCount").textContent =
    trxCount !== undefined ? trxCount : "—";
  document.getElementById("sidebarIncome").textContent = formatRp(
    income !== undefined ? income : 0,
  );
}

// ══════════════════════════════════════
//   MODAL DETAIL
// ══════════════════════════════════════
function showDetail(trx) {
  document.getElementById("modalTitle").textContent =
    `Transaksi #${trx.id_transaksi}`;
  document.getElementById("modalSub").textContent =
    `${trx.tanggal || "Hari ini"} — ${trx.waktu}`;

  document.getElementById("modalMeta").innerHTML = `
        <div class="modal-meta-item"><label>Kasir</label><span>${trx.nama_kasir}</span></div>
        <div class="modal-meta-item"><label>Tipe</label><span>${trx.tipe_order}</span></div>
        <div class="modal-meta-item"><label>Meja</label><span>${trx.nomor_meja ?? "-"}</span></div>
        <div class="modal-meta-item"><label>Metode</label><span>${trx.metode_bayar}</span></div>
        <div class="modal-meta-item"><label>Status</label><span style="color:${trx.status === "Selesai" ? "var(--success)" : "var(--danger)"}">${trx.status}</span></div>
        ${trx.catatan ? `<div class="modal-meta-item" style="grid-column:1/-1"><label>Catatan</label><span>${trx.catatan}</span></div>` : ""}
    `;

  if (trx.items && trx.items.length) {
    document.getElementById("modalItems").innerHTML = trx.items
      .map(
        (i) => `
            <div class="modal-item">
                <span class="modal-item-name">${i.nama}</span>
                <span class="modal-item-qty">×${i.qty}</span>
                <span class="modal-item-sub">${formatRp(i.subtotal)}</span>
            </div>
        `,
      )
      .join("");
  } else {
    document.getElementById("modalItems").innerHTML =
      `<p style="color:var(--text-dim);font-size:13px;text-align:center;padding:16px">Tidak ada detail item</p>`;
  }

  document.getElementById("modalTotal").textContent = formatRp(trx.total);
  document.getElementById("modalOverlay").classList.add("show");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("show");
}
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ══════════════════════════════════════
//   TAB SWITCHING
// ══════════════════════════════════════
function switchTab(tab, el) {
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".sidebar-item")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(`panel-${tab}`).classList.add("active");
  el.classList.add("active");
  if (tab === "riwayat") loadRiwayat();
}

// ══════════════════════════════════════
//   TOAST
// ══════════════════════════════════════
function showToast(msg, type = "success") {
  const icon = type === "success" ? "fa-circle-check" : "fa-circle-exclamation";
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
  document.getElementById("toastContainer").appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ══════════════════════════════════════
//   UTILS
// ══════════════════════════════════════
function formatRp(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function toCRC16(input) {
  let crc = 0xffff;

  for (let c = 0; c < input.length; c++) {
    crc ^= input.charCodeAt(c) << 8;

    for (let i = 0; i < 8; i++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }

      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function makeDynamicQRIS(qris, nominal) {
  qris = qris.slice(0, -4);

  qris = qris.replace("010211", "010212");

  const nominalTag =
    "54" + nominal.toString().length.toString().padStart(2, "0") + nominal;

  if (qris.includes("5802ID")) {
    qris = qris.replace("5802ID", nominalTag + "5802ID");
  } else {
    qris += nominalTag;
  }

  qris += "6304";

  qris += toCRC16(qris);

  return qris;
}

async function tampilkanQris(total, idTransaksi) {
  const res = await fetch("../../Api/generate_qris.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: total,
    }),
  });

  const data = await res.json();

  if (data.status !== "success") {
    alert("Gagal membuat QRIS");
    return;
  }

  const modal = document.createElement("div");

  modal.innerHTML = `
    
    <div id="qrisModalOverlay">
    
        <div id="qrisModal">

            <button id="closeQris">×</button>

            <div id="qrisContent">

                <h2>Scan QRIS Pembayaran</h2>

                <img 
                src="data:image/png;base64,${data.qris_base64}">

                <div class="qrisNominal">
                    ${formatRp(total)}
                </div>

                <div class="qrisStatus">
                    Menunggu pembayaran...
                </div>

            </div>

        </div>

    </div>
    `;

  document.body.appendChild(modal);

  document.getElementById("closeQris").onclick = () => {
    modal.remove();
  };

  cekStatusPembayaran(idTransaksi, modal);
}

function logout() {
  sessionStorage.clear();
  localStorage.removeItem("kasir");
  showToast("Berhasil keluar. Sampai jumpa!", "success");
  setTimeout(() => (window.location.href = "../login/index.php"), 1500);
}
function cekStatusPembayaran(idTransaksi, modal) {
  const emailInterval = setInterval(() => {
    fetch("../../Api/cek_email.php");
  }, 5000);

  const interval = setInterval(() => {
    fetch(`../../Api/cek_status.php?id=${idTransaksi}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "Selesai") {
          document.getElementById("qrisContent").innerHTML = `

<div class="qrisSuccess">

    <div class="successIcon">
        ✔
    </div>

    <h2 class="successTitle">
        Transaksi Berhasil
    </h2>

    <p class="successDesc">
        Pembayaran telah diterima
    </p>

</div>

                `;

          clearInterval(emailInterval);
          clearInterval(interval);

          setTimeout(() => {
            modal.remove();
          }, 5000);
        }
      });
  }, 2000);
}