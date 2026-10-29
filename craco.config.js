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
      // Ensure @svgr/webpack does not throw on namespace tags in SVGs
      try {
        const rules = webpackConfig.module && webpackConfig.module.rules;
        if (Array.isArray(rules)) {
          rules.forEach((rule) => {
            const oneOf = rule && rule.oneOf;
            if (Array.isArray(oneOf)) {
              oneOf.forEach((r) => {
                const uses = r && r.use ? (Array.isArray(r.use) ? r.use : [r.use]) : [];
                uses.forEach((u) => {
                  // u can be a string or object
                  const loaderPath = (u && (u.loader || u)) || '';
                  if (typeof loaderPath === 'string' && loaderPath.indexOf('@svgr/webpack') !== -1) {
                    if (typeof u === 'object') {
                      u.options = u.options || {};
                      u.options.throwIfNamespace = false;
                    } else {
                      // replace with object form
                      const idx = r.use.indexOf(u);
                      if (idx !== -1) {
                        r.use[idx] = {
                          loader: u,
                          options: { throwIfNamespace: false },
                        };
                      }
                    }
                  }
                });
              });
            }
          });
        }
      } catch (e) {
        // if anything goes wrong, don't block build; leave default behavior
      }
      // Add absolute import aliases (map common folders under src)
      try {
        const path = require('path');
        webpackConfig.resolve = webpackConfig.resolve || {};
        webpackConfig.resolve.alias = Object.assign({}, webpackConfig.resolve.alias || {}, {
          components: path.resolve(__dirname, 'src/components'),
          screens: path.resolve(__dirname, 'src/screens'),
          utils: path.resolve(__dirname, 'src/utils'),
          types: path.resolve(__dirname, 'src/types'),
          assets: path.resolve(__dirname, 'src/assets'),
        });
      } catch (e) {
        // ignore
      }
      return webpackConfig;
    },
  },
};