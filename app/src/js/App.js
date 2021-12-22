import React from 'react';
import { POST_CRAWLING_REQUEST } from '../../constant';

export default function App() {
  const { ipcRenderer } = window.require('electron');

  const handleSubmit = () => {
    ipcRenderer.send(POST_CRAWLING_REQUEST, 'query');
  };
  return (
    <div>
      <h1>I am App Component</h1>
      <div>
        <input type='text' placeholder='Enter a query'></input>
        <button onClick={handleSubmit}>Run</button>
      </div>
    </div>
  );
}
