# Electron quick start

### 구조

node_modules/
out/
.gitignore
package.json
index.html
index.js
payload.js

### npm init

`npm init`

description, author 작성

### script 추가

```js
package.json

"scripts" : { "start" : "electron ."}
```

### index.html 추가

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>, Chromium <span id="chrome-version"></span>, and Electron
    <span id="electron-version"></span>.
  </body>
</html>
```

### index.js 추가

```js
const { app, BrowserWindow } = require("electron");
// include the Node.js 'path' module at the top of your file
const path = require("path");

// modify your existing createWindow() function
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
}
app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
```

### payload.js 추가

```js
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
```

### 프로잭트 실행

`npm start`

### 패키징 배포

`npm install --save-dev @electron-forge/cli`
`npx electron-forge import`

### electron-forge 배포

`npm run make`

# React 추가

### 리액트 패키지 추가

`npm install --save react react-dom`

### 리액트 소스 폴더 만들기

`mkdir src/js`

### index.html root id 생성

```html
<div id="root"></div>
```

### src/js/index.js 파일 만들기

```js
import React from "react";
import ReactDom from "react-dom";

ReactDom.render(<h1>Hello React App</h1>, document.getElementById("root"));
```

### 웹팩용 패키치 추가

`npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader sass-loader sass webpack webpack-cli`

### webpack.common.js 추가 (root 폴더)

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/js/index.js",
  devtool: "inline-source-map",
  target: "electron-renderer",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    esmodules: true,
                  },
                },
              ],
              "@babel/preset-react",
            ],
          },
        },
      },
      {
        test: [/\.s[ac]ss$/i, /\.css$/i],
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build", "js"),
  },
};
```

### package.json에 webpack 스크립트 추가

`"watch": "webpack --config webpack.common.js --watch"`

### 스크립트 실행

`npm run watch`
스크립트가 실행되면 build/js/app.js가 생성됨.

### index.html에 app.js 추가

```html
<div id="root"></div>
<script src="./build/js/app.js"></script>
```

### 실행

`npm start`

# React Component

- src/js/App.js 추가

```js
import React from "react";

export default function App() {
  return <h1>I am App Component</h1>;
}
```

- src/js/index.js 수정

```js
import App from "./App";

ReactDom.render(<App />, document.getElementById("root"));
```

- 저장(Ctrl+s)
- 실행화면 창에서 Reload(Ctrl+r)

# ref

### CODE GEAR - yotube, blog

- https://www.youtube.com/watch?v=7hzH4B6xLIE&list=PLeNJ9AVv90q0t7m-AE6aTSsyUaIWjpU_1&index=2
- https://codegear.tistory.com/12?category=976116

### Electron quick start

- https://tinydew4.github.io/electron-ko/docs/tutorial/quick-start/

```shell
# 저장소를 클론합니다
$ git clone https://github.com/electron/electron-quick-start
# 저장소 안으로 들어갑니다
$ cd electron-quick-start
# 애플리케이션의 의존성 모듈을 설치한 후 실행합니다
$ npm install && npm start
```

### Boilerplates

- electron 공식 사이트에서 tools, boilerplates 제공

https://www.electronjs.org/community#boilerplates
