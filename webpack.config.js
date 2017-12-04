const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const path = require("path");

module.exports = {
    entry: {
        "fuspa": "./src/main.ts",
        "fuspa.min": "./src/main.ts"
    },
    output: {
        path: path.resolve(__dirname, "bundles"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "Spa",
        umdNamedDefine: true
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devtool: "source-map",
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            include: /\.min\.js$/
        })
    ],
    module: {
        loaders: [{
            test: /\.tsx?$/,
            loader: "ts-loader"
        }]
    }
};