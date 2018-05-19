require.extensions['.css'] = () => {
  return;
};

var path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
			{
				test: /\.css$/,
				loader: 'style-loader',
				options: {
					hmr: true
				}
			},
			{
				test: /\.css$/,
				loader: 'css-loader',
				include: [path.join(__dirname, 'src')],
				query: { 
					modules: true,
					localIdentName: '[name]__[local]___[hash:base64:5]'
				}
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
				include: [path.join(__dirname, 'node_modules')]
			}
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
		port: 9000,
		host: '0.0.0.0',
		disableHostCheck: true,
		watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
	}
};
