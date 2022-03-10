const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    port: 3001,
    hot: true,
    open: true,
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
}