# solid-mdui-arkui 项目长期约定

SolidJS + Ark UI (`@ark-ui/solid`) + `solid-styled-components` 实现 Material Design 3 组件库。

## 组件实现

- 结构模板：`Root / Control / Track / Thumb / HiddenInput …` + `splitProps(props, ['class','children'])` + `classNames(rootClassName, local.class)` + `{...restProps}`。
- **不写 `aria-*`**（Ark 自带）；children 传了就渲染 `Label`，不传就是裸控件。
- **`Slider` 样式模板三段式**：① 尺寸（朝向给 root 定宽高）② 共用（各 `data-part` 的形状 + 配色 + 伪元素状态层）③ 几何（朝向块覆盖 flex 方向、轴向 CSS 变量、元素定位）。覆盖靠特异性（朝向块恒多一层 `[data-orientation]`，稳定压过共用块），**不靠书写顺序** —— 所以「共用在前后」只是可读性选择。新增元素一律先想「形状配色进②、定位进①③」。
- **全库零 `!important`**。遇到按库注入的 inline 样式（如 Ark 给 thumb / dragging-indicator 注入的 `transform`、`inset-inline-start`、`bottom`）时，优先【改自己的锚点或改写 CSS 变量】来绕开，而不是强压。
- `styled` 不要用（它会把非 `as`/`theme` 的 prop spread 到真实 DOM）；一律 `css` + `classNames`。

## 演示页（src/demos）

- 一个组件一个文件，导出 `xxxDemo: Demo`；`render` 必须写成 `() => <XxxDemo />`，直接赋值 `render: XxxDemo` 会丢组件边界（owner）。
- `src/demos/index.ts` 的 `demos` 数组顺序 = 侧边栏顺序，新增组件只改这一行。
- `src/App.tsx` 只留壳层（nav + main + 壳层 css），演示内容全部下沉。

## 协作方式

- **改代码前先给「诊断 + 方案」，用户明确同意后再落地**，尤其针对 bug 修复类任务。
- **不主动起/重启 dev server，不做手动验证** —— 用户开着热重载、用截图反馈效果。助手只改代码。
- 结构性/语义性问题优先用离线手段**查证**再下结论，别靠推断：
  - goober SSR 转储看真实发出的 CSS（见 skill §1）
  - 无头 Chrome 量真实几何（见 skill §1.2）
  - 读 `@ark-ui/solid` / `@zag-js` 源码确认「库到底注入了什么」
  上述方法与踩过的坑都在 `<workspace>/.workbuddy/skills/solid-mdui-verify/SKILL.md`。
