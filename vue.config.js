const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  // console.info('dirdirdir---','./'+dir)
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    /* svgRule.oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    */
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    // host: '192.168.100.95',
    host: 'localhost',
    // port: 8020,
    port: 8009,
    open: true,
    proxy: {
      '/amo': {
        // target: 'http://localhost:2010/amo',
        // target: 'http://192.168.100.126:2010/amo',
        // target: 'http://192.168.100.85:2010/amo',
        // target: ' http://192.168.100.126:1003/amo',
        // target: ' http://120.55.164.217/amo',
        // target: 'http://192.168.100.200:2012/amo',
        // target: 'http://222.191.229.126:28080/amo', //  126测试
        target: 'http://192.168.100.126:2020/amo', //  dev测试
        // target:'http://39.104.130.50/amo',
        ws: false,
        changeOrigin: true,
        'pathRewrite': { '^/amo': '' }
      },
      '/auth': {
        // target: ' http://192.168.100.126:1003/',
        // target: 'http://120.55.164.217',
        // target: 'http://192.168.100.200:1003',
        target: 'http://222.191.229.126:1003', // 126 测试
        // target:'http://39.104.130.50',
        ws: false,
        changeOrigin: true,
        'pathRewrite': { '^/auth': '' }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}
