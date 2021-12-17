const { ipcRenderer } = require('electron');
const axios = require(axios);

const btnMin = document.getElementById('min');
const btnMax = document.getElementById('max');
const btnClose = document.getElementById('close');
const parseBtn = document.querySelector('.parse-btn');

btnMin.addEventListener('click', () => {
  ipcRenderer.send('minimizeApp');
});
btnMax.addEventListener('click', () => {
  ipcRenderer.send('maximizeApp');
});
btnClose.addEventListener('click', () => {
  ipcRenderer.send('closeApp');
});

parseBtn.addEventListener('click', async () => {
  try {
    // 다른 이벤트 발생하지 않게 throttle, loading middleware추가
    const query = req.body.query;
    const response = await axios(`/api/${query}/parse-master-crawl`, {
      method: 'POST',
    });

    // local file system에 접근해서 result로 폴더를 생성, 그 안에 .pdf 파일을 저정, .xlsx파일 생성 삭제 등 로직 추가
  } catch (error) {
    console.log(error);
  }
});
