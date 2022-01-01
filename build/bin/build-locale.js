/**
 * @functional 语言文件格式转换，输出至lib目录下
 * 执行: node build/bin/build-locale.js
 */

var fs = require('fs');
var save = require('file-save');
var resolve = require('path').resolve;
var basename = require('path').basename;

var localePath = resolve(__dirname, '../../src/locale/lang');
// 读取语言目录，得到文件列表
var fileList = fs.readdirSync(localePath);

// 转换方法
var transform = function(filename, name, cb) {
  // 将原来的 esm 格式转换为 umd 的格式
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', {loose: true}]
    ],
    moduleId: name
  }, cb);
};

// 遍历文件列表
fileList
  .filter(function(file) {
    return /\.js$/.test(file);
  })
  .forEach(function(file) {
    var name = basename(file, '.js');

    // 调用转换方法
    transform(file, name, function(err, result) {
      if (err) {
        console.error(err);
      } else {
        var code = result.code;

        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.');
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code);

        console.log(file);
      }
    });
  });
