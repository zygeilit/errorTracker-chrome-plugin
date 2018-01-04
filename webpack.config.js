var webpack = require('webpack');
var path = require('path');
var packageJson = require("./package.json");

function getVersion(){
    var date = new Date();
    var Y = date.getFullYear()+'';
    var M = date.getMonth()+1+'';
    var D = date.getDate()+'';
    var H = date.getHours()+'';
    var m = date.getMinutes()+'';
    var s = date.getSeconds()+'';
    M=M.length==1?'0'+M:M;
    D=D.length==1?'0'+D:D;
    H=H.length==1?'0'+H:H;
    m=m.length==1?'0'+m:m;
    s=s.length==1?'0'+s:s;
    return [ Y, M, D, H, m, s ].join('');
}

var currentVersion = getVersion();

var plugins = [
    // new webpack.DefinePlugin({
    //     __DEBUG__: true
    // }),
    new webpack.DefinePlugin({
        //版本号
        '_Version': JSON.stringify( currentVersion ),
        '_BestPracticeList': JSON.stringify( packageJson.bestPracticeList )
    })
];

if(1) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            test: /(\.jsx|\.js)$/
            ,compress: {
                warnings: false
            }
            ,minimize: true
            ,sourceMap: false
            //,mangle: false
        })
    );
}

module.exports = {
    entry: {
        'detail': [ './contentScript/detailPages/components/index.js' ]
    },
    output: {
        path: path.join( __dirname, 'contentScript/detailPages/components' ),
        filename: "index.min.js"
    },
    plugins: plugins
};