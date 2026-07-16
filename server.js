const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Mengizinkan folder saat ini diakses lewat browser
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('Sebuah perangkat terhubung');

    // Menerima data dari Admin Panel
    socket.on('update_overlay', (data) => {
        console.log('Data diterima dari Admin:', data);
        // Memancarkan (broadcast) data tersebut ke semua overlay yang terbuka
        io.emit('terima_data', data);
    });

    socket.on('disconnect', () => {
        console.log('Perangkat terputus');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});