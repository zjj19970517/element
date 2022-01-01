/**
 * @functional 解析字体scss文件，获的所有的iconName，然后写入 example/icon.json 中
 */

'use strict';

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
// 读取 icon.scss 文件
var fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8');
// 解析 scss 文件，得到样式节点
var nodes = postcss.parse(fontFile).nodes;
var classList = [];

// 遍历节点
nodes.forEach((node) => {
  var selector = node.selector || ''; // 获取每个节点的选择器

  // 正则表达式匹配出 icon name
  var reg = new RegExp(/\.el-icon-([^:]+):before/);
  var arr = selector.match(reg);

  if (arr && arr[1]) {
    classList.push(arr[1]);
  }
});

classList.reverse(); // 希望按 css 文件顺序倒序排列

// 将 icon 名称的数组内容写入到 example/icon.json 中
fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {});
