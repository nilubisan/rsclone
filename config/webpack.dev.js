const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const paths = require('./paths')

module.exports = merge(common, {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        contentBase: paths.build,
        watchContentBase: true,
        open: true,
        compress: true,
        port: 8080,
    }, 

    module: {
        rules: [
            {
                test: /.s[ac]ss$/i,
                use : [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ]
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]

})