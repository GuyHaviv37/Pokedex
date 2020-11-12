const path = require('path');
module.exports = {
    entry : './src/index.js',
    // module : {
    //     rules : [
    //         {
    //             test: /\.scss$/,
    //             use : [
    //                 'style-loader',
    //                 'css-loader',
    //                 'sass-loader'
    //             ],
    //         },
    //     ],
    // },
    devServer : {
        contentBase : path.join(__dirname,'public'),
        port : 8080
    }

};