const { getCurrentPrice } = require("../services/binanceService");
const { v4: uuidv4 } = require("uuid");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const defaultConfig = {
  symbol: "BTCUSDT",
  timeframe: "5m",
  plusDI: 25,
  minusDI: 20,
  adx: 20,
  takeProfit: 2,
  stopLoss: 1,
  leverage: "10x",
};

// Simpan konfigurasi strategi
async function saveConfig(req, res) {
  try {
    const config = await prisma.strategyConfig.create({
      data: {
        symbol: req.body.symbol,
        timeframe: req.body.timeframe,
        plusDI: req.body.plusDIThreshold,
        minusDI: req.body.minusDIThreshold,
        adx: req.body.adxMinimum,
        takeProfit: req.body.takeProfitPercent,
        stopLoss: req.body.stopLossPercent,
        leverage: req.body.leverage,
      },
    });

    res.json({ message: "Config saved", data: config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Simpan Final
async function FinalConfig(req, res) {
  try {
    const {
      symbol,
      timeframe,
      plusDIThreshold,
      minusDIThreshold,
      adxMinimum,
      takeProfitPercent,
      stopLossPercent,
      leverage,
      plusDI,
      minusDI,
      adx,
    } = req.body;

    // Tentukan action berdasarkan threshold
    let action = null;
    if (
      plusDI > plusDIThreshold &&
      minusDI < minusDIThreshold &&
      adx > adxMinimum
    ) {
      action = "BUY";
    } else if (
      plusDI < plusDIThreshold &&
      minusDI > minusDIThreshold &&
      adx > adxMinimum
    ) {
      action = "SELL";
    }

    if (!action) {
      return res
        .status(400)
        .json({ message: "Signal does not meet any action criteria." });
    }

    // Dapatkan harga simulasi
    const price_entry = await getCurrentPrice(symbol);
    const tp_price = price_entry * (1 + takeProfitPercent / 100);
    const sl_price = price_entry * (1 - stopLossPercent / 100);

    const order = {
      id: uuidv4(),
      symbol,
      action,
      price_entry: parseFloat(price_entry.toFixed(2)),
      tp_price: parseFloat(tp_price.toFixed(2)),
      sl_price: parseFloat(sl_price.toFixed(2)),
      leverage,
      timeframe,
      timestamp: new Date(),
    };

    await prisma.order.create({ data: order });

    res.json({ message: "Order simulated and returned", order });
  } catch (error) {
    console.error("Error simulating signal:", error);
    res.status(500).json({ error: "Failed to simulate signal." });
  }
}

// Ambil konfigurasi strategi
async function getConfig(req, res) {
  try {
    const config = await prisma.strategyConfig.findMany({
      orderBy: { id: "desc" },
    });

    if (!config) return res.status(404).json({ message: "Config not found" });

    res.json({ config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Terima sinyal trading dan simulasikan order
async function receiveWebhook(req, res) {
  const signal = req.body;

  let config = await prisma.strategyConfig.findFirst({
    orderBy: { id: "desc" },
  });
  const threshold = config || defaultConfig;

  let action = null;

  if (
    signal.plusDI > threshold.plusDI &&
    signal.minusDI < threshold.minusDI &&
    signal.adx > threshold.adx
  ) {
    action = "BUY";
  } else if (
    signal.plusDI < threshold.plusDI &&
    signal.minusDI > threshold.minusDI &&
    signal.adx > threshold.adx
  ) {
    action = "SELL";
  }

  if (!action) {
    return res
      .status(400)
      .json({ message: "Invalid signal, no action taken." });
  }

  const price_entry = await getCurrentPrice(signal.symbol || threshold.symbol);
  const tp = price_entry * (1 + threshold.takeProfit / 100);
  const sl = price_entry * (1 - threshold.stopLoss / 100);

  const order = {
    symbol: threshold.symbol,
    action,
    price_entry: parseFloat(price_entry.toFixed(2)),
    tp_price: parseFloat(tp.toFixed(2)),
    sl_price: parseFloat(sl.toFixed(2)),
    leverage: threshold.leverage,
    timeframe: threshold.timeframe,
    timestamp: new Date(),
  };

  console.log("Order to be saved:", order);

  try {
    await prisma.order.create({ data: order });
    res.json({ message: "Order simulated and saved", order });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save order to database." });
  }
}

// Ambil semua order dari database
async function getOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { timestamp: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  saveConfig,
  getConfig,
  receiveWebhook,
  getOrders,
  FinalConfig,
};
