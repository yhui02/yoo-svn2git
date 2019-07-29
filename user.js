#!/usr/bin/env node

/**
 * 用户，批量（基于配置文件）Clone到本地
 *
 * @author Yohann
 * @since 2014/8/20
 */
require('shelljs/global');
var funs = require('./api.js');

if (!which('git')) {
	echo('Sorry, this script requires git');
	exit(1);
}

var argv = require('yargs')
	.alias('t', 'type')
	.alias('d', 'dir')
	.alias('n', 'name')
	.demand(['t', 'd'])
	.default({d: './'})
	.describe({t: '命令类型', d: '项目路径', n: '应用名称'})
	.argv;

echo('start...' + new Date());

switch (argv.type) {

	/**
	 * clone 所有项目（基于配置文件）到本地
	 */
	case 'clone':
		console.log('do git clone...');

		if (!argv.dir) {
			console.error('请输入项目路径参数。');
			exit(1);
		}
		appFolder = argv.dir;

		//git clone
		funs.appRootCreate(appFolder);
		funs.appCreate(appFolder, funs.getAppsShortSrc());
		break;

	case 'originUpdate':
		console.log('do git origin update...');

		if (!argv.dir) {
			console.error('请指定项目路径参数。');
			exit(1);
		}
		// project根路径
		appFolder = argv.dir;
		// 指定的应用（paas, paas/app1），不指定时为全部
		appName = argv.name;

		const getAppFolders = funs.getAppFolders(appFolder);
		getAppFolders.forEach(function (file) {
			//指定应用时，跳过其它项
			if (appName) {
				if (file.indexOf(appName) === -1) {
					return;
				}
			}

			//git remote origin update
			funs.originUpdate(appFolder, file);
		});
		break;

	default:
		console.error('\nSorry, that is not something I know how to do.\n');
}

echo('done.' + new Date());