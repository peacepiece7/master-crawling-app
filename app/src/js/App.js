import React, { useState } from "react";
import { POST_CRAWLING_REQUEST, EXCEL_AFTER_REQUEST, EXCEL_BEFORE_REQUEST } from "../../constant";

export default function App() {
  const { ipcRenderer } = window.require("electron");
  const { isLoading, setIsLoading } = useState(false);

  const handleSubmit = () => {
    // throttle 걸기
    console.log(isLoading);
    ipcRenderer.send(POST_CRAWLING_REQUEST, "query");
  };
  const handleSubmitBefore = () => {
    ipcRenderer.send(EXCEL_BEFORE_REQUEST, "before");
  };
  const handleSubmitAfter = () => {
    ipcRenderer.send(EXCEL_AFTER_REQUEST, "after");
  };

  ipcRenderer.off(POST_CRAWLING_REQUEST, () => {
    console.log("실행이 끝났습니다");
  });
  ipcRenderer.off(EXCEL_BEFORE_REQUEST, () => {
    console.log("실행이 끝났습니다");
  });
  ipcRenderer.off(EXCEL_AFTER_REQUEST, () => {
    console.log("실행이 끝났습니다");
  });

  // styles
  const inputStyle = {
    width: "70px",
  };
  const btnCommon = {
    margin: "0 10px 0 0",
  };

  return (
    <div>
      <h3>Master Crawler App</h3>
      <div>
        <input style={inputStyle} type="text" placeholder="Enter a query"></input>
        <button onClick={handleSubmit}>Run</button>
      </div>
      <h3>Create excel sheet</h3>
      <div>
        <button style={btnCommon} onClick={handleSubmitBefore}>
          before
        </button>
        <button className="input-after" onClick={handleSubmitAfter}>
          after
        </button>
      </div>
    </div>
  );
}
