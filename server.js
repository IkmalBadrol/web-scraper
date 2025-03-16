const express = require("express");
const scrapeExchangeRates = require("./scraper");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let exchangeData = { rates: [], lastUpdated: "" };

cron.schedule("0 * * * *", async () => {
    console.log("Scraping latest exchange rates...");
    exchangeData = await scrapeExchangeRates();
});

app.get("/api/exchange-rates", (req, res) => {
    res.json(exchangeData);
});

// Initial scrape on startup
(async () => {
    exchangeData = await scrapeExchangeRates();
})();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
