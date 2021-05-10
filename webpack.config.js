// 项目初始化
// 执行npm init -y 初始化项目
// 安装webpack相关工具 npm install webpack webpack-cli -D

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //将相关的js文件引入到html文件
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: 'development',

	//entry 的值可以是一个字符串，一个数组或是一个对象
	// entry: './src/index.js', 
	entry: {
		index: './src/index.js',
		login: './src/login.js' //多页面应用的配置
	},
	// entry: ['./src/test.js', './src/index.js']

	output: {
		path: path.resolve(__dirname, 'dist'), //必须是绝对路径
		// filename: 'index.html', // 打包后的名字
		filename: '[name].[hash:6].js', //多页面应用的配置
		// 这里publicPath指的是部署的服务器的地址，需要部署的资源都在dist目录下
		// 我们本地的dist目录下的文件最终被部署到的服务器的路径是什么，publicPath就需要配置成什么
		publicPath: './' //部署路径
	},

	plugins: [
		//建立html文件 npm install html-webpack-plugin -D
		new HtmlWebpackPlugin({
			template: './public/index.html', //源html文件
			filename: 'index.html', //打包后的文件名
			chunks: ['index'], // 只引入index.js
			// hash: true //是否加上hash，默认是false
		}),
		new HtmlWebpackPlugin({
			template: './public/login.html',
			filename: 'login.html', //打包后的文件名
			chunks: ['login'] // 只引入login.js
		}),
		new VueLoaderPlugin()
	],

	module: {
		rules: [{
				// 配置babel-loader
				// npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
				// npm install @babel/runtime @babel/runtime-corejs3
				// 安装babel-loader npm install babel-loader -D
				test: /\.jsx?$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							[
								'@babel/plugin-transform-runtime',
								{
									'corejs': 3
								}
							]
						]
					}
				},
				//排除node_modules目录
				exclude: /node_modules/
			},

			// style-loader：将css插入到style标签中
			// css-loader：负责处理 @import 等语句
			// postcss-loader：兼容性问题，根据浏览器自动添加前缀
			// 如果要用 less 或者是 sass 的话，还需要 less-loader 和 sass-loader
			{
				// 此处是用于匹配文件的
				test: /\.css$/,
				// style-loader负责将样式添加到DOM中
				// css-loader只负责将css文件进行加载
				// 使用多个loader时，是从右向左读的
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('autoprefixer')
							]
						}
					}
				]
			},

			{
				test: /\.less$/,
				use: [{
					loader: 'style-loader' // creates style nodes from JS strings
				}, {
					loader: 'css-loader' // translates CSS into CommonJS
				}, {
					loader: 'less-loader' // compiles Less to CSS
				}]
			},

			// npm install url-loader -D
			// limit限制为10240是比较推荐的，base64的好处是可以减少网络请求，
			// 但是大量的base64会导致数据量变大，设置为10k是属于比较平衡这两者的选择，
			// 而超过10k的将会被拷贝到dist目录下。当然我们也可以指定路径，
			// 通过配置file-loader中option的outpath选项即可，例如outputPath: 'images/'
			{
				// test主要用来做一些匹配的
				test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
				use: [{
						loader: 'url-loader',
						options: {
							limit: 10240, //低于10k的资源将会被转化成base64,当加载的图片，大于limit时，需要使用file-loader模块进行加载
							name: 'image/[name].[hash:8].[ext]',
							esModule: false, // 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
						},
					},
					{
						loader: 'file-loader'
					}
				],
				exclude: /node_modules/
			},

			{
				test: /\.vue$/,
        		loader: 'vue-loader',
				exclude: /node_modules/
			}
		]
	},

	// 热更新--配置devServer webpack-dev-server
	devServer: {
		//默认是8080
		port: '3000',
		//默认不启用  启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见，就会看不到错误日志
		quiet: false,
		//默认开启 inline 模式，如果设置为false,开启 iframe 模式
		inline: true,
		//终端仅打印error 终端中仅打印出 error，不展示过多的编译信息，注意当启用了 quiet 或者是 noInfo 时，此属性不起作用。
		stats: 'errors-only',
		//默认不启用 当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的
		overlay: false,
		//日志等级 当使用内联模式时，在浏览器的控制台将显示消息，如：在重新加载之前，在一个错误之前，或者模块热替换启用时。如果你不喜欢看这些信息，可以将其设置为 silent (none 即将被移除)。
		clientLogLevel: "silent",
		//是否启用 gzip 压缩
		compress: true
	},

	// 解决一些路径问题
	resolve: {
		// 省略掉一些拓展名
		extensions: ['.js', '.css', '.vue'],
		alias: {
			// 这样定义是为了解决通过import的方式引入的时候改变它默认的引用，从而指向当前路径，解决runtime-only报错问题
			'vue$': 'vue/dist/vue.esm.js'
		}
	},

	// 这样的设置即可开启sourceMap，开发模式下就可以映射到我们的源代码了
	// cheap、module、eval的不同组合表示不同级别的sourceMap，详细的可以参考(http://webpack.html.cn/configuration/devtool.html)
	devtool: 'cheap-module-eval-source-map'
}