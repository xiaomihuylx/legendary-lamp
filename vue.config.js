module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // 脚手架3中起别名可以用@代替src  脚手架2 不行
        'components': '@/components',
        'views': '@/views',
        'network': '@/network',
        'assets': '@/assets',
        'common': '@/common'

      }
    }
 }
}