
# 📈 Simulasi Trading Backend

Proyek backend ini dibuat untuk menerima sinyal dari TradingView dan mensimulasikan order trading berdasarkan parameter strategi yang dikonfigurasi melalui frontend. Aplikasi ini terintegrasi dengan harga real-time dari Binance untuk evaluasi dan simulasi order dengan pengaturan Take Profit dan Stop Loss.

---

## 🚀 Fitur Utama

✅ Menyimpan dan membaca konfigurasi strategi trading  
✅ Menerima sinyal dari TradingView  
✅ Validasi sinyal berdasarkan indikator +DI, -DI, dan ADX  
✅ Ambil harga terkini dari Binance  
✅ Simulasi order dengan pengaturan TP/SL & leverage  
✅ Log semua order ke database atau file  
✅ REST API sederhana dan modular  

---

## 📦 Struktur Endpoint API

### ✅ 1. POST `/config`
**Menyimpan parameter strategi dari frontend**

**Request JSON**
```json
{
  "symbol": "BTCUSDT",
  "timeframe": "5m",
  "plusDIThreshold": 25,
  "minusDIThreshold": 20,
  "adxMinimum": 20,
  "takeProfitPercent": 2,
  "stopLossPercent": 1,
  "leverage": "10x"
}
```

**Response**
```json
{
  "message": "Configuration saved successfully"
}
```

---

### ✅ 2. GET `/config`
**Menampilkan parameter strategi aktif saat ini**

**Response**
```json
{
  "symbol": "BTCUSDT",
  "timeframe": "5m",
  "plusDIThreshold": 25,
  "minusDIThreshold": 20,
  "adxMinimum": 20,
  "takeProfitPercent": 2,
  "stopLossPercent": 1,
  "leverage": "10x"
}
```

---

### ✅ 3. POST `/webhook`
**Menerima sinyal dari TradingView dan mengevaluasi validitasnya**

**Contoh Request**
```json
{
  "symbol": "BTCUSDT",
  "plusDI": 27.5,
  "minusDI": 15.0,
  "adx": 25.0,
  "timeframe": "5m"
}
```

**Logika Validasi**
- BUY jika:  
  `+DI > threshold` AND `-DI < threshold` AND `ADX > minimum`
- SELL jika sebaliknya.

**Jika valid:**
- Ambil harga terkini dari Binance
- Hitung Take Profit dan Stop Loss
- Simulasikan order dan simpan ke log

**Contoh Order Simulasi**
```json
{
  "symbol": "BTCUSDT",
  "action": "BUY",
  "price_entry": "27123.12",
  "tp_price": 27665.58,
  "sl_price": 26851.89,
  "leverage": "10x",
  "timeframe": "5m",
  "timestamp": "2025-05-24T12:34:56Z"
}
```

---

### ✅ 4. GET `/orders`
**Menampilkan seluruh order simulasi yang tersimpan**

**Response**
```json
[
  {
    "symbol": "BTCUSDT",
    "action": "BUY",
    "price_entry": "27123.12",
    "tp_price": 27665.58,
    "sl_price": 26851.89,
    "leverage": "10x",
    "timeframe": "5m",
    "timestamp": "2025-05-24T12:34:56Z"
  }
]
```

---

## ⚙️ Cara Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone https://github.com/andri-devoloper/simulasi-trading-backend.git
cd simulasi-trading-backend
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Jalankan Server
```bash
npm start
```

Server berjalan di `http://localhost:3000` secara default.

---

## 🌐 Binance API

Gunakan Binance Testnet:
- Spot: https://testnet.binance.vision  
- Futures: https://testnet.binancefuture.com  

Akses harga terkini menggunakan endpoint:
```
GET https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
```

---

## 🛠 Konfigurasi Tambahan

Jika Anda ingin menyimpan log ke file atau database, silakan modifikasi bagian `logOrder()` di controller agar sesuai kebutuhan penyimpanan Anda (misal menggunakan SQLite, MongoDB, dsb).

---

## 🚧 Catatan Deployment

Saat ini proses **deploy ke AWS Linux Ubuntu** masih berlangsung.  
Aplikasi ini dapat di-deploy menggunakan:

- **Node.js**
- **Express.js**
- **PM2** untuk background process
- **Nginx** (jika ingin reverse proxy)
- **Docker** (opsional)

---

## 👨‍💻 Author

**Andri**  
GitHub: [https://github.com/andri-devoloper](https://github.com/andri-devoloper)
