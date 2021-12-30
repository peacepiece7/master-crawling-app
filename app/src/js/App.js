import React, { useState } from 'react';
import { POST_CRAWLING_REQUEST, EXCEL_AFTER_REQUEST, EXCEL_BEFORE_REQUEST } from '../../constant';
import Store from 'electron-store';

const App = (props) => {
  console.log(props);
  const { ipcRenderer } = window.require('electron');
  let testStr = 'foo';

  let store = new Store();

  //added a listener at the end of file with a log to see what's happening
  console.log('loading done : store are', store.get('test'));
  store.set('test', testStr);

  const handleSaveBtn = () => {
    testStr = 'bar';
    store.set('test', testStr);
  };

  const handleConsoleBtn = () => {
    console.log('get a store data : ', store.get('test'));
  };
  const handleSubmit = () => {
    // throttle 걸기
    ipcRenderer.send(POST_CRAWLING_REQUEST, 'query');
  };
  const handleSubmitBefore = () => {
    ipcRenderer.send(EXCEL_BEFORE_REQUEST, 'before');
  };
  const handleSubmitAfter = () => {
    ipcRenderer.send(EXCEL_AFTER_REQUEST, 'after');
  };

  ipcRenderer.off(POST_CRAWLING_REQUEST, () => {
    console.log('실행이 끝났습니다');
  });
  ipcRenderer.off(EXCEL_BEFORE_REQUEST, () => {
    console.log('실행이 끝났습니다');
  });
  ipcRenderer.off(EXCEL_AFTER_REQUEST, () => {
    console.log('실행이 끝났습니다');
  });

  // styles
  const inputStyle = {
    width: '70px',
  };
  const btnCommon = {
    margin: '0 10px 0 0',
  };

  return (
    <div>
      <h3>Master Crawler App</h3>
      <div>
        <input style={inputStyle} type='text' placeholder='Enter a query'></input>
        <button onClick={handleSubmit}>Run</button>
      </div>
      <h3>Create excel sheet</h3>
      <div>
        <button style={btnCommon} onClick={handleSubmitBefore}>
          before
        </button>
        <button className='input-after' onClick={handleSubmitAfter}>
          after
        </button>
      </div>
      <div>
        <button onClick={handleSaveBtn}>save btn</button>
        <button onClick={handleConsoleBtn}>console btn</button>
        {testStr && <div>hello</div>}
      </div>
    </div>
  );
};
export default App;
