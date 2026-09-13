---
name: solid-mdui-verify
version: 1.0.0
description: solid-mdui 组件库的「无浏览器」静态校验与实现约定。当需要确认组件的生成 CSS、Ark UI/Solid 的 props 语义、或新增 MD3 组件时使用。适用于 solid-mdui-arkui 仓库内的样式/组件改动验证，避免启动 dev server。
agent_created: true
---

# solid-mdui 组件校验与实现约定

本仓库约定：改完组件不启动 dev server，验证交给用户的热重载与截图。但**样式与 props 语义可以离线静态验证**，下面两招能避免"改完靠猜"。

## 1. 查看组件真实产出的 CSS（无需浏览器）

`solid-styled-components` 直接 re-export goober 的 `css`；goober 在 Node 下走 SSR 分支（`getSheet` 无 `window` 时返回内存 sheet），所以能直接打印最终 CSS。

要点：
- 从 `.tsx` 里正则抽出 css 模板字面量（正则：``/css`([\s\S]*?)`;/g``），构造 `{ raw: [text] }` 并挂上 `unshift`（goober 靠这两个特征识别 tagged template）
- goober **在 JS 里做嵌套扁平化**（`&` 与非 `&` 嵌套都会补父选择器前缀），不依赖浏览器原生 CSS 嵌套，所以嵌套写法无版本风险
- 自定义类若嵌套在组件根类下（`.goRoot .custom`），特异性 (0,2,0) 必然覆盖库组件自身的单类 hash (0,1,0)，**这是覆盖第三方样式最稳的方式**，不必依赖注入顺序

```js
// /tmp/goober-check.cjs
const fs = require('fs');
const { createRequire } = require('module');
const req = createRequire('<项目绝对路径>/package.json');
const { css, extractCss } = req('goober');
const src = fs.readFileSync('<绝对路径>/libs/components/Xxx.tsx', 'utf8');
const blocks = [...src.matchAll(/css`([\s\S]*?)`;/g)].map(m => m[1]);
const tag = s => { const a = [s]; a.raw = [s]; return a; };
blocks.forEach(b => css(tag(b)));
console.log(extractCss());
```
运行：`/Users/liuyike/.workbuddy/binaries/node/versions/22.22.2-3/bin/node /tmp/goober-check.cjs`

## 2. 确认 Solid 编译后的 props 语义（如 ref 转发）

`@babel/core` + `babel-preset-solid` 都在 node_modules 里，可编译最小 JSX 片段看真实产出：

```js
const babel = require('<项目>/node_modules/@babel/core');
babel.transformSync(code, { filename: 'x.jsx', presets: ['<项目>/node_modules/babel-preset-solid'] }).code;
```

已验证结论：
- `<Comp ref={ref} />`（`let ref` 可变绑定）编译为 `ref(r$) { typeof _ref$ === "function" ? _ref$(r$) : ref = r$ }`；Solid 的 `spread` 对 `ref` 执行 `value(node)`，所以 ref **能穿过组件 + props spread 抵达真实 DOM 节点**
- 但 `<Ripple parent={ref} />` 编译为 `parent: ref`（**非 getter，创建时取值一次**）→ 只有当 ref 在本组件树更靠前的位置被赋值时才拿得到。Ark 的 `Root` 会把 `ref` 留在 `labelprops` 里随 `mergedProps` spread 到 `<ark.label>`，spread 发生在 children 渲染之前，所以这种写法成立。

## 3. 本仓库实现约定

- **Ark anatomy → 组件结构**：`Root / Control / Indicator / Label / HiddenInput`，`splitProps(['class','children'])` + `classNames(rootClassName, local.class)` + `{...restProps}`
- **不写 aria-\***（Ark 内部自带）；children 传了就渲染 `Label`，不传就是裸控件
- **状态层分工**：MD3 里 Switch **没有**水波纹 → 允许伪元素画状态层；CheckBox/Radio 等**有**水波纹 → 状态层必须是真实元素 + `<Ripple />`，禁用伪元素
- **Ripple 用法**：容器 `border-radius: inherit` + `overflow: hidden`，即"背板定形、Ripple 填充"；`parent` 默认取 `container.parentElement`（交互宿主）；hover 图层走 `--s-ripple-hover-opacity`（MD3 8%），按压波纹峰值走 `--s-ripple-opacity`（MD3 10%）；它**没有 focus 处理**，键盘聚焦态需自己用背板 `background-color: color-mix(in srgb, currentColor 10%, transparent)` 补（用 background 而非 opacity，否则会压暗内部的波纹）；disabled 直接 `display: none` 掉背板最省事
- 无 `SkillManage` 工具时，skill 直接写 `<workspace>/.workbuddy/skills/<name>/SKILL.md`

## 4. CSS 易错点（踩过的坑）

- `inset: 50% auto auto 50%` + `translate: -50% -50%` 才能居中任意尺寸的溢出元素；`inset: 0 + margin: auto` 对**大于容器**的盒子不成立（水平方向负 margin 例外 → 塌到左边），`translate: -50%` 单值只移 x
- Ark 的 `Indicator` 会挂 `[hidden]`，要动画就得 `display: block` 覆盖它（Control 已 `aria-hidden`，无副作用）
- `Indicator` 用 `inset: -2px` 撑满 control 的 border box（负 inset 做拉伸是安全的）
