import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use the stealth plugin
puppeteer.use(StealthPlugin());

export default class PageScrapingHandler {
	static async scrapPage(url: string) {
		// 1. Launch with non-headless mode and a common user agent
		const browser = await puppeteer.launch({
			// Run in 'new' headless mode for better stealth (or set to false for visible GUI)
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'], // Recommended args
		});

		const page = await browser.newPage();

		// Optional: Set a realistic viewport size
		await page.setViewport({ width: 1920, height: 1080 });

		// Optional: Set a realistic User-Agent (Stealth plugin helps, but a custom one is extra safe)
		const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
		await page.setUserAgent(userAgent);

		// 2. Navigate to the URL
		await page.goto(url, {
			// Wait until the network is mostly idle, which is safer than 'load'
			waitUntil: 'networkidle2',
			timeout: 60000 // Give it a generous timeout
		});

		// 3. Wait for the actual content to load
		// You MUST wait for an element that *only* exists on the successful target page.
		// For eBay, an item title or price selector is a good choice.
		// Example: wait for the main listing title selector, adjusting as needed
		try {
			await page.waitForSelector('#mainContent', { timeout: 10000 });
		} catch (e) {
			console.error("Timeout waiting for main content. Likely blocked or challenge not resolved.");
			// You can optionally check for the challenge text here to confirm the block
			const bodyContent = await page.evaluate(() => document.body.innerText);
			if (bodyContent.includes('Checking your browser before you access eBay.')) {
				console.error("Confirmed: Blocked by browser check.");
			}
			await browser.close();
			return null; // Return null or throw an error on failure
		}


		// 4. Scrape the content once the correct page is loaded
		const body = await page.evaluate(() => document.body.innerHTML);

		await browser.close();

		return body;
	}
}