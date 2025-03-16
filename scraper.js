const puppeteer = require("puppeteer");

async function scrapeExchangeRates() {
    const url = "https://www.hsbc.com.my/investments/products/foreign-exchange/currency-rate/";
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const rates = await page.evaluate(() => {
        let data = [];
        let rows = document.querySelectorAll("table tbody tr"); 

        rows.forEach((row) => {
            let columns = row.querySelectorAll("td");

            if (columns.length >= 3) {
                data.push({
                    country: columns[0].innerText.trim(),
                    buyRate: columns[1].innerText.trim(),
                    sellRate: columns[2].innerText.trim(),
                    flag: `https://flagcdn.com/w320/${columns[0].innerText.substring(0, 2).toLowerCase()}.png`, // Example flag URL
                });
            }
        });

        return data;
    });

    await browser.close();
    return { rates, lastUpdated: new Date().toISOString() };
}

module.exports = scrapeExchangeRates;
