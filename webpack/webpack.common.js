const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const webpack = require("webpack"); // only add this if you don't have yet
const { ModuleFederationPlugin } = webpack.container;
const deps = require("../package.json").dependencies;

module.exports = {
  entry: path.resolve(__dirname, "..", "./src/index.ts"),
  // devtool: "source-map", // to resolve url in prod
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          // "resolve-url-loader", // add this before sass-loader
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        // type: "asset/resource",
        use: [
          {
            loader: "file-loader",
            options: {
              // name: "[name].[ext]",
              outputPath: "fonts",
              // esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(gif|jpe?g|tiff|png|svg|webp|otf|bmp)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "..", "./dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "./src/index.html"),
    }),
    new ModuleFederationPlugin({
      name: "invoice",
      filename: "remoteEntry.js",
      exposes: {
        // expose each component
        "./InvoicePay": path.resolve(
          __dirname,
          "..",
          "./src/layouts/views/Invoices"
        ),
      },
      shared: {
        ...deps,
        react: { singleton: true, eager: true, requiredVersion: deps.react },
        "react-dom": {
          singleton: true,
          eager: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
  ],
  stats: "errors-only",
};
