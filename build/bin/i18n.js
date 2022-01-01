/**
 * @functional 生成 example/pages 下的不同语言的 .vue 文件
 * 官网支持四种语言，中文、英语（美国）、西班牙语、法语
 */

'use strict';

var fs = require('fs');
var path = require('path');
// 读取语言配置，page.json 中存储了四种语言的对应关系
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    // 如果这个目录是否存在，如果不存在创建目录
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => {
    // 获取模版路径
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    // 输出路径
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`);
    // 读取模版文件内容
    var content = fs.readFileSync(templatePath, 'utf8');

    var pairs = lang.pages[page];

    // 模版内容替换
    Object.keys(pairs).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });

    // 最终将结果写入新的文件中
    fs.writeFileSync(outputPath, content);
  });
});
