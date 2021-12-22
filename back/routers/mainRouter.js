const express = require('express');
const puppeteer = require('puppeteer');

const mainRouter = express.Router();

// 1. Master-crawler parsing

mainRouter.get('/test', (req, res, next) => {
  res.json({ test: 'test object' });
});

mainRouter.get(`/crawl`, async (req, res, next) => {
  try {
    console.log('HI!');
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size:1720,1400'],
    });
    await browser.userAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
    );
    let page = await browser.newPage();
    await page.setViewport({
      width: 1520,
      height: 1280,
    });
    await page.goto(`http://115.22.68.60/master/crawl/index.jsp?pre=$1`, {
      waitUntil: 'networkidle0',
    });

    const result = await page.evaluate(() => {
      return 'SUCCESS TO CONNECTING WITH BACKEND!';
    });
    await page.close();
    await browser.close();

    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

mainRouter.post('/:query/crawl', async (req, res, next) => {
  try {
    const query = req.body.query;
    console.log(req.body);
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size:1720,1400'],
    });
    await browser.userAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
    );
    let page = await browser.newPage();
    await page.setViewport({
      width: 1520,
      height: 1280,
    });
    await page.goto(`http://115.22.68.60/master/crawl/index.jsp?pre=${query}`, {
      waitUntil: 'networkidle0',
    });

    // backend server의 화면 크기에 따라 다름 확인 후 변경해주세요
    await page.mouse.move(210, 85);
    await page.waitForTimeout(1000);
    await page.mouse.click(210, 85);
    await page.waitForTimeout(2000);

    // pdf parsing
    const pdfList = await page.evaluate(() => {
      const result = [];
      if (document.querySelector('tbody tr td')) {
        Array.from(document.querySelectorAll('tbody tr')).map((v, idx) => {
          const pdfLink = v.querySelector('td:nth-child(5) a').href;
          const pn = v.querySelector('.pname').textContent;
          let mf = v.querySelector('#mfr').textContent.split('/');

          if (mf.includes('.')) {
            mf.split('.').join('');
          }
          if (mf[1]) {
            mf = `${mf[0].trim()} ${mf[1].trim()}`;
          } else {
            mf = mf[0];
          }
          result.push({ manufacture: mf, partnumber: pn, url: pdfLink });
        });
      }
      return result;
    });

    res.status(200).json(pdfList);
  } catch (error) {
    console.log(error);
  }
});

module.exports = mainRouter;
