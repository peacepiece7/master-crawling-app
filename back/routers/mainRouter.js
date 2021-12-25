const express = require('express');
const puppeteer = require('puppeteer');
const xl = require('excel4node');
const path = require('path');
const fs = require('fs');
const add_to_sheet = require('../service/add_to_sheet');

const mainRouter = express.Router();

// 1. Master-crawler parsing

// PARSE CRAWLING RESULT (작성 중)
mainRouter.get(`/crawl`, async (req, res, next) => {
  try {
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

// CREATE EXCEL FILE BEFORE CHANGE
mainRouter.get('/excelbefore', async (req, res, next) => {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet('BEFORE');
  const afterWs = wb.addWorksheet('AFTER');

  // ! INPUT :  바탕화면에서 master_crawler폴더를 찾아서 실행해야합니다. 작업 컴퓨터에서 경로를 변경해주세요
  const dirPath = path.join(__dirname, '..', 'master_crawler');
  const backupPath = path.join(__dirname, '..', 'crawling_backup');
  fs.readdir(backupPath, (err) => {
    if (err) {
      fs.mkdirSync(backupPath);
    }
  });
  const getMfDir = (dir) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (error, file) => {
        if (error) {
          reject(error);
        } else {
          resolve(file);
        }
      });
    });
  };
  const getFullDir = (dirPath, mfDirs) => {
    const result = [];
    for (const mfDir of mfDirs) {
      const files = fs.readdirSync(`${dirPath}/${mfDir}`);
      if (files[0]) {
        for (f of files) {
          if (f.includes('.pdf') || f.includes('.PDF')) {
            const file = f.slice(0, f.length - 4);
            result.push({ mf: mfDir, pn: file });
          }
        }
      }
    }
    return result;
  };
  async function saveDirToExcel() {
    try {
      const mfDirs = await getMfDir(dirPath);
      const result = getFullDir(dirPath, mfDirs);
      for (let i = 0; i < result.length; i++) {
        const mf = result[i].mf;
        const pn = result[i].pn;
        //! OUTPUT : 작업 컴퓨터에서 바탕화면 폴더의 경로를 지정해주세요
        const dir = path.join(__dirname, '..');

        ws.cell(i + 1, 1).string(mf);
        ws.cell(i + 1, 2).string(pn);

        afterWs.cell(i + 1, 1).string(mf);
        afterWs.cell(i + 1, 2).string(pn);

        wb.write(`${dir}/crawling_work_sheet.xlsx`);
        wb.write(`${dir}/crawling_backup/crawling_work_sheet_backup.xlsx`);
      }
      res.send('엑셀 시트가 생성되었습니다.');
    } catch (error) {
      console.log(error);
    }
  }
  saveDirToExcel();
});

// CREATE EXCEL FILE AFTER CHANGE

mainRouter.get('/excelafter', async (req, res, next) => {
  // rev 12.16.2021
  // ! INPUT PATH : 바탕화면에서 crawling_work_sheet.xlsx'폴더를 찾아서 실행해야합니다. 작업 컴퓨터에서 경로를 변경해주세요
  // ! INPUT PATH : 바탕화면에서 master_crawler폴더를 찾아서 실행해야합니다. 작업 컴퓨터에서 경로를 변경해주세요
  const excelDir = path.join(__dirname, '..', 'crawling_work_sheet.xlsx');
  const folderDir = path.join(__dirname, '..', 'master_crawler');

  const wb = xlsx.readFile(excelDir);
  const ws = wb.Sheets.AFTER;

  const getMfDir = (dir) => {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (error, file) => {
        if (error) {
          reject(error);
        } else {
          resolve(file);
        }
      });
    });
  };

  async function saveDirToExcel(folderDir, excelDir) {
    try {
      const result = [];
      const mfDirs = await getMfDir(folderDir);

      for (const mfDir of mfDirs) {
        const files = fs.readdirSync(`${folderDir}/${mfDir}`);
        if (files[0]) {
          for (f of files) {
            if (f.includes('.pdf') || f.includes('.PDF')) {
              const file = f.slice(0, f.length - 4);
              result.push({ mf: mfDir, pn: file });
            }
          }
        }
      }
      for (let i = 0; i < result.length; i++) {
        const newCell = 'C' + (i + 1);
        add_to_sheet(ws, newCell, 'string', result[i].pn);
      }
      //! 이 부분 비동기로 변경해사 작성!
      xlsx.writeFile(wb, excelDir, 'utf8', () => {
        res.status(200).send('작업이 완료 되었습니다');
      });
    } catch (error) {
      console.log(error);
      res.status(403).send('작업을 실패했습니다.');
    }
  }
  saveDirToExcel(folderDir, excelDir);
});

module.exports = mainRouter;
