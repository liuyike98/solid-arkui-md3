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

两个必备注意点：
- **必须传「数组 + `raw`」，不能传 `{ raw: [text] }`**。`goober/src/css.js` 的分支是 `val.unshift ? (val.raw ? compile : array-reduce) : val`，普通对象没有 `unshift` → 走到 `hash(val)`，`extractCss()` 会把原文原样吐出（形如 `.goXXXX raw{0: …}`）——**看起来像成功了，其实一个字都没展开**。
- **`extractCss()` 会清空 sheet**（`sheet.data = ''`），连着调第二次得到空串。每次 dump 只取一次，之后复用字符串。想 dump 多个文件就先各自 `css()` 再一次性 `extractCss()`。

### 1.1 验证「覆盖是否按预期生效」（级联解析器）

改组件样式时，真正要回答的问题不是"CSS 有没有发出来"，而是"某个元素最终拿到的是哪条规则"。做法：解析 `extractCss()` 的扁平输出 → 给每条规则算特异性 → 沿元素链匹配 → 逐属性取权重最高者。

- **goober 输出是扁平的**：`&` 会被替换成父选择器、非 `&` 的嵌套补成 `父 + ' ' + key`，所以嵌套在源码里存在、在输出里不存在（输出的顺序是「父规则自身声明」先于「子块」）。
- **特异性直接数「类 + 属性 + 伪类」的个数**（本仓库选择器不出现 id 和标签）→ 个数就是 `(0,N,0)`。伪元素（`::before`）不计权。
- ⚠️ **坑 1：最右侧复合选择器必须精确匹配「目标元素自身」**，不能像祖先那样继续往回扫。否则 `.goRoot[data-orientation='horizontal']` 这种单复合选择器会被算到 control/track 上（症状：control 也"匹配"到了 root 的宽高规则）。
- ⚠️ **坑 2：元素链要照真实 DOM 写**。Slider 是 `Root > Control > { Track, Thumb }` —— Thumb 是 Control 的子元素、Track 是它的**兄弟**；链上多带一个 track 会把 track 的规则串味到 thumb（症状：thumb 莫名拿到 `border-radius: 999px`、`background-color: #e3e5c2`）。
- ⚠️ **坑 3：写解析器先自检**。喂一个已知答案的小样例（`.p [data-part='track'] .range{width:10px}` 与 `.p[data-orientation] [data-part='track'] .range{width:20px}`，期望 20px）跑通，再上真实模板 —— 否则容易用"坏掉的解析器"去证明"代码没问题"，输出一片空白还以为是别的原因。

已验证结论：把「共用形状/配色」与「按朝向的几何」拆成两组顶层规则时，**覆盖关系由特异性自动保证**（朝向块恒定多一层 `[data-orientation]` 属性：共用 (0,2,0)/(0,3,0) < 朝向 (0,3,0)/(0,4,0)），与声明顺序无关 —— 所以"共用在前、几何在后"只是可读性选择，挪动顺序不会翻车。这条是 Slider 三段式组织（尺寸 / 共用 / 几何）的依据。

### 1.2 量真实几何：无头 Chrome（不用 dev server、不用装 playwright）

CSS 的**语义**问题（变换顺序、锚点、居中、溢出）光看代码推不出来，但本机有 Chrome，可以直接量：

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-first-run \
  --dump-dom --virtual-time-budget=3000 file:///tmp/x.html
```

做法：页面里用 JS 把 `getBoundingClientRect()` 的结果写进 `<pre id="out">`，`--dump-dom` 就把测量值打出来了（`--virtual-time-budget` 保证脚本跑完）。**DOM 不用搭整个应用** —— 用「§1 goober dump 出的真实 CSS」+「手工复刻 Ark 会注入的 inline style」拼一个等价结构就够，既不起 dev server 也不碰用户的热更新。

- ⚠️ **测量陷阱：目标元素带 `transition` 时，改完样式立刻量到的是过渡中间态。** 症状很迷惑 —— 会读出"刚好居中"这种看似正确的假结果（因为读到的是接近 s=1 的中间态）。测量前必须 `el.style.transition = 'none'`，并 `void el.offsetWidth` 强制重排后再读。
- 好用的技巧：把「锚点」定义成 `(小尺度盒中心 - 完整盒角) / 完整盒宽`，用 `scale: 0.001` 与 `scale: 1` 两次测量即可算出"动效从盒子的哪个相对位置长出来"（0 = 左/上边缘，0.5 = 中心，1 = 右/下边缘）。同一个 DOM 上覆盖 `transformOrigin` 测多次，就能做「改前 / 改后 / 参照」三连对比。

已验证结论：`ArkSlider.DraggingIndicator`（拖拽时显示当前值的气泡）用 `scale: 0 → 1` 做入场时，**`transform-origin` 必须写 `bottom left`，写 `bottom center` 会从右下角冒出**（实测锚点 X：`bottom left` = 0.5，`bottom center` = 0.999，`bottom right` = 1.499）。同一个值在两个朝向都对：横向取「最终盒子的底边中心」，竖向取「最终盒子的左边中点」（竖向实测锚点 X = 0.001 / Y = 0.5）。原因见 §4 的「transform 属性比 scale 更内层」。

同一次实测拿到的定位结论（气泡盒 vs 滑块盒，真实 CSS + 复刻的 Ark inline 样式）：
- 横向 `top: -200%`：气泡中心与滑块中心 X 偏差 0，气泡底边在滑块上方 14px。
- 竖向 `left: calc(100% + 8px)`：气泡左边缘 = 滑块右边缘 + 8px，中心与滑块中心 Y 偏差 0（纵向居中由 Ark 的 `bottom` + `translateY(50%)` 完成）。
- 顺带确认：给同一元素的 `transform-origin` 反复覆盖、配合 `scale: 0.001` 与 `scale: 1` 两次测量，就能在一个页面上做「改前 / 改后 / 参照」多组对比。



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
- **定位靠 CSS 变量的组件（Slider 这类）先搞清变量挂在哪一层**：Ark 把 `--slider-thumb-offset-N`、`--slider-thumb-transform`、`--slider-range-start|end` 写进 **root** 的 inline style（`slider.style.js` 的 `getRootStyle`）；`getTrackProps` 给 track 挂 `position: relative`、`getControlStyle()` 给 control 挂 `position: relative`（**只给了 `touch-action / user-select / position`，没有 `display: flex`**，所以在 control 上写 `align-items` 是无效的）；thumb 只有 `position: absolute` + `inset-inline-start: var(--slider-thumb-offset-N)` + `transform: var(--slider-thumb-transform)`，**没有任何 top/bottom**。结论：thumb 的包含块是 **control**（百分比 inset 相对 control 宽度），垂直居中必须自己在 CSS 补（`top: 50%; translate: 0 -50%`）；百分比高度链也要自己接（root 定高如 8px → control/track `height: 100%`）。默认值：`min=0 / max=100 / step=1`，`defaultValue = [min]`，裸 `<Slider />` 不会报错；`data-disabled` 同时挂在 root / control / track / thumb 上，所以禁用规则写 `&[data-disabled]` 挂根类即可。
  - **做竖向 variant 时**：Ark 对竖向 thumb 只给 `bottom: var(--slider-thumb-offset-N)` + `transform: translateY(50%)`，**不给 left**（横向给的是 `inset-inline-start` + `translateX(-50%)`，同样不给 top）。所以横向写的那套 `top: 50%; translate: 0 -50%; height: 250%` 必须在竖向规则里显式清掉成 `top: auto; left: 50%; translate: -50% 0; width: 250%; height: auto` —— 否则 **`top` 和 Ark 的 `bottom` 同时存在会把绝对定位的 thumb 拉长**；尺寸也要从"按 control 高度算"换成"按 control 宽度算"（竖向下厚度是宽度）。另外**竖向 root 的 `height: 100%` 必须有确定高度的父级**（横向 `width: 100%` 天然有确定宽度，竖向没有）——父级是 flex row 且高度 auto 时百分比高度按 auto 解算 → root 塌成 0，整条 control/track/range 链全 0，表现就是"竖向滑块完全看不见"。演示里要给一个 `height: 180px` 的**包裹**容器（不是放一个等高兄弟 div）。
- **Slider 样式模板的组织约定（三段式）**：顶层只留三段 —— ① **尺寸**（`&[data-orientation='…']` 给 root 定宽高）② **共用**（`[data-part='control'|'track'|'thumb']` 的形状与配色，含 thumb 的 `::before`/`::after` 状态层）③ **几何**（两个 `&[data-orientation='…']` 块，覆盖 track 的 flex 方向、range 的轴向 CSS 变量、thumb 的定位与尺寸基准）。
  - **不要把 `track`/`thumb` 嵌套进 `[data-part='control']`**：Ark 的 `[data-part]` 在单个组件实例内唯一，不需要靠嵌套收窄；嵌套只会把层级压深（旧版是 `control > track > &[data-orientation='vertical']` 三层，特例藏在中间）+ 逼出一次性特例。
  - 覆盖靠特异性而非顺序（朝向块恒多一层属性，见 §1.1），所以"共用在前、几何在后"只是可读性选择。
  - **拖拽值气泡（`DraggingIndicator`）也按这条走**：视觉 + 入场动效（`min-width` / 圆角 / 配色 / `scale: 0 → 1` / `transform-origin: bottom left`）全在②共用段，①③只留定位 —— 横向 `top: -200%`（气泡在 thumb 上方），竖向 `left: calc(100% + 8px)`（气泡在 thumb 右侧，8dp 间隙）。**别把视觉写在某个朝向块里**，否则另一个朝向的气泡就是个裸 `<span>`。
  - 🔑 **`DraggingIndicator` 的包含块是 thumb，不是 control**：它内部靠 `useSliderThumbPropsContext()` 取 index，**必须是 `Thumb` 的子元素**（渲染成 `<ark.span>`）。所以 Ark 注入的 `inset-inline-start`(横向) / `bottom`(竖向) 的百分比按 **thumb 自身尺寸(20dp)** 解算，而不是轨道长度。
    - 推论：`thumbAlignment` 默认 `"contain"`，`--slider-thumb-offset-N = calc(P% - offsetPx)`，其中 `offsetPx = thumbSize*(frac-0.5)` 而 `P% ` 是 `frac × thumbSize` → 两项相减**恒等于 thumb 尺寸的一半**。所以在气泡上写死 `--slider-thumb-offset-0: 50%` 与 Zag 算出的值**数学等价**，但不依赖 `thumbSize` 是否已实测（未实测时 Zag 给 `40%` 并把 thumb 设成 `visibility: hidden`）。用 `50%` 更确定。
    - 竖向 Ark **只给 `bottom`、不给 `left`**，所以竖向的 `left` 可以放心写；横向反之（只给 `inset-inline-start`，纵向得自己补 `top`）。
- **不写 aria-\***（Ark 内部自带）；children 传了就渲染 `Label`，不传就是裸控件
- **状态层分工**：MD3 里 Switch **没有**水波纹 → 允许伪元素画状态层；CheckBox/Radio 等**有**水波纹 → 状态层必须是真实元素 + `<Ripple />`，禁用伪元素
- **Ripple 用法**：容器 `border-radius: inherit` + `overflow: hidden`，即"背板定形、Ripple 填充"；`parent` 默认取 `container.parentElement`（交互宿主）；hover 图层走 `--s-ripple-hover-opacity`（MD3 8%），按压波纹峰值走 `--s-ripple-opacity`（MD3 10%）；它**没有 focus 处理**，键盘聚焦态需自己用背板 `background-color: color-mix(in srgb, currentColor 10%, transparent)` 补（用 background 而非 opacity，否则会压暗内部的波纹）；disabled 直接 `display: none` 掉背板最省事
- **已按用户决定移除宿主属性通道**：原 mdui 血统里 Ripple 会在 parent 上写 `hover`/`pressed` 裸属性（mdui 那份旧 CSS 里满是 `.mdui-switch[hover]`、`.mdui-button--tonal[hover]:not([pressed])`——那是 shadow DOM 时代跨边界通信的必需品）。本仓库是 light DOM + Ark 的 `data-hover`/`data-active`，属性通道纯属重复，已删；`disabledHover` 语义保留（只控制自带 hover 图层）。**因此 MD3"按住时 10% pressed 层"没有现成信号**，将来要补就用 CSS `:active` 或重新引入状态输出。
- **Ripple 的按压是"松手才播"**：`start()` 里 mouse 走 `oneEvent(['pointerup','pointercancel'], run)`、touch 无 delay 时走 `touchend` → **按住期间没有任何视觉**（只有 hover mask）。所以 MD3 要求的"按住时 10% pressed 状态层"必须宿主自己补（属性通道已删，只能靠 `:active` 等 CSS 手段）。
- 自带 hover 图层是**逐事件判 `pointerType === 'mouse'`**（混合设备上触屏点按不会粘住）。宿主若改用 CSS `&:hover` 则拿不到这层过滤——`:hover` 在触屏点按后会粘住，`@media (any-pointer: fine)` 只看设备能力、救不了混合机型。
- 无 `SkillManage` 工具时，skill 直接写 `<workspace>/.workbuddy/skills/<name>/SKILL.md`
- **演示壳层**：`html/body/#root` 已由 `normalize.css` 设为 `100vh + overflow: hidden` → 整页天然不滚，左右分栏只需外层 `display: flex; height: 100vh; overflow: hidden` + 两个 pane 各自 `overflow-y: auto`（右栏记得 `min-width: 0`，否则内容会撑破 flex 项）。`src/App.tsx` 只留壳层（nav + main + 标题/说明），切换用 `createSignal(demos[0])` + `{active().render()}`。
- **演示模块的目录约定**（每个组件一个文件，别堆回 App.tsx）：
  - `src/demos/types.ts` → `Demo { name; desc; render: () => JSX.Element }`
  - `src/demos/DemoList.tsx` → 共用行式布局 `DemoList` / `Row` / `StateText`（同时收着 list/row/caption/state 四个 css）
  - `src/demos/XxxDemo.tsx` → 一个组件一个文件，导出 `xxxDemo: Demo`；正文函数用 `render: () => <XxxDemo />` 包一层，**别写成 `render: XxxDemo`**——直接赋值会被 `render()` 裸调用，丢掉 `createComponent` 的组件边界（owner）
  - `src/demos/index.ts` → 注册表 `export const demos: Demo[] = [...]`，顺序 = 侧边栏顺序；新增组件只改这一行
- **壳层样式用 `css` + `classNames`，别用 `styled`**：`solid-styled-components` 的 `styled` 只 `splitProps(clone, ['as','theme'])`，其余 prop（例如演示用的布尔 `active`）会被 spread 到真实 DOM 上。

## 4. CSS 易错点（踩过的坑）

- `inset: 50% auto auto 50%` + `translate: -50% -50%` 才能居中任意尺寸的溢出元素；`inset: 0 + margin: auto` 对**大于容器**的盒子不成立（水平方向负 margin 例外 → 塌到左边），`translate: -50%` 单值只移 x
- **`display` 不是可动画属性**：用 `display: none/block` 切换的元素（含伪元素）切换状态时是硬切。要动画就让元素**常驻渲染**，改用 `opacity` + `transform` 做交叉淡入淡出（CheckBox 的短横线 ↔ 对勾就是这么改的：短横线常驻 `opacity: 0; transform: scaleX(0.4)`，indeterminate 时 `opacity: 1; transform: none`）。注意 CSS transition 的时长/延迟由**进入态**的规则决定，所以做不到"仅从 indeterminate 进入 checked 时延迟"这种成对定制。
- Ark 的 `Indicator` 会挂 `[hidden]`，要动画就得 `display: block` 覆盖它（Control 已 `aria-hidden`，无副作用）
- `Indicator` 用 `inset: -2px` 撑满 control 的 border box（负 inset 做拉伸是安全的）
- ⚠️ **`transform` 属性比 `scale`/`translate`/`rotate` 这些独立属性更「内层」**。矩阵顺序是 `translate · rotate · scale · transform`，而矩阵作用到点上是**从右往左**，所以 `transform` 最先被应用。后果：**给一个元素做 `scale: 0 → 1` 入场时，它的 `transform`（比如库注入的居中位移）会被 `scale: 0` 一起塌掉** —— 位移在 s=0 时对结果完全没有贡献。
  - 典型坑（Slider 的 DraggingIndicator）：Ark 用 inline `transform: translateX(-50%)` 做水平居中，`transform-origin: bottom center` 于是被相对「**未位移**的盒子」解算 → 塌陷点落在最终盒子的**右下角**，动效看起来是"从右下角冒出"。要让它从底边中心长出来，得写 `transform-origin: bottom left`（未位移盒子的左边缘 = 最终居中盒子的底边中心）。锚点与内容宽度无关。
  - 更"诚实"的替代方案：把居中从 `transform` 换成 `translate` 属性（`transform: none; translate: -50% 0`），此时 `transform-origin: bottom center` 就符合直觉了。代价是要 `!important` 压库的 inline 样式（本仓库至今零个 `!important`），且竖向要另写一套。**本仓库选前者（改锚点关键字）。**
  - 同理，**任何要被 `scale`/`rotate` 的元素，如果同时依赖库注入的 `transform`，锚点都要按「未位移的盒子」来算。**

