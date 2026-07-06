# Golden Layout (bit fork)

[![NPM version](https://img.shields.io/npm/v/golden-layout-bit)](https://www.npmjs.com/package/golden-layout-bit) [![License](https://img.shields.io/github/license/tlff/golden-layout)](https://img.shields.io/github/license/tlff/golden-layout)

> 这是基于 [golden-layout@2.6.0](https://github.com/golden-layout/golden-layout) 的 fork 版本，发布为 npm 包 **`golden-layout-bit`**。
> 原项目使用 MIT 协议，本 fork 同样以 MIT 协议发布，并保留上游版权声明。

Golden Layout is a Javascript layout manager which enables you to layout components in a web page and re-arrange them with drag and drop. Its features include:

* Native popup windows
* Touch support
* Support for application frameworks such as Angular and Vue
* Virtual components
* Comprehensive API
* Load and save layouts
* Focus components
* Completely themeable
* Works in modern browsers (Firefox, Chrome)
* Responsive design

## 与上游版本的差异

本 fork 在 `golden-layout@2.6.0` 之上做了以下修改：

- **fix(config): 处理非字符串类型的 `size` 配置输入** —— 增强 `splitStringAtFirstNonNumericChar` 对非字符串输入的健壮性
- **fix: 优化 `splitStringAtFirstNonNumericChar` 的非字符串输入处理** —— 避免在 `size` 不是字符串时抛出异常
- **fix: 修复元素显示隐藏逻辑与配置解析问题** —— 元素隐藏改用 `gl-hidden` 类并结合离屏定位，而非 `display:none`
- **build: commit `dist/` so consumers can install directly from this fork** —— 构建产物直接随仓库发布，方便直接 `npm install`

完整改动可参考本仓库的 [commit 历史](https://github.com/tlff/golden-layout/commits/master)。

## 致谢

- 上游项目：[golden-layout/golden-layout](https://github.com/golden-layout/golden-layout) —— 原始作者 deepstream.io 团队及后续贡献者
- 许可证：MIT（与上游一致）

## Development

Except for simple bug-fixes, commits should go into the `dev` branch, which will become version 3.0.  The `dev` branch is quite unstable (and not backwards compatible), but should hopefully stabilize soon.

## Installation
See the instructions [here](docs/index.md#installation--usage).

## More information

For more information, please refer to the [Golden Layout website](https://golden-layout.github.io/golden-layout)
