import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./i18n";
import { Provider } from 'react-redux';
import store from "./redux/store";
import { FpjsProvider, FingerprintJSPro } from '@fingerprintjs/fingerprintjs-pro-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Suspense fallback={<div>Loading translations...</div>}>
      {(process.env.REACT_APP_FPTOOLKIT || "free") === "paid" ? (
      <FpjsProvider
        loadOptions={{
          apiKey: "ZQ2KE5fWMCHxekaE4D8a",
          endpoint: [
            "https://log.api-admcanvas.com",
            FingerprintJSPro.defaultEndpoint
          ],
          scriptUrlPattern: [
            "https://log.api-admcanvas.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js",
            FingerprintJSPro.defaultScriptUrlPattern
          ],
          region: "ap"
        }}
      >
        <App />
      </FpjsProvider>
      ) : (
        <App />
      )}
    </Suspense>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
