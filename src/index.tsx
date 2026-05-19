import './wdyr'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './utils/App';
import { AppProviders } from './context';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.less'
import { DevTools } from 'jira-dev-tool';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
      <DevTools />
    </AppProviders>
  </React.StrictMode>
);

// 性能监控
reportWebVitals();
