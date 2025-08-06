import puppeteer from "puppeteer";

export default class PageScrapingHandler {
    static async scrapPage(url: string) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);

        const body = await page.evaluate(() => document.body.innerHTML);

        await browser.close();

        return body;
    }
}