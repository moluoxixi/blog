# description
moluoxixi 的 blog

# use
- 下载依赖并启动
```shell
#下载依赖
pnpm installAll
# 直接启动
pnpm vitepress:dev
```

- 推送代码
```shell
pnpm pushAll

```
- 新增子模块

```shell

git submodule add -b <子模块分支> <子模块仓库地址> <子模块目录>

```

- 更新子模块

```shell
git submodule update --remote
```

- 删除子模块

```sh
# 删除对应子模块目录
# .gitmodules文件中删除对应内容
git rm --cached <子模块目录>
```
# 在线地址
- 博客地址 https://moluoxixi.github.io/blog/vitepress/