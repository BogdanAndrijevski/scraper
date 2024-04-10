var PORT = process.env.PORT || 3000; // added
const express = require("express");
const app = express();
const puppeteer = require('puppeteer');

app.use(express.static("public"));


async function scrape() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=asd');

    let results = [];

    while (results.length < 200) { // Fetch 100 search results
        await page.waitForSelector('h3'); // Wait for search result titles to load

        const newResults = await page.evaluate(() => {
            const results = [];
            const links = document.querySelectorAll('a'); // Select all anchor elements
            
            links.forEach(link => {
                const href = link.href; // Get the href attribute value
                const h3 = link.querySelector('h3'); // Find the h3 element within the anchor
                
                if (h3) {
                    const textContent = h3.textContent.trim(); // Get the text content of the h3 element
                    results.push({ href, textContent }); // Push href and textContent into results array
                }
            });
        
            return results;
        });
        

        results = results.concat(newResults);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds for new results to load (adjust as needed)
    }

    await browser.close();
        
    // NOT FILTERED
    // const response = {
    //     links: results.map(result => ({
    //         href: result.href,
    //         textContent: result.textContent
    //     })),
    //     total: results.length
    // };

    // FILTERED
    // const filteredResults = results.filter(result => result.href); // Filter out results without an href attribute

    const filteredResults = results.filter(result => {
        // Filter out results without an href attribute or starting with "https://www.google.com/search?"
        return result.href && !result.href.startsWith('https://www.google.com/search?');
    });
    const response = {
        links: filteredResults.map(result => ({
            href: result.href,
            textContent: result.textContent
        })),
        total: filteredResults.length
    };

    return response;
}

app.get('/scrape', async (req, res) => {
    try {
        const result = await scrape();
        res.status(200).json(result);
    } catch (error) {
        console.error("Error occurred during scraping:", error);
        res.status(500).send('An error occurred during scraping. Please check the console for details.');
    }
});


app.listen(PORT, () => {
    console.log("listening on port 3000");
})