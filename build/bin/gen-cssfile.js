/**
 * @functional 创建 theme-chalk 下的 index.scss 文件
 * 1. theme-chalk 是一个单独的样式包，支持 gulp 打包，我们还可以 npm i 将其安装至其他地方
 * 2. theme-chalk 源码是 sass 写的，最后打包后输出为 css
 */

var fs = require('fs');
var path = require('path');
// 获取所有的组件列表
var Components = require('../../components.json');
var themes = [
  'theme-chalk'
];
// 组件包数组
Components = Object.keys(Components);

var basepath = path.resolve(__dirname, '../../packages/');

// 文件路径是否存在
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default';
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n';
  Components.forEach(function(key) {
    // 排除几个组件
    if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
    var fileName = key + (isSCSS ? '.scss' : '.css');
    indexContent += '@import "./' + fileName + '";\n';
    var filePath = path.resolve(basepath, theme, 'src', fileName);
    if (!fileExists(filePath)) {
      // 没创建样式的组件，log 提示
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  // 将最终的引入关系写入 index.scss
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});
