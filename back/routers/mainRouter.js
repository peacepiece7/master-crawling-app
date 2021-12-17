const express = require('express');
const puppeteer = require('puppeteer');

const mainRouter = express.Router();

//! Dummy data
const dummyData = [
  {
    url: 'https://www.budind.com/wp-content/uploads/2019/11/hbps11594.pdf',
    partnumber: 'PS-11594-B',
    manufacture: 'Bud Industries',
  },
  {
    url: 'https://www.hammfg.com/electronics/small-case/development-board/1593ham-beag.pdf',
    partnumber: '1593HAMBONEBK',
    manufacture: 'Hammond Manufacturing',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/2187/3161/files/NBR-0005_Nebra_IP67_Weatherproof_Enclosure.pdf',
    partnumber: 'NBR-0005',
    manufacture: 'pi supply',
  },
  {
    url: 'https://media.digikey.com/pdf/Data%20Sheets/Seeed%20Technology/110991384_Web.pdf',
    partnumber: 'Raspberry Pi 4 case black/grey',
    manufacture: 'Hammond Raspberry Pi',
  },
];

// 1. Master-crawler parsing

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
