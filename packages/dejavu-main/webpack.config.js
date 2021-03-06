const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteWebPackPlugin = require('write-file-webpack-plugin');

const { NODE_ENV } = process.env;

const plugins = [
	// Ignore all locale files of moment.js
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new CleanWebpackPlugin([path.resolve(__dirname, 'dist/app')]),
	new HtmlWebpackPlugin({
		template: './app/index.html',
		alwaysWriteToDisk: true,
	}),
	new FaviconsWebpackPlugin({
		logo: './app/src/favicon/favicon.png',
		prefix: 'favicon/',
	}),
	new HtmlWebpackHarddiskPlugin(),
	new CopyWebpackPlugin([
		'./app/src/_redirects',
		'chrome-specific',
		'./packages',
	]),
	new WriteWebPackPlugin(),
];

const isDevelopment = NODE_ENV === 'development';

module.exports = {
	entry: [path.resolve(__dirname, 'app/src/index.js')],
	output: {
		path: path.resolve(__dirname, 'dist/app'),
		publicPath: process.env.public_path,
		filename: isDevelopment ? '[name].js' : '[name].[chunkhash:8].js',
	},
	optimization: {
		splitChunks: {
			chunks: 'initial',
		},
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							insertAt: 'top',
						},
					},
					'css-loader',
				],
			},
			{
				test: /\.(gif|png|jpe?g|svg|woff|woff2|ttf|eot)$/i,
				use: ['file-loader'],
			},
		],
	},
};
