const { BrowserWindow, app } = require("electron");
const pie = require("puppeteer-in-electron");
const puppeteer = require("puppeteer-core");

const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);

  const window = new BrowserWindow();
  const url = "https://www.npmjs.com/package/puppeteer-in-electron";
  await window.loadURL(url);

  const page = await pie.getPage(browser, window);
  await page.waitForTimeout(1000);
  await page.goto("https://github.com/TrevorSundberg/puppeteer-in-electron/blob/HEAD/API.md", {
    waitUntil: "networkidle0",
  });

  const page2 = await browser.newPage();

  await page2.goto("https://www.npmjs.com/package/puppeteer-in-electron", { waitUntil: "networkidle0" });
};

main();
