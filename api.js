/**
 * api
 *
 * @author Yohann
 * @since 2014/8/20
 */
require('shelljs/global');

var CONFIG = {};
CONFIG.url = 'https://gitlab.xxx.com/';


/**
 * 获取应用目录
 *
 * @param appFolder 项目根路径
 * @returns ['app/bbs', 'app/bdr', 'app/bol', ... ,'paas/af', 'paas/common', ...]
 */
exports.getAppFolders = function (appFolder) {
	var arr = [];
	ls('-R', appFolder).forEach(function (file) {
		var c = file.split('/');
		if (c.length == 2 && file.indexOf('.') == -1) {
			arr.push(file);
		}
	});
	return arr;
};

exports.appRootCreate = function (appFolder) {
	var shell = 'git clone ' + CONFIG.url + 'projectname/project-root.git' + ' ' + appFolder;
	if (exec(shell).code !== 0) {
		echo('Error: git remote origin update');
	}
};

exports.appCreate = function (appFolder, appName) {
	var _exec = function (appName) {
		var appDir = appFolder + '/' + appName;
		var gitRemoteUrl = CONFIG.url + 'projectname/{1}.git';
		gitRemoteUrl = gitRemoteUrl.replace('{1}', appName.replace(/\//g, '-'));
		var shell = 'git clone ' + gitRemoteUrl + ' ' + appDir;
		echo(shell);
		if (exec(shell).code !== 0) {
			echo('Error: git remote origin update');
		}
	};

	if (typeof appName == 'object') {
		appName.forEach(function (v) {
			_exec(v);
		});
	} else {
		_exec(appName);
	}
};

exports.getAppsShortSrc = function () {
	var fs = require("fs");
	var filename = __dirname + '/config/projects.txt';

	//读取项目目录列表、创建项目目录
	var data = fs.readFileSync(filename, 'utf-8');
	var dataArr = data.split('\n');
	var appShortSrc = [];
	dataArr.forEach(function (v) {
		if (v) {
			appShortSrc.push(v);
		}
	});
	return appShortSrc;
};

/**
 * git remote origin update
 *
 * @param appFolder 项目根路径
 * @param appName 'app/uc' or 'paas/eagleeye'
 */
exports.originUpdate = function (appFolder, appName) {
	var appDir = appFolder + '/' + appName;
	var gitRemoteUrl = CONFIG.url + 'projectname/{1}.git';
	gitRemoteUrl = gitRemoteUrl.replace('{1}', appName.replace(/\//g, '-'));
	var shell = 'cd ' + appDir + ' && git remote set-url origin ' + gitRemoteUrl;
	if (exec(shell).code !== 0) {
		echo('Error: git remote origin update');
	}
	echo(appName + ' git remote origin update to: ' + gitRemoteUrl);
};

/**
 * 复制 gitignore 文件到项目目录下（已存在时不会覆盖）并推送到远程服务器
 *
 * @param appFolder
 * @param appName
 */
exports.cpGitignoreFile = function (appFolder, appName) {
	var _exec = function (appName) {
		var appDir = appFolder + '/' + appName;
		var gitignoreFile = __dirname + '/config/gitignore.txt';

		// cp
		var toDir = appDir + '/.gitignore';

		console.log('cp to: ' + toDir);
		cp(gitignoreFile, toDir);



		if (exec('cd ' + appDir).code !== 0) {
			echo('Error: cd app dir');
		}

		// add gitignore file
		var _shell0 = 'cd ' + appDir + ' && git add .gitignore';
		if (exec(_shell0).code !== 0) {
			echo('Error: git add gitignore fail');
		}
		echo(_shell0);

		var _shell1 = 'cd ' + appDir + ' && git commit -m ".gitignore file add"';
		if (exec(_shell1).code !== 0) {
			echo('Error: git commit fail');
		}
		echo(_shell1);

		var _shell2 = 'cd ' + appDir + ' && git push origin master';
		if (exec(_shell2).code !== 0) {
			echo('Error: git push fail');
		}
		echo(_shell2);
	};

	if (typeof appName == 'object') {
		var ignoreApps = this.getIgnoreAppsShortSrc();
		appName.forEach(function (v) {
			//跳过应用
			if (ignoreApps && ignoreApps.indexOf(v) !== -1) {
				return;
			}
			if ([''].indexOf(v) !== -1) {
				return;
			}

			_exec(v);
		});
	} else {
		_exec(appName);
	}
};

exports.getIgnoreAppsShortSrc = function () {
	var fs = require("fs");
	var filename = __dirname + '/config/projects-ignore.txt';

	//读取项目目录列表、创建项目目录
	var data = fs.readFileSync(filename, 'utf-8');
	var dataArr = data.split('\n');
	var appShortSrc = [];
	dataArr.forEach(function (v) {
		if (v) {
			appShortSrc.push(v);
		}
	});
	return appShortSrc;
};

/**
 * 创建项目目录
 * @param appFolder
 */
exports.createDirs = function (appFolder) {
	echo('create dirs start...');

	var appDirs = this.getAppsShortSrc();

	var _appFolder = appFolder + '/';
	_appFolder = _appFolder.replace(/\/\//g, '/');
	appDirs.forEach(function (v) {
		if (v) {
			var dirStr = _appFolder + v;
			echo(dirStr);
			mkdir('-p', dirStr);
		}
	});
	echo('\ncreate dir "' + _appFolder + '*" done.');
};

/**
 * git svn clone
 */
exports.gitSvnClone = function (appFolder, appName) {
	var ignoreApps = this.getIgnoreAppsShortSrc();
	var dirLoc = __dirname;

	var funs = require('./functions.js');
	var getAppFolders = funs.getAppFolders(appFolder);
	console.log('get app folder done.');

	//exports.getAppFolders
	getAppFolders.forEach(function (file) {
		if (appName) {
			//if (appName != file) {
			if (file.indexOf(appName) == -1) {
				return;
			}
		}

		//跳过应用
		if (ignoreApps && ignoreApps.indexOf(file) != -1) {
			return;
		}

		var appDir = appFolder + '/' + file;

		/*
		 * git svn exec
		 *
		 * git svn clone -A users.txt http://example.com/svn/app/appname appname
		 * git svn fetch
		 */
		var shellStr = [];
		shellStr.push('git svn clone -A ./config/user.txt --no-minimize-url');
		shellStr.push('http://xxx.xxxsvn.com/svn/repos/projectname/' + file);
		shellStr.push(appDir);
		console.log(shellStr.join(' '));
		if (exec(shellStr.join(' ')).code !== 0) {
			console.error('Error: git svn execute failed');
			//exit(1);
		}

		/*
		 * git add origin
		 */
		var gitRemoteUrl = 'https://xxx.xxxgit.com/projectname/{1}.git';
		gitRemoteUrl = gitRemoteUrl.replace('{1}', file.replace(/\//g, '-'));
		echo(gitRemoteUrl);
		var _shell = 'cd ' + appDir + ' && git remote add origin ' + gitRemoteUrl;
		echo(_shell);
		if (exec(_shell).code !== 0) {
			echo('Error: git add origin failed');
			//exit(1);
		}

		/*
		 * git svn fetch
		 */
		var _shell0 = 'cd ' + appDir + ' && git svn fetch';
		if (exec(_shell0).code !== 0) {
			echo('Error: git svn fetch failed');
			//exit(1);
		}
		echo(_shell0);

		/*
		 * git push
		 */
		var _shell1 = 'cd ' + appDir + ' && git push origin master';
		if (exec(_shell1).code !== 0) {
			echo('Error: git push failed');
			//exit(1);
		}
		echo(_shell1);

		// go back dir
		cd(dirLoc);
	});
	echo('git execute done');
};

/**
 * 生成网页ajax批量创建Git工程脚本
 */
exports.serverProjectCreateScript = function() {
	var apps = this.getAppsShortSrc();
	var funs = "apps.forEach(function(d){\n"
				+ "	$.ajax({\n"
				+ "		url: '/projects',\n"
				+ "		type: 'POST',\n"
				+ "		async: false,\n"
				+ "		data: 'utf8=%E2%9C%93&project%5Bname%5D='+d+'&project%5Bnamespace_id%5D=1&project%5Bpath%5D=&project%5Bimport_url%5D=&project%5Bdescription%5D=&project%5Bvisibility_level%5D=10',\n"
				+ "		success: function(data) {\n"
				+ "			console.log(data)\n"
				+ "		}\n"
				+ "	})\n"
				+ "}) ";

	console.info('------------------------------------------------');
	echo ('var apps = ');
	echo (apps);
	echo ('\n' + funs);
	console.info('------------------------------------------------');
};