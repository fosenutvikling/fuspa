// TODO: main file and project folder as input parameter. output folder and name
// TODO: install dependencies required (add to npm install script)

export const webpackJs = (mainFile, output) =>
  `
module.exports = {
  entry: '${mainFile}',
  output: {
    filename: '${output}'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },

    {
      test: /\.svg$/,
      loader: 'svg-inline-loader'
    }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
`;