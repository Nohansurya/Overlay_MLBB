const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

app.use(express.static(__dirname));

// VARIABEL GLOBAL: Untuk menyimpan state data overlay saat ini
let currentOverlayData = {
    namaTimKiri: "TIM A",
    namaTimKanan: "TIM B",
    logoKiri: "assets/logo-kiri.jpg",
    logoKanan: "assets/logo-kanan.jpeg",
    caster: "Adi - Udin"
};

io.on('connection', (socket) => {
    console.log('Sebuah perangkat terhubung');

    // 1. Kirim data overlay saat ini begitu ada perangkat/overlay yang terhubung/refresh
    socket.emit('terima_data', currentOverlayData);

    // 2. Kirim daftar logo ke Admin Panel
    const logoPath = path.join(__dirname, 'assets', 'LOGO TIM');
    if (fs.existsSync(logoPath)) {
        fs.readdir(logoPath, (err, files) => {
            if (!err) {
                const logoFiles = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file));
                socket.emit('daftar_logo', logoFiles);
            }
        });
    }

    // 3. Menerima data dari Admin Panel
    socket.on('update_overlay', (data) => {
        console.log('Data diterima dari Admin:', data);
        
        // Gabungkan data baru ke dalam penyimpanan sementara (currentOverlayData)
        currentOverlayData = { ...currentOverlayData, ...data };
        
        // Broadcast data yang sudah diperbarui ke semua client
        io.emit('terima_data', currentOverlayData);
    });

    socket.on('disconnect', () => {
        console.log('Perangkat terputus');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});