#!/usr/bin/env node

/**
 * 管理员功能：创建项目目录，生成
 *
 * @author Yohann
 * @since 2014/8/20
 */
require('shelljs/global');
const funs = require('./api.js');

if (!which('git')) {
	echo('Sorry, this script requires git');
	exit(1);
}

const argv = require('yargs')
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
	 * 创建应用目录
	 */
	case 'createDirs':
		console.log('create dirs...');

		if (!argv.dir) {
			console.error('请输入项目路径参数。');
			exit(1);
		}
		appFolder = argv.dir;

		funs.createDirs(appFolder);
		break;

	/**
	 * git svn clone
	 */
	case 'gitSvnClone':
		if (!argv.dir) {
			console.error('请输入项目路径参数。');
			exit(1);
		}
		// project根路径
		let appFolder = argv.dir;
		// 指定的应用（paas, paas/app1），不指定时为全部
		appName = argv.name;

		funs.gitSvnClone(appFolder, appName);
		break;

	case 'cpGitignore':
		console.log('do cp gitignore file...');

		if (!argv.dir) {
			console.error('请指定项目路径参数。');
			exit(1);
		}
		// project根路径
		appFolder = argv.dir;
		// 指定的应用（paas, paas/app1），不指定时为全部
		appName = argv.name;

		const appFolders = appName ? appName : funs.getAppFolders(appFolder);
		funs.cpGitignoreFile(appFolder, appFolders);
		break;

	/**
	 * 生成批量创建GIT项目的javascript脚本，在gitlab WEB端控制台上执行（登录后）
	 */
	case 'serverProjectCreateScript':
		funs.serverProjectCreateScript();
		break;

	case 'bugFix':
		console.log('do bugFix...');

		funs.bugFix();
		break;

	default:
		console.error('\nSorry, that is not something I know how to do.\n');
}

echo('done.' + new Date());

