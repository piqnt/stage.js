const Path = require('path');
const Express = require('express');
var ServeIndex = require('serve-index');
const Webpack = require('webpack');
const WebpackMiddleware = require('webpack-dev-middleware');

const compiler = Webpack([
  {
    entry: {
      'stage.web': './platform/web.js',
      'stage.cordova': './platform/cordova.js',
    },
    output: {
      library: 'Stage',
      filename: '[name].js',
    },
    devtool: 'source-map',
    optimization: {
      minimize: false
    },
    plugins: [
      new Webpack.DefinePlugin({
        DEBUG: JSON.stringify(false),
        ASSERT: JSON.stringify(true),
      }),
    ],
  }
]);
var app = Express();

app.set('port', process.env.PORT || 6588);

app.use(WebpackMiddleware(compiler, {
  publicPath: '/dist/',
  compress: false,
}));

app.use(Express.static(Path.resolve(__dirname)));

app.use(ServeIndex(__dirname, {
  icons : true,
  css : 'ul#files li{float:none;}' // not actually working!
}));

app.listen(app.get('port'), function() {
  console.log('Checkout http://localhost:' + app.get('port'));
});
