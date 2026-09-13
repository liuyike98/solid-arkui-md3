import { createSignal, For, type JSX } from 'solid-js';
import { css } from 'solid-styled-components';
import './assets/normalize.css';
import { Switch } from '@libs/components/Switch';
import { CheckBox } from '@libs/components/CheckBox';
import { classNames } from '@libs/utils/classNames';

interface Demo {
  name: string;
  desc: string;
  render: () => JSX.Element;
}

const demos: Demo[] = [
  {
    name: 'Switch',
    desc: 'MD3 开关, 轨道 28×48dp, 选中时填充 primary。MD3 规范中 Switch 不带水波纹, 状态层由 CSS 实现。',
    render: () => <SwitchDemo />,
  },
  {
    name: 'CheckBox',
    desc: 'MD3 复选框, 18dp 容器 (2dp 圆角 + 2dp 描边) 搭配 40dp 状态层, 支持未选中 / 选中 / 半选三态, 按压带水波纹。',
    render: () => <CheckBoxDemo />,
  },
];

function App() {
  const [active, setActive] = createSignal(demos[0]);

  return (
    <div class={shellClassName}>
      <nav class={navClassName}>
        <div class={navTitleClassName}>组件</div>
        <For each={demos}>
          {(demo) => (
            <button
              type='button'
              class={classNames(navItemClassName, { [navItemActiveClassName]: demo === active() })}
              onClick={() => setActive(demo)}
            >
              {demo.name}
            </button>
          )}
        </For>
      </nav>
      <main class={mainClassName}>
        <h1 class={titleClassName}>{active().name}</h1>
        <p class={descClassName}>{active().desc}</p>
        {active().render()}
      </main>
    </div>
  );
}

function SwitchDemo() {
  const [checked, setChecked] = createSignal(true);

  return (
    <div class={listClassName}>
      <Row caption='未选中'>
        <Switch />
      </Row>
      <Row caption='选中'>
        <Switch defaultChecked={true} />
      </Row>
      <Row caption='禁用'>
        <Switch disabled={true} />
      </Row>
      <Row caption='选中 + 禁用'>
        <Switch defaultChecked={true} disabled={true} />
      </Row>
      <Row caption='交互示例'>
        <Switch defaultChecked={true} onCheckedChange={(details) => setChecked(details.checked)} />
        <div class={stateClassName}>当前: {checked() ? 'checked' : 'unchecked'}</div>
      </Row>
    </div>
  );
}

function CheckBoxDemo() {
  const [checked, setChecked] = createSignal<boolean | 'indeterminate'>('indeterminate');

  return (
    <div class={listClassName}>
      <Row caption='未选中'>
        <CheckBox />
      </Row>
      <Row caption='选中'>
        <CheckBox defaultChecked={true} />
      </Row>
      <Row caption='半选'>
        <CheckBox defaultChecked='indeterminate' />
      </Row>
      <Row caption='禁用'>
        <CheckBox disabled={true} />
      </Row>
      <Row caption='选中 + 禁用'>
        <CheckBox defaultChecked={true} disabled={true} />
      </Row>
      <Row caption='带文字标签'>
        <CheckBox>记住这台设备</CheckBox>
      </Row>
      <Row caption='交互示例'>
        <CheckBox checked={checked()} onCheckedChange={(details) => setChecked(details.checked)}>
          三态切换
        </CheckBox>
        <div class={stateClassName}>当前: {String(checked())}</div>
      </Row>
    </div>
  );
}

function Row(props: { caption: string; children: JSX.Element }) {
  return (
    <div class={rowClassName}>
      <div class={captionClassName}>{props.caption}</div>
      {props.children}
    </div>
  );
}

const shellClassName = css`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const navClassName = css`
  flex: none;
  box-sizing: border-box;
  width: 232px;
  padding: 24px 12px;
  overflow-y: auto;
  border-right: 1px solid #e5e2da;
`;

const navTitleClassName = css`
  padding: 0 16px 8px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: #78786a;
`;

const navItemClassName = css`
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 48px;
  margin-top: 4px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  background: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: #45483c;
  cursor: pointer;
  transition: background-color ease 150ms;

  &:hover {
    background-color: rgb(89 100 0 / 0.08);
  }
`;

const navItemActiveClassName = css`
  background-color: rgb(89 100 0 / 0.12);
  color: #596400;
`;

const mainClassName = css`
  flex: 1;
  min-width: 0;
  padding: 40px 40px 80px;
  overflow-y: auto;
`;

const titleClassName = css`
  margin: 0;
  font-size: 28px;
  font-weight: 400;
  line-height: 36px;
  color: #1c1b17;
`;

const descClassName = css`
  max-width: 640px;
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 20px;
  color: #78786a;
`;

const listClassName = css`
  max-width: 640px;
  margin-top: 24px;
  border: 1px solid #e5e2da;
  border-radius: 12px;
`;

const rowClassName = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;

  & + & {
    border-top: 1px solid #e5e2da;
  }
`;

const captionClassName = css`
  flex: none;
  width: 132px;
  font-size: 14px;
  color: #78786a;
`;

const stateClassName = css`
  margin-left: auto;
  font-size: 14px;
  color: #78786a;
`;

export default App;
