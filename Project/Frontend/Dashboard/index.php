<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Kasir — Rumah Padang Nusantara</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body>

    <!-- TOAST CONTAINER -->
    <div class="toast-container" id="toastContainer"></div>

    <!-- MODAL DETAIL -->
    <div class="modal-overlay" id="modalOverlay">
        <div class="modal-box">
            <div class="modal-header">
                <div>
                    <h3 id="modalTitle">Detail Transaksi</h3>
                    <p id="modalSub">—</p>
                </div>
                <button class="btn-close-modal" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-meta" id="modalMeta"></div>
            <p class="modal-items-title">Item Pesanan</p>
            <div class="modal-items" id="modalItems"></div>
            <div class="modal-total">
                <span>Total Pembayaran</span>
                <span id="modalTotal">—</span>
            </div>
        </div>
    </div>

    <!-- PRINT AREA (hidden) -->
    <div id="print-area" style="display:none"></div>

    <div class="dashboard-layout">

        <!-- TOPBAR -->
        <header class="topbar">
            <a href="#" class="topbar-logo">
                <div class="topbar-logo-icon"><i class="fa-solid fa-utensils"></i></div>
                <span class="topbar-logo-text">Rumah Padang <span>Nusantara</span></span>
            </a>
            <div class="topbar-divider"></div>
            <span class="topbar-badge">Kasir</span>
            <div class="topbar-spacer"></div>
            <div class="topbar-info">
                <div class="topbar-date">
                    <strong id="topbarDate">—</strong>
                    <span id="topbarTime">—</span>
                </div>
                <div class="topbar-user">
                    <div class="topbar-avatar" id="topbarAvatar">K</div>
                    <div class="topbar-user-info">
                        <div class="topbar-user-name" id="topbarName">Kasir</div>
                        <div class="topbar-user-role">Kasir</div>
                    </div>
                </div>
                <button class="btn-logout" onclick="logout()">
                    <i class="fa-solid fa-right-from-bracket"></i> Keluar
                </button>
            </div>
        </header>

        <!-- SIDEBAR -->
        <aside class="sidebar" id="sidebar">
            <span class="sidebar-section-label">Menu Utama</span>
            <button class="sidebar-item active" onclick="switchTab('transaksi', this)">
                <i class="fa-solid fa-plus-circle"></i> Input Transaksi
            </button>
            <button class="sidebar-item" onclick="switchTab('riwayat', this)">
                <i class="fa-solid fa-clock-rotate-left"></i> Riwayat Transaksi
                <span class="item-badge" id="badgeCount">—</span>
            </button>
            <span class="sidebar-section-label" style="margin-top:12px">Shift Hari Ini</span>
            <div class="sidebar-item" style="cursor:default; flex-direction:column; align-items:flex-start; gap:6px; padding:14px">
                <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px;">Transaksi</div>
                <div style="font-size:22px; font-weight:700; font-family:'Playfair Display',serif; color:var(--gold)" id="sidebarTrxCount">—</div>
                <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:1px; margin-top:6px;">Pendapatan</div>
                <div style="font-size:16px; font-weight:700; color:var(--text)" id="sidebarIncome">—</div>
            </div>
        </aside>

        <!-- MAIN -->
        <main class="main-content">

            <!-- ══ TAB: INPUT TRANSAKSI ══ -->
            <div class="tab-panel active" id="panel-transaksi">
                <div class="page-header">
                    <h2><i class="fa-solid fa-receipt" style="color:var(--gold);margin-right:10px;font-size:22px"></i>Input Transaksi</h2>
                    <p>Pilih menu dan tambahkan ke keranjang pesanan</p>
                </div>

                <!-- FILTER KATEGORI -->
                <div class="kategori-filter" id="kategoriFilter">
                    <button class="kat-btn active" data-kat="all" onclick="filterKategori('all', this)">
                        <i class="fa-solid fa-border-all"></i> Semua
                    </button>
                    <!-- Kategori akan di-inject JS -->
                </div>

                <!-- SEARCH -->
                <div class="menu-search-bar">
                    <div class="search-input-wrap">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="menuSearch" placeholder="Cari menu..." oninput="renderMenuGrid()">
                    </div>
                </div>

                <div class="pos-layout">
                    <!-- MENU GRID -->
                    <div class="menu-panel">
                        <div class="menu-grid" id="menuGrid">
                            <!-- skeleton sementara -->
                            <div class="menu-card">
                                <div class="skeleton" style="height:14px;width:60%;margin-bottom:10px"></div>
                                <div class="skeleton" style="height:18px;width:80%;margin-bottom:14px"></div>
                                <div class="skeleton" style="height:14px;width:40%"></div>
                            </div>
                            <div class="menu-card">
                                <div class="skeleton" style="height:14px;width:60%;margin-bottom:10px"></div>
                                <div class="skeleton" style="height:18px;width:80%;margin-bottom:14px"></div>
                                <div class="skeleton" style="height:14px;width:40%"></div>
                            </div>
                            <div class="menu-card">
                                <div class="skeleton" style="height:14px;width:60%;margin-bottom:10px"></div>
                                <div class="skeleton" style="height:18px;width:80%;margin-bottom:14px"></div>
                                <div class="skeleton" style="height:14px;width:40%"></div>
                            </div>
                            <div class="menu-card">
                                <div class="skeleton" style="height:14px;width:60%;margin-bottom:10px"></div>
                                <div class="skeleton" style="height:18px;width:80%;margin-bottom:14px"></div>
                                <div class="skeleton" style="height:14px;width:40%"></div>
                            </div>
                            <div class="menu-card">
                                <div class="skeleton" style="height:14px;width:60%;margin-bottom:10px"></div>
                                <div class="skeleton" style="height:18px;width:80%;margin-bottom:14px"></div>
                                <div class="skeleton" style="height:14px;width:40%"></div>
                            </div>
                            <div class="menu-card">
                                <div class="skeleton" style="height:14px;width:60%;margin-bottom:10px"></div>
                                <div class="skeleton" style="height:18px;width:80%;margin-bottom:14px"></div>
                                <div class="skeleton" style="height:14px;width:40%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- CART -->
                    <div class="cart-panel">
                        <div class="cart-header">
                            <h3><i class="fa-solid fa-shopping-basket"></i> Pesanan</h3>
                            <span class="cart-count" id="cartCount">0 item</span>
                        </div>

                        <div class="cart-items" id="cartItems">
                            <div class="cart-empty">
                                <i class="fa-solid fa-bowl-rice"></i>
                                Belum ada pesanan.<br>Pilih menu di kiri.
                            </div>
                        </div>

                        <div class="cart-footer">
                            <div class="cart-order-meta">
                                <div class="meta-row">
                                    <label><i class="fa-solid fa-store" style="color:var(--gold)"></i> Tipe</label>
                                    <select class="meta-select" id="tipeOrder">
                                        <option value="Dine-in">Dine-in</option>
                                        <option value="Take-away">Take-away</option>
                                        <option value="Online">Online</option>
                                    </select>
                                </div>
                                <div class="meta-row">
                                    <label><i class="fa-solid fa-chair" style="color:var(--gold)"></i> Meja</label>
                                    <select class="meta-select" id="selectMeja">
                                        <option value="">— Tanpa Meja —</option>
                                        <!-- inject JS -->
                                    </select>
                                </div>
                                <div class="meta-row">
                                    <label><i class="fa-solid fa-wallet" style="color:var(--gold)"></i> Bayar</label>
                                    <select class="meta-select" id="selectMetode">
                                        <!-- inject JS -->
                                    </select>
                                </div>
                            </div>

                            <div class="cart-total-section">
                                <div class="total-row"><span>Subtotal</span><span id="totalSubtotal">Rp 0</span></div>
                                <div class="total-row"><span>Diskon</span><span style="color:var(--success)">Rp 0</span></div>
                                <div class="total-row grand"><span>Total</span><span id="totalGrand">Rp 0</span></div>
                            </div>

                            <textarea class="cart-textarea" id="catatanOrder" placeholder="Catatan pesanan (opsional)..."></textarea>

                            <button class="btn-submit" id="btnSubmit" onclick="submitTransaksi()" disabled>
                                
                                <i class="fa-solid fa-check-circle"></i>
                                Proses Transaksi
                            </button>
                            <div id="qrisBox" class="qris-box" style="display:none;">
                                <p class="qris-title">Scan QRIS Untuk Pembayaran</p>

                                <img id="qrisImage" src="" alt="QRIS">

                                <div class="qris-total" id="qrisTotal">
                                    Rp 0
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ══ TAB: RIWAYAT TRANSAKSI ══ -->
            <div class="tab-panel" id="panel-riwayat">
                <div class="page-header">
                    <h2><i class="fa-solid fa-clock-rotate-left" style="color:var(--gold);margin-right:10px;font-size:22px"></i>Riwayat Transaksi</h2>
                    <p>Data transaksi yang sudah diproses hari ini</p>
                </div>

                <!-- STATS BAR -->
                <div class="stats-bar">
                    <div class="stat-card">
                        <div class="stat-icon gold"><i class="fa-solid fa-receipt"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">Total Transaksi</div>
                            <div class="stat-value" id="statTotal">—</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">Selesai</div>
                            <div class="stat-value" id="statSelesai">—</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon red"><i class="fa-solid fa-circle-xmark"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">Dibatalkan</div>
                            <div class="stat-value" id="statBatal">—</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon gold"><i class="fa-solid fa-coins"></i></div>
                        <div class="stat-info">
                            <div class="stat-label">Pendapatan</div>
                            <div class="stat-value gold" id="statPendapatan">—</div>
                        </div>
                    </div>
                </div>

                <!-- FILTER -->
                <div class="riwayat-filters">
                    <input type="date" class="filter-input" id="filterTanggal" onchange="loadRiwayat()">
                    <select class="filter-input" id="filterStatus" onchange="loadRiwayat()">
                        <option value="">Semua Status</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <select class="filter-input" id="filterTipe" onchange="loadRiwayat()">
                        <option value="">Semua Tipe</option>
                        <option value="Dine-in">Dine-in</option>
                        <option value="Take-away">Take-away</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                <!-- TABLE -->
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Waktu</th>
                                <th>Kasir</th>
                                <th>Tipe</th>
                                <th>Meja</th>
                                <th>Metode</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="riwayatBody">
                            <tr>
                                <td colspan="9" class="empty-table"><i class="fa-solid fa-spinner fa-spin"></i>
                                    <p>Memuat data...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </main>
    </div>

    <script src="script.js"></script>
</body>

</html>