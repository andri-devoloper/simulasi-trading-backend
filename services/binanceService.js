require("dotenv").config();
const axios = require("axios");

async function getCurrentPrice(symbol) {
  const response = await axios.get(
    `https://testnet.binance.vision/api/v3/ticker/price?symbol=${symbol}`,
    {
      headers: {
        "X-MBX-APIKEY": process.env.BINANCE_API_KEY,
      },
    }
  );
  return parseFloat(response.data.price);
}

module.exports = {
  getCurrentPrice,
};
