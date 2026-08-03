const express = require('express');
const path = require('path');
const app = express();

// Middleware untuk memproses data JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Variabel sementara untuk menyimpan data setoran Gmail
let dataSetoran = [];

// Rute Halaman Utama (Web Storan) agar tidak "Cannot GET /"
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Web Storan Gmail</title>
            <style>
                body { font-family: Arial, sans-serif; background: #f4f7f6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
                input { width: 90%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
                button { background: #0066cc; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%; }
                button:hover { background: #0052a3; }
                .admin-link { display: block; margin-top: 15px; color: #666; text-decoration: none; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Form Storan Gmail</h2>
                <form action="/api/stor" method="POST">
                    <input type="email" name="email" placeholder="Masukkan Email Gmail" required>
                    <button type="submit">Kirim Storan</button>
                </form>
                <a href="/paneldafz" class="admin-link">Buka Panel Admin</a>
            </div>
        </body>
        </html>
    `);
});

// Rute untuk menerima data kiriman/storan
app.post('/api/stor', (req, res) => {
    const { email } = req.body;
    if (email) {
        dataSetoran.push({
            email: email,
            status: 'Berhasil',
            waktu: new Date().toLocaleString()
        });
    }
    res.send(`
        <script>
            alert('Storan berhasil dikirim!');
            window.location.href = '/';
        </script>
    `);
});

// Rute API untuk mengambil data di panel admin
app.get('/api/data', (req, res) => {
    res.json(dataSetoran);
});

// Rute Panel Admin (Membuka admin.html)
app.get('/paneldafz', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Ekspor modul untuk Vercel
module.exports = app;
