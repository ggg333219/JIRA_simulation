const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': 'rgb(0,82,204)',   // 主题色
              '@link-color': '#1890ff',      // 链接色
              '@border-radius-base': '4px',  // 圆角
            },
            javascriptEnabled: true,          // 必须启用
          },
        },
      },
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      // 忽略来自 antd 分发 CSS 中无法解析的 source map 警告
      webpackConfig.ignoreWarnings = webpackConfig.ignoreWarnings || [];
      webpackConfig.ignoreWarnings.push((warning) => {
        const message = typeof warning === 'string' ? warning : warning?.message || '';
        return message.includes("Failed to parse source map") && message.includes("webpack://antd/");
      });
      return webpackConfig;
    },
  },
};