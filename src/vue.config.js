const path = require('path')

module.exports = {
  css: {
    loaderOptions: {
      //导入stylus文件
      stylus: {
        import: [
          path.join(__dirname, "src/assets/css/variables.styl")
        ]
      }
    },
    devServer: {
      proxy: {
        '/': {
          target: 'http://10.10.100.191:8081',
          //是否允许跨域
          changeOrigin: true
        }
      }
    }
  }
}