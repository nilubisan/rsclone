const paths = require("./paths")
const {merge} = require("webpack-merge")
const common = require("./webpack.common.js")

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = merge(common, {
    mode: "production",
    devtool: false,
    output: {
        path: paths.build,
        publicPath: "/",
        filename: "[name].[contenthash].bundle.js",
    },


    module : {
        rules: [
            {
                test: /.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                        importLoaders: 2,
                        sourceMap: false,
                        modules: true,
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },
    

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
            chunkFilename: '[id].css',
        })
    ],

    optimization : {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), "..."],
        runtimeChunk: {
            name: 'runtime',
        },
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },

})