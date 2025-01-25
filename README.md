# Acorn

Acorn is a Hexo theme for small to medium sized businesses or studios.

[Acorn Sample data](https://github.com/zhwangart/acorn-sample-data)

[中文文档](https://acorn.imaging.xin/docs/)

## Acorn-extended

最近重构了博客主题，发现[acorn](https://acorn.imaging.xin/)主题是最合适的。为了定制我自己的需求，我将其fork、修改了。

wiki: https://github.com/The-Brotherhood-of-SCU/hexo-theme-acorn-ext

示例：https://the-brotherhood-of-scu.github.io/

主要改动：

bugfix:
1. 当quotation中内容过短时，radio button的位置不正确
2. 在pricing中，当图片大小不同时，不同的卡片大小不一

enhancement:
1. 支持在导航栏中添加外部链接
2. quotation的data文件不用硬编码序号
3. quotation自动轮播
4. quotation大小自适应（只增大不缩小：因此切换时不会导致内容一会变高一会变低）
5. 底部footer移除designer
6. pricing partial移除价格&ddl ui
7. 在配置中增加auto_fold选项，自动折叠内容
8. 在portrait中优化呼出导航栏时的阴影变化
