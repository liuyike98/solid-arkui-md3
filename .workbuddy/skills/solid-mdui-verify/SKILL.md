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
- `<Comp ref={ref} />`（`let ref` 可变绑定）编译为 `ref(r$) { typeof _ref$ === "function" ? _ref$(r$) : ref = r$ }`；`ref={setSignal}`（函数）则原样透传成 `ref: setRoot`。Solid 的 `spread` 执行 `typeof props.ref === "function" && use(props.ref, node)`，所以 ref **能**穿过组件 + props spread 抵达真实 DOM 节点
- ⚠️ **大坑：`parent={ref}` 这种「普通变量」prop 编译成静态值 `parent: ref`，在 props 对象创建时就定格**。而 `spread` 里 children 的 render effect 注册在 ref 之前（`solid-js/web/dist/web.js:305-313`），`createRenderEffect` 又是**立刻嵌套执行**（`solid-js/dist/solid.js:220`），`onMount` 走 `createEffect` 反而排队延后（`solid.js:227` → `Effects ? Effects.push(c) : ...`）
  → 后果：**子组件创建时 ref 必然还是 `undefined`**。Ripple 会走 `props.parent ?? container.parentElement` 兜底（parent 变成 Control 18px），表现就是"点图标有水波纹、点 label 文字没有"。
  → 修法：ref 用 `createSignal` + `ref={setRoot}`，传 `parent={root()}`（调用表达式 → 编译成 `get parent()`），把读值推迟到 onMount，那时 ref 已赋值。
  → 通用规则：**给子组件传 DOM 元素时，prop 必须保持可延迟读取（getter/accessor），不要传裸变量**。这是 Ark/zag 全库用 `MaybeAccessor` 的原因。

## 3. 本仓库实现约定

- **Ark anatomy → 组件结构**：`Root / Control / Indicator / Label / HiddenInput`，`splitProps(['class','children'])` + `classNames(rootClassName, local.class)` + `{...restProps}`
- **不写 aria-\***（Ark 内部自带）；children 传了就渲染 `Label`，不传就是裸控件
- **状态层分工**：MD3 里 Switch **没有**水波纹 → 允许伪元素画状态层；CheckBox/Radio 等**有**水波纹 → 状态层必须是真实元素 + `<Ripple />`，禁用伪元素
- **Ripple 用法**：容器 `border-radius: inherit` + `overflow: hidden`，即"背板定形、Ripple 填充"；`parent` 默认取 `container.parentElement`（交互宿主）；hover 图层走 `--s-ripple-hover-opacity`（MD3 8%），按压波纹峰值走 `--s-ripple-opacity`（MD3 10%）；它**没有 focus 处理**，键盘聚焦态需自己用背板 `background-color: color-mix(in srgb, currentColor 10%, transparent)` 补（用 background 而非 opacity，否则会压暗内部的波纹）；disabled 直接 `display: none` 掉背板最省事
- **已按用户决定移除宿主属性通道**：原 mdui 血统里 Ripple 会在 parent 上写 `hover`/`pressed` 裸属性（mdui 那份旧 CSS 里满是 `.mdui-switch[hover]`、`.mdui-button--tonal[hover]:not([pressed])`——那是 shadow DOM 时代跨边界通信的必需品）。本仓库是 light DOM + Ark 的 `data-hover`/`data-active`，属性通道纯属重复，已删；`disabledHover` 语义保留（只控制自带 hover 图层）。**因此 MD3"按住时 10% pressed 层"没有现成信号**，将来要补就用 CSS `:active` 或重新引入状态输出。
- **Ripple 的按压是"松手才播"**：`start()` 里 mouse 走 `oneEvent(['pointerup','pointercancel'], run)`、touch 无 delay 时走 `touchend` → **按住期间没有任何视觉**（只有 hover mask）。所以 MD3 要求的"按住时 10% pressed 状态层"必须宿主自己补（属性通道已删，只能靠 `:active` 等 CSS 手段）。
- 自带 hover 图层是**逐事件判 `pointerType === 'mouse'`**（混合设备上触屏点按不会粘住）。宿主若改用 CSS `&:hover` 则拿不到这层过滤——`:hover` 在触屏点按后会粘住，`@media (any-pointer: fine)` 只看设备能力、救不了混合机型。
- 无 `SkillManage` 工具时，skill 直接写 `<workspace>/.workbuddy/skills/<name>/SKILL.md`
- **演示壳层（`src/App.tsx`）**：`html/body/#root` 已由 `normalize.css` 设为 `100vh + overflow: hidden` → 整页天然不滚，左右分栏只需外层 `display: flex; height: 100vh; overflow: hidden` + 两个 pane 各自 `overflow-y: auto`（右栏记得 `min-width: 0`，否则内容会撑破 flex 项）。组件列表用模块级 `demos` 数组 + `createSignal(demos[0])` 存当前项，切换处用 `{active().render()}`。
- **壳层样式用 `css` + `classNames`，别用 `styled`**：`solid-styled-components` 的 `styled` 只 `splitProps(clone, ['as','theme'])`，其余 prop（例如演示用的布尔 `active`）会被 spread 到真实 DOM 上。

## 4. CSS 易错点（踩过的坑）

- `inset: 50% auto auto 50%` + `translate: -50% -50%` 才能居中任意尺寸的溢出元素；`inset: 0 + margin: auto` 对**大于容器**的盒子不成立（水平方向负 margin 例外 → 塌到左边），`translate: -50%` 单值只移 x
- **`display` 不是可动画属性**：用 `display: none/block` 切换的元素（含伪元素）切换状态时是硬切。要动画就让元素**常驻渲染**，改用 `opacity` + `transform` 做交叉淡入淡出（CheckBox 的短横线 ↔ 对勾就是这么改的：短横线常驻 `opacity: 0; transform: scaleX(0.4)`，indeterminate 时 `opacity: 1; transform: none`）。注意 CSS transition 的时长/延迟由**进入态**的规则决定，所以做不到"仅从 indeterminate 进入 checked 时延迟"这种成对定制。
- Ark 的 `Indicator` 会挂 `[hidden]`，要动画就得 `display: block` 覆盖它（Control 已 `aria-hidden`，无副作用）
- `Indicator` 用 `inset: -2px` 撑满 control 的 border box（负 inset 做拉伸是安全的）
