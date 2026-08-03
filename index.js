const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// KONFIGURASI & DATABASE SEMENTARA (ADMIN)
// ==========================================
let adminConfig = {
    isStorageOpen: true,
    passwordWajib: "fineirga"
};

let databaseSetoran = [];

// Endpoint untuk memproses setoran Gmail (Sesuai form di aplikasi)
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

    // 2. Pecah baris email yang dimasukkan
    const emailList = emails.split('\n').map(e => e.trim()).filter(e => e !== '');
    
    // Validasi regex: Format harus berakhiran angka 1 sampai 100 tepat sebelum @gmail.com
    const validasiRegex = /^[a-zA-Z0-9._%+-]+([1-9]|[1-9][0-9]|100)@gmail\.com$/;

    let dataBaruBerhasil = [];
    let dataDitolak = [];

    for (let email of emailList) {
        if (validasiRegex.test(email)) {
            // Cek duplikasi agar tidak tersimpan dua kali
            const sudahAda = databaseSetoran.some(item => item.email === email);
            if (!sudahAda) {
                const itemBaru = {
                    email: email,
                    status: "DITERIMA",
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
            message: "Semua Gmail ditolak. Pastikan format berakhiran angka 1-100 tepat sebelum @gmail.com."
        });
    }

    return res.status(200).json({
        success: true,
        message: `Berhasil! ${dataBaruBerhasil.length} Gmail diterima dan masuk ke panel admin.`,
        dataDiterima: dataBaruBerhasil,
        dataDitolak: dataDitolak
    });
});

// Endpoint untuk mengambil riwayat/data setoran ke panel admin
app.get('/api/admin/riwayat', (req, res) => {
    return res.status(200).json({
        success: true,
        totalTerima: databaseSetoran.length,
        riwayat: databaseSetoran
    });
});

// Endpoint untuk mengecek status aplikasi/rules
app.get('/api/status', (req, res) => {
    return res.status(200).json({
        success: true,
        config: adminConfig
    });
});

// Rute Tampilan Panel Admin HTML sesuai nama paneldafz
app.get('/paneldafz', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
