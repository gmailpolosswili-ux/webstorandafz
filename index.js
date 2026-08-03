const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// KONFIGURASI & DATABASE ADMIN (BISA DIUBAH)
// ==========================================
let adminConfig = {
    isStorageOpen: true,
    passwordWajib: "prabujaya",
    hargaPerGmail: 4500,
    suffixWajib: "12", // Sesuai rules baru (angka 12 di belakang nama gmail)
    rulesText: `1. Setor hanya alamat @gmail.com dan dapat di baca, umur minimal 19 tahun ke atas, jenis kelamin bebas. Wajib Gmail Fresh Hasil Buatan Sendiri
- WAJIB MENGGUNAKAN ANGKA 12 DI BELAKANG NAMA GMAIL, CONTOH : usmanto12@gmail.com, kalaiolko12@gmail.com
2. Password Wajib: prabujaya
3. Gmail duplikat tidak dihitung.
4. Gmail akan dicek oleh admin.
5. Gmail valid akan dibayar sesuai harga yang berlaku. (Jangan Menyetor Email Yang Sudah Pernah Dijual Ke Orang Lain!)
6. Gmail yang tidak lolos review akan ditolak tanpa reward.
7. Akun wajib bersih, No email pemulihan dan nomor hp, no verifikasi 2 langkah dan lain lain.
8. Dilarang otak atik akun setelah di setor (Menyebab dana tidak bisa di carikan)
9. Akun wajib no verif & no tap tap
10. Pembayaran akan di lakukan setelah selesai semua Rekapan Laporan`
};

let databaseSetoran = [];

// Rute Halaman Utama (Menampilkan index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint untuk memproses setoran Gmail
app.post('/api/stor-gmail', (req, res) => {
    if (!adminConfig.isStorageOpen) {
        return res.status(400).json({
            success: false,
            message: "Maaf, storan sedang ditutup oleh admin."
        });
    }

    const { emails, password } = req.body;

    // 1. Validasi Password Wajib
    if (password !== adminConfig.passwordWajib) {
        return res.status(400).json({ 
            success: false, 
            message: `Password salah! Password wajib untuk Gmail yang disetor adalah '${adminConfig.passwordWajib}'.` 
        });
    }

    if (!emails) {
        return res.status(400).json({ success: false, message: "Daftar email tidak boleh kosong." });
    }

    // 2. Pecah baris email
    const emailList = emails.split('\n').map(e => e.trim()).filter(e => e !== '');
    
    // Validasi regex: Sesuai rules wajib menggunakan angka 12 tepat sebelum @gmail.com
    const validasiRegex = new RegExp(`^[a-zA-Z0-9._%+-]+${adminConfig.suffixWajib}@gmail\\.com$`);

    let dataBaruBerhasil = [];
    let dataDitolak = [];

    for (let email of emailList) {
        if (validasiRegex.test(email)) {
            const sudahAda = databaseSetoran.some(item => item.email === email);
            if (!sudahAda) {
                const itemBaru = {
                    email: email,
                    status: "DITERIMA",
                    harga: adminConfig.hargaPerGmail,
                    waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
                };
                dataBaruBerhasil.push(itemBaru);
                databaseSetoran.push(itemBaru);
            }
        } else {
            dataDitolak.push(email);
        }
    }

    if (dataBaruBerhasil.length === 0) {
        return res.status(400).json({
            success: false,
            message: `Semua Gmail ditolak. Pastikan format berakhiran angka ${adminConfig.suffixWajib} tepat sebelum @gmail.com.`
        });
    }

    return res.status(200).json({
        success: true,
        message: `Berhasil! ${dataBaruBerhasil.length} Gmail diterima.`,
        dataDiterima: dataBaruBerhasil,
        dataDitolak: dataDitolak
    });
});

// Endpoint untuk mengambil riwayat / data setoran
app.get('/api/admin/riwayat', (req, res) => {
    return res.status(200).json({
        success: true,
        totalTerima: databaseSetoran.length,
        riwayat: databaseSetoran
    });
});

// Endpoint untuk mengecek status & rules aplikasi
app.get('/api/status', (req, res) => {
    return res.status(200).json({
        success: true,
        config: adminConfig
    });
});

// Endpoint Admin untuk mengubah Status Buka/Tutup & Rules
app.post('/api/admin/update-config', (req, res) => {
    const { isStorageOpen, passwordWajib, hargaPerGmail, suffixWajib, rulesText, adminSecret } = req.body;

    // Proteksi sederhana untuk admin (bisa disesuaikan)
    if (adminSecret && adminSecret !== "adminzuxyy") {
        return res.status(403).json({ success: false, message: "Unauthorized admin key." });
    }

    if (isStorageOpen !== undefined) adminConfig.isStorageOpen = Boolean(isStorageOpen);
    if (passwordWajib) adminConfig.passwordWajib = passwordWajib;
    if (hargaPerGmail) adminConfig.hargaPerGmail = Number(hargaPerGmail);
    if (suffixWajib) adminConfig.suffixWajib = suffixWajib;
    if (rulesText) adminConfig.rulesText = rulesText;

    return res.status(200).json({
        success: true,
        message: "Konfigurasi & Rules berhasil diperbarui!",
        config: adminConfig
    });
});

// Rute Tampilan Panel Admin HTML
app.get('/paneldafz', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Konfigurasi server lokal & Ekspor untuk Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server berjalan di port ${PORT}`);
    });
}

module.exports = app;
