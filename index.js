const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// FULL UI FRONTEND (REPLIKA PERSIS SCREENSHOT)
// ==========================================
const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>S3L GMAIL ZERO99 - Storan Gmail</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #eef6ff; padding-bottom: 100px; color: #1e293b; min-height: 100vh; }

    /* AUTH PAGE STYLING */
    #auth-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .brand-logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 20px; color: #000; margin-bottom: 25px; }
    .brand-logo i { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 10px; border-radius: 50%; font-size: 16px; }
    .brand-logo span { color: #2563eb; }

    .auth-card { background: white; width: 100%; max-width: 400px; border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
    .auth-tabs { display: flex; background: #f1f5f9; padding: 4px; border-radius: 14px; margin-bottom: 20px; }
    .auth-tab { flex: 1; text-align: center; padding: 10px; font-size: 14px; font-weight: 600; color: #64748b; border-radius: 10px; cursor: pointer; transition: 0.2s; }
    .auth-tab.active { background: white; color: #000; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }

    .btn-google { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 20px; }
    .divider { text-align: center; color: #94a3b8; font-size: 12px; margin-bottom: 20px; position: relative; }
    .divider::before, .divider::after { content: ""; position: absolute; top: 50%; width: 40%; height: 1px; background: #e2e8f0; }
    .divider::before { left: 0; } .divider::after { right: 0; }

    .form-group { margin-bottom: 15px; text-align: left; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px; }
    .form-group input { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; outline: none; background: #f8fafc; }
    .form-group input:focus { border-color: #2563eb; background: white; }

    .btn-primary { width: 100%; padding: 14px; border: none; border-radius: 12px; background: #2563eb; color: white; font-weight: 700; font-size: 15px; cursor: pointer; margin-top: 10px; }

    /* MAIN APP STYLING */
    #app-page { display: none; }
    .app-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: transparent; }
    .wa-channel-btn { background: white; padding: 8px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); text-decoration: none; }

    .container { max-width: 480px; margin: 0 auto; padding: 0 16px; }

    /* BLUE SALDO CARD */
    .saldo-card { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; border-radius: 24px; padding: 22px; box-shadow: 0 10px 25px rgba(29, 78, 216, 0.25); margin-bottom: 16px; }
    .saldo-card .title { font-size: 11px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
    .saldo-card .amount { font-size: 32px; font-weight: 800; margin: 8px 0 4px; }
    .saldo-card .rate { font-size: 12px; opacity: 0.9; margin-bottom: 16px; }
    .saldo-actions { display: flex; gap: 10px; }
    .btn-action { flex: 1; padding: 10px; border-radius: 12px; border: none; background: rgba(255,255,255,0.25); color: white; font-weight: 600; font-size: 13px; cursor: pointer; backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; gap: 6px; }

    /* GRID MENU TOP */
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
    .menu-card { background: white; padding: 14px 8px; border-radius: 20px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); cursor: pointer; }
    .menu-card .icon-box { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 18px; color: white; }
    .menu-card span { font-size: 12px; font-weight: 600; color: #334155; }

    .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; background: white; padding: 16px 10px; border-radius: 20px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .sub-menu { text-align: center; cursor: pointer; }
    .sub-menu i { font-size: 18px; color: #2563eb; margin-bottom: 6px; display: block; }
    .sub-menu span { font-size: 10px; font-weight: 600; color: #64748b; }

    /* STATS GRID */
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .stat-card { background: white; padding: 14px; border-radius: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .stat-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
    .stat-info .label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
    .stat-info .val { font-size: 16px; font-weight: 800; color: #1e293b; }

    /* CARD BOX */
    .card-box { background: white; padding: 18px; border-radius: 20px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
    .card-box h3 { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }

    /* BOTTOM NAV */
    .bottom-nav { position: fixed; bottom: 15px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 440px; background: white; border-radius: 30px; display: flex; justify-content: space-around; align-items: center; padding: 8px 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); z-index: 999; }
    .nav-link { text-align: center; color: #94a3b8; text-decoration: none; font-size: 10px; font-weight: 600; flex: 1; cursor: pointer; }
    .nav-link i { font-size: 18px; display: block; margin-bottom: 2px; }
    .nav-link.active { color: #2563eb; }

    /* FAB STOR BUTTON */
    .fab-stor { width: 52px; height: 52px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4); margin-top: -25px; border: 4px solid #eef6ff; cursor: pointer; }

    /* ALERTS & INPUTS */
    .alert-yellow { background: #fef9c3; border: 1px solid #fef08a; padding: 12px; border-radius: 14px; font-size: 12px; color: #854d0e; margin-bottom: 12px; }
    .alert-purple { background: #f3e8ff; border: 1px solid #e9d5ff; padding: 12px; border-radius: 14px; font-size: 12px; color: #6b21a8; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
    .alert-blue { background: #eff6ff; border: 1px solid #dbeafe; padding: 12px; border-radius: 14px; font-size: 12px; color: #1e40af; margin-bottom: 12px; }

    textarea { width: 100%; height: 150px; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px; font-size: 13px; outline: none; background: #f8fafc; resize: none; margin-bottom: 12px; }
    textarea:focus { border-color: #2563eb; background: white; }

    .tab-view { display: none; }
    .tab-view.active { display: block; }
  </style>
</head>
<body>

  <!-- PAGE 1: LOGIN / DAFTAR -->
  <div id="auth-page">
    <div class="brand-logo">
      <i class="fa-solid fa-envelope"></i> S3L GMAIL <span>ZERO99</span>
    </div>

    <div class="auth-card">
      <div class="auth-tabs">
        <div class="auth-tab active" id="tab-masuk-btn" onclick="switchAuthTab('masuk')">Masuk</div>
        <div class="auth-tab" id="tab-daftar-btn" onclick="switchAuthTab('daftar')">Daftar</div>
      </div>

      <button class="btn-google" onclick="loginSuccess()">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google">
        Lanjutkan dengan Google
      </button>

      <div class="divider">atau</div>

      <!-- FORM MASUK -->
      <form id="form-masuk" onsubmit="event.preventDefault(); loginSuccess();">
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="anda@email.com" required>
        </div>
        <div class="form-group">
          <div style="display: flex; justify-content: space-between;">
            <label>Password</label>
            <a href="#" style="font-size: 11px; color: #2563eb; text-decoration: none;">Lupa Kata Sandi?</a>
          </div>
          <input type="password" placeholder="Minimal 6 karakter" required>
        </div>
        <button type="submit" class="btn-primary">Masuk</button>
      </form>

      <!-- FORM DAFTAR -->
      <form id="form-daftar" style="display: none;" onsubmit="event.preventDefault(); loginSuccess();">
        <div class="form-group">
          <label>Nama</label>
          <input type="text" placeholder="Nama lengkap" required>
        </div>
        <div class="form-group">
          <label>Kode Referral <span style="color: #94a3b8; font-weight: 400;">(opsional)</span></label>
          <input type="text" placeholder="KODE DARI TEMAN">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="anda@email.com" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" placeholder="Minimal 6 karakter" required>
        </div>
        <button type="submit" class="btn-primary">Daftar Sekarang</button>
      </form>
    </div>
  </div>

  <!-- PAGE 2: DASHBOARD / WEB UTAMA -->
  <div id="app-page">
    <div class="app-header">
      <div class="brand-logo" style="margin-bottom: 0; font-size: 16px;">
        <i class="fa-solid fa-envelope" style="padding: 6px; font-size: 12px;"></i> S3L <span>ZERO99</span>
      </div>
      <a href="https://wa.me/62831869555340" target="_blank" class="wa-channel-btn">
        <i class="fa-regular fa-comment-dots" style="color: #2563eb;"></i> Saluran WA
      </a>
    </div>

    <div class="container">

      <!-- TAB 1: BERANDA -->
      <div id="view-beranda" class="tab-view active">
        <div class="saldo-card">
          <div class="title"><i class="fa-solid fa-wallet"></i> SALDO ANDA</div>
          <div class="amount">Rp0</div>
          <div class="rate">Harga / Gmail: <b>Rp4.700</b></div>
          <div class="saldo-actions">
            <button class="btn-action" onclick="switchTab('saldo')"><i class="fa-solid fa-download"></i> Tarik Saldo</button>
            <button class="btn-action" onclick="switchTab('riwayat')"><i class="fa-solid fa-clock-rotate-left"></i> Riwayat</button>
          </div>
        </div>

        <div class="grid-4">
          <div class="menu-card" onclick="switchTab('stor')">
            <div class="icon-box" style="background: #2563eb;"><i class="fa-solid fa-paper-plane"></i></div>
            <span>Stor</span>
          </div>
          <div class="menu-card" onclick="switchTab('riwayat')">
            <div class="icon-box" style="background: #10b981;"><i class="fa-solid fa-clock-rotate-left"></i></div>
            <span>Riwayat</span>
          </div>
          <div class="menu-card" onclick="switchTab('saldo')">
            <div class="icon-box" style="background: #f59e0b;"><i class="fa-solid fa-wallet"></i></div>
            <span>Saldo</span>
          </div>
          <div class="menu-card" onclick="alert('Rules: Gmail Fresh, Pass: fineirga, Rp4.700/acc')">
            <div class="icon-box" style="background: #a855f7;"><i class="fa-solid fa-book"></i></div>
            <span>Rules</span>
          </div>
        </div>

        <div class="grid-5">
          <div class="sub-menu"><i class="fa-solid fa-headset"></i><span>Zero Support</span></div>
          <div class="sub-menu"><i class="fa-solid fa-comments"></i><span>Komunitas</span></div>
          <div class="sub-menu"><i class="fa-solid fa-trophy"></i><span>Leaderboard</span></div>
          <div class="sub-menu"><i class="fa-solid fa-gift"></i><span>Referral</span></div>
          <div class="sub-menu"><i class="fa-solid fa-ticket"></i><span>Laporan</span></div>
        </div>

        <div class="card-box" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;" onclick="alert('Buka S&K Lengkap')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white;">
              <i class="fa-solid fa-scale-balanced"></i>
            </div>
            <div>
              <div style="font-size: 13px; font-weight: 700;">Syarat & Ketentuan</div>
              <div style="font-size: 11px; color: #64748b;">Baca ketentuan penggunaan platform</div>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right" style="color: #cbd5e1; font-size: 12px;"></i>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: #dcfce7; color: #16a34a;"><i class="fa-solid fa-circle-check"></i></div>
            <div class="stat-info"><div class="label">DITERIMA</div><div class="val">0</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #fef9c3; color: #ca8a04;"><i class="fa-regular fa-clock"></i></div>
            <div class="stat-info"><div class="label">PENDING</div><div class="val">0</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #ffe4e6; color: #e11d48;"><i class="fa-solid fa-circle-xmark"></i></div>
            <div class="stat-info"><div class="label">DITOLAK</div><div class="val">0</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: #eff6ff; color: #2563eb;"><i class="fa-regular fa-envelope"></i></div>
            <div class="stat-info"><div class="label">HARGA</div><div class="val">Rp4.700</div></div>
          </div>
        </div>

        <div class="card-box">
          <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">KUALITAS AKUN</div>
          <div style="background: #f1f5f9; padding: 6px 12px; border-radius: 20px; display: inline-block; font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 15px;">— · Belum Ada Data</div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
            <span>Limit Storan Hari Ini</span>
            <span style="color: #2563eb;">0/50 · Sisa 50</span>
          </div>
        </div>
      </div>

      <!-- TAB 2: RIWAYAT -->
      <div id="view-riwayat" class="tab-view">
        <div class="card-box">
          <input type="text" placeholder="Cari Gmail..." style="width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 13px; outline: none; margin-bottom: 12px;">
          <div style="display: flex; gap: 6px; margin-bottom: 12px;">
            <button style="padding: 6px 14px; background: #2563eb; color: white; border: none; border-radius: 20px; font-size: 11px; font-weight: 600;">Semua</button>
            <button style="padding: 6px 14px; background: #f1f5f9; color: #64748b; border: none; border-radius: 20px; font-size: 11px; font-weight: 600;">Pending</button>
            <button style="padding: 6px 14px; background: #f1f5f9; color: #64748b; border: none; border-radius: 20px; font-size: 11px; font-weight: 600;">Diterima</button>
            <button style="padding: 6px 14px; background: #f1f5f9; color: #64748b; border: none; border-radius: 20px; font-size: 11px; font-weight: 600;">Ditolak</button>
          </div>
          <div style="text-align: center; padding: 40px 0; color: #94a3b8; font-size: 13px;">Belum ada setoran.</div>
        </div>
      </div>

      <!-- TAB 3: STOR -->
      <div id="view-stor" class="tab-view">
        <div class="alert-yellow">
          <i class="fa-solid fa-triangle-exclamation"></i> <b>Storan sedang dibuka</b><br>
          <span style="font-size: 11px; opacity: 0.8;">Silakan masukkan daftar Gmail fresh kamu di bawah ini.</span>
        </div>

        <div class="alert-purple">
          <div>
            <b>Cek Rules dulu sebelum stor</b><br>
            <span style="font-size: 11px; opacity: 0.8;">Wajib dibaca agar Gmail tidak ditolak.</span>
          </div>
          <button style="background: #9333ea; color: white; border: none; padding: 6px 12px; border-radius: 10px; font-size: 11px; font-weight: 700;" onclick="alert('Rules: Wajib Akhiran angka 1-100, Pass: fineirga')">Buka Rules</button>
        </div>

        <div class="card-box">
          <h3 style="margin-bottom: 4px;">Setor Daftar Gmail</h3>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Tempel daftar, satu Gmail per baris. Duplikat otomatis dihapus.</p>

          <div class="alert-blue">
            <b>Wajib diakhiri angka 1–100</b><br>
            <span style="font-size: 11px;">Angka harus tepat sebelum @gmail.com, tanpa huruf/simbol setelahnya.<br>
            Contoh: <b>gmail01@gmail.com</b>, <b>gmail100@gmail.com</b></span>
          </div>

          <div class="alert-yellow" style="background: #fffbe2; border-color: #fef08a; color: #a16207;">
            🔑 <b>Password wajib untuk Gmail yang disetor: <span style="color: #d97706;">fineirga</span></b><br>
            <span style="font-size: 11px;">Pastikan setiap Gmail menggunakan password di atas. Gmail dengan password berbeda akan ditolak.</span>
          </div>

          <form action="/kirim" method="POST">
            <textarea name="emails" placeholder="gmail01@gmail.com&#10;gmail02@gmail.com" required></textarea>
            <button type="submit" class="btn-primary" style="background: #2563eb;">Kirim Setoran</button>
          </form>
        </div>
      </div>

      <!-- TAB 4: SALDO -->
      <div id="view-saldo" class="tab-view">
        <div class="saldo-card">
          <div style="font-size: 12px; opacity: 0.9;">Saldo saat ini</div>
          <div class="amount">Rp0</div>
          <button class="btn-action" style="width: 100%; margin-top: 10px;" onclick="alert('Saldo kurang dari Rp1.000')"><i class="fa-solid fa-download"></i> Tarik Saldo</button>
          <div style="background: rgba(255,255,255,0.15); padding: 8px 12px; border-radius: 10px; font-size: 11px; margin-top: 12px;">ℹ️ Saldo kamu Rp0, kurang Rp1.000 lagi untuk mencapai minimum penarikan Rp1.000.</div>
        </div>

        <div style="background: #dcfce7; border: 1px solid #bbf7d0; color: #15803d; padding: 12px 16px; border-radius: 16px; font-size: 13px; font-weight: 700; margin-bottom: 16px;">
          Status Penarikan: 🟢 Dibuka
        </div>

        <div class="card-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="margin: 0;">Nomor DANA Tersimpan</h3>
            <span style="background: #fef3c7; color: #d97706; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 700;">Belum diisi</span>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-bottom: 12px;">Simpan nomor DANA Anda agar tidak perlu mengetik ulang setiap penarikan. Hanya angka, 10–15 digit.</p>
          <input type="number" placeholder="081234567890" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; outline: none; margin-bottom: 12px;">
          <button class="btn-primary" onclick="alert('Nomor DANA tersimpan!')">Simpan</button>
        </div>

        <div class="card-box">
          <h3>Riwayat Penarikan</h3>
          <div style="text-align: center; padding: 20px 0; color: #94a3b8; font-size: 12px;">Belum ada penarikan.</div>
        </div>
      </div>

      <!-- TAB 5: PROFIL -->
      <div id="view-profil" class="tab-view">
        <div class="card-box" style="text-align: center; padding-top: 25px;">
          <div style="position: relative; width: 80px; height: 80px; margin: 0 auto 12px;">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            <div style="position: absolute; bottom: 0; right: 0; background: #2563eb; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; border: 2px solid white;">
              <i class="fa-solid fa-camera"></i>
            </div>
          </div>
          <h2 style="font-size: 18px; font-weight: 800;">Santani Eni</h2>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 15px;">santanieni@gmail.com</p>

          <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
            <button style="padding: 6px 14px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-camera"></i> Ganti Foto</button>
            <button style="padding: 6px 14px; border: 1px solid #ffe4e6; background: #fff1f2; color: #e11d48; border-radius: 10px; font-size: 12px; font-weight: 600;"><i class="fa-solid fa-trash"></i> Hapus</button>
          </div>

          <div class="form-group"><label>UID</label><input type="text" value="fba28858-081b-4712-b958-1c878855e..." readonly></div>
          <div class="form-group"><label>EMAIL</label><input type="text" value="santanieni@gmail.com" readonly></div>
          <div class="form-group"><label>NOMOR DANA</label><input type="text" value="Belum diatur" readonly></div>
          <div class="form-group"><label>ROLE</label><input type="text" value="User" readonly></div>
        </div>

        <div class="card-box">
          <h3 style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-trophy" style="color: #2563eb;"></i> Statistik Total</h3>
          <div class="stats-grid">
            <div style="background: #f8fafc; padding: 12px; border-radius: 12px; text-align: center;"><div style="font-size: 18px; font-weight: 800; color: #2563eb;">0</div><div style="font-size: 10px; color: #64748b; font-weight: 700;">Total Storan</div></div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 12px; text-align: center;"><div style="font-size: 18px; font-weight: 800; color: #16a34a;">0</div><div style="font-size: 10px; color: #64748b; font-weight: 700;">Diterima</div></div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 12px; text-align: center;"><div style="font-size: 18px; font-weight: 800; color: #e11d48;">0</div><div style="font-size: 10px; color: #64748b; font-weight: 700;">Ditolak</div></div>
            <div style="background: #f8fafc; padding: 12px; border-radius: 12px; text-align: center;"><div style="font-size: 18px; font-weight: 800; color: #ca8a04;">0</div><div style="font-size: 10px; color: #64748b; font-weight: 700;">Pending</div></div>
          </div>
        </div>

        <button class="btn-primary" style="background: white; border: 1px solid #ffe4e6; color: #e11d48; margin-bottom: 20px;" onclick="location.reload();">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar dari Akun
        </button>
      </div>

    </div>

    <!-- FLOATING BOTTOM NAVIGATION BAR -->
    <div class="bottom-nav">
      <div class="nav-link active" id="nav-beranda" onclick="switchTab('beranda')">
        <i class="fa-solid fa-house"></i>Beranda
      </div>
      <div class="nav-link" id="nav-riwayat" onclick="switchTab('riwayat')">
        <i class="fa-solid fa-clock-rotate-left"></i>Riwayat
      </div>
      <div class="fab-stor" onclick="switchTab('stor')">
        <i class="fa-solid fa-paper-plane"></i>
      </div>
      <div class="nav-link" id="nav-saldo" onclick="switchTab('saldo')">
        <i class="fa-solid fa-wallet"></i>Saldo
      </div>
      <div class="nav-link" id="nav-profil" onclick="switchTab('profil')">
        <i class="fa-regular fa-user"></i>Profil
      </div>
    </div>
  </div>

  <script>
    function switchAuthTab(type) {
      document.getElementById('tab-masuk-btn').classList.remove('active');
      document.getElementById('tab-daftar-btn').classList.remove('active');
      document.getElementById('form-masuk').style.display = 'none';
      document.getElementById('form-daftar').style.display = 'none';

      if (type === 'masuk') {
        document.getElementById('tab-masuk-btn').classList.add('active');
        document.getElementById('form-masuk').style.display = 'block';
      } else {
        document.getElementById('tab-daftar-btn').classList.add('active');
        document.getElementById('form-daftar').style.display = 'block';
      }
    }

    function loginSuccess() {
      document.getElementById('auth-page').style.display = 'none';
      document.getElementById('app-page').style.display = 'block';
    }

    function switchTab(tabName) {
      document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

      const targetView = document.getElementById('view-' + tabName);
      if (targetView) targetView.classList.add('active');

      const targetNav = document.getElementById('nav-' + tabName);
      if (targetNav) targetNav.classList.add('active');

      window.scrollTo(0, 0);
    }
  </script>
</body>
</html>`;

// REDIRECT DAN MENGATUR ROUTE /dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  res.send(htmlContent);
});

// BACKEND PENERIMA DATA SETORAN
app.post('/kirim', async (req, res) => {
  try {
    const emailsRaw = req.body.emails || '';
    const emailsArray = emailsRaw.split('\n').map(e => e.trim()).filter(e => e.length > 0);
    const jumlah = emailsArray.length;

    if (jumlah === 0) {
      return res.send("<script>alert('❌ Gmail tidak boleh kosong!'); window.location='/dashboard';</script>");
    }

    const now = new Date();
    const tanggal = new Date(now.getTime() + (7 * 60 * 60 * 1000)).toISOString().replace('T', ' ').substring(0, 19);

    // PASTE URL GOOGLE APPS SCRIPT KAMU DI SINI:
    const webAppUrl = "https://script.google.com/macros/s/GANTI_DENGAN_URL_WEB_APP_KAMU/exec";

    const sheetData = emailsArray.map(email => [tanggal, "User Web", email, "Pending", 4700]);

    axios.post(webAppUrl, { values: sheetData }, {
      headers: { 'Content-Type': 'application/json' },
      maxRedirects: 5
    }).catch(err => console.error("Sheet Error:", err.message));

    // FONNTE WHATSAPP INTEGRATION
    const totalHarga = (jumlah * 4700).toLocaleString('id-ID');
    let pesan = "⚠️ *ORDER BARU MASUK!* ⚠️\n\n";
    pesan += `Tanggal: ${tanggal}\n`;
    pesan += `Jumlah: ${jumlah} Gmail\n`;
    pesan += `Total: Rp${totalHarga}\n\n`;
    pesan += "Cek Sheet: DAFZGMAIL99";

    const fonnteParams = new URLSearchParams();
    fonnteParams.append('target', '62831869555340');
    fonnteParams.append('message', pesan);
    fonnteParams.append('token', 'h3MRfJnexR56FYxRM9ZQ');

    axios.post('https://api.fonnte.com/send', fonnteParams).catch(err => console.error("WA Error:", err.message));

    return res.send(`<script>alert('✅ ${jumlah} Gmail berhasil dikirim!'); window.location='/dashboard';</script>`);
  } catch (error) {
    console.error("Kirim Error:", error);
    return res.send("<script>alert('❌ Terjadi kesalahan!'); window.location='/dashboard';</script>");
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server S3L GMAIL ZERO99 Berhasil Berjalan di Port ${PORT}`);
});