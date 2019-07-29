# YOO svn2git project

2014迁移由公司SVN项目迁移至GIT写的程序，上百个应用运行了约4个多小时。由于项目涉及项目信息，所以不保留原始提交记录。
有类似迁移计划的可作个参考。

本项目在 mac OS 下测试通过，理论上*NIX、Windows系统都被支持。

- `admin.js`为管理员命令，执行N多项目（SVN项目二级目录分别作为单独的GIT项目）迁移使用
- `user.js`为用户命令，执行N多项目一次Clone到本地

> *NIX系统执行时，注册文件数限制问题

## 一、先决条件

* 已安装[nodejs](http://nodejs.org/) `v0.12.7`
* 已安装[git](http://git-scm.com/) `1.8.5.2 (Apple Git-48)`
* git设置

```powershell
$ git config --global http.sslVerify false
$ git config --global user.name <yourname>
$ git config --global user.email <youremail>
```


## 二、本地导入

**2.1 方式一：一次全导入**

```powershell
$ git clone https://github.com/yhui02/yoo-svn2git.git yoo-svn2git && cd yoo-svn2git && npm install && node main -t clone -d <local dir>
```

> `local dir`请使用本地绝对路径，如目录下已存在部分项目，这些项目将不会受影响，但仍然建议您先备份再执行。
>
> `./config/projects.txt` 内指定了需要导入的应用，如需指定，请先 `clone` 本项目，修改此配置文件后再执行 `node app-git-init.js clone <local dir>`。
>
> `./config/projects-ignore.txt` 忽略应用
>
> `user.txt`为svn项目涉及到的用户信息

**2.2 方式二：分步操作，修改配置文件，指定导入应用**

```powershell
$ git clone https://github.com/yhui02/yoo-svn2git.git yoo-svn2git
$ cd yoo-svn2git && npm install
$ node main -t clone -d <local dir>
```
