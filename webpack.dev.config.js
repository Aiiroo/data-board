var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'static/js/boardshow/src/main': './app/main.dev.js',
        vendor: ['react', 'react-dom', 'echarts-for-react']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].bundle.js',
        chunkFilename: "[name].[chunkHash:8].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(less|css)$/,
                exclude: /node_modules/,
                // loader: 'style-loader!css-loader!less-loader',
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            }
        ]
    },
    plugins: [
        // webapck配置
        new webpack.LoaderOptionsPlugin({
            options: {
                devServer: {
                    historyApiFallback: true,
                    inline: true
                }
            }
        }),
        // 样式分离打包
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('css/[name].css').replace('src/', '').replace('css/js', 'css');
            },
            allChunks: true
        }),
        // 公共模块打包
        new webpack.optimize.CommonsChunkPlugin({ 
            names: ['vendor', 'manifest']
        }),
        // 生成入口html
        new HtmlWebpackPlugin({                        //根据模板插入css/js等生成最终HTML
            favicon:'./app/assets/images/favicon.ico', //favicon路径
            filename:'./boardshow.html',    //生成的html存放路径，相对于 path
            template:'./app/index.html',    //html模板路径
            inject:true,    //允许插件修改哪些内容，包括head与body
            hash:true,    //为静态资源生成hash值
            minify:{    //压缩HTML文件
                removeComments:true,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
            }
        })
    ]
};