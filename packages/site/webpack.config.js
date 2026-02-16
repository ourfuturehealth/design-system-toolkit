const path = require("path");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "scripts/main.js"),
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist/js/"),
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
