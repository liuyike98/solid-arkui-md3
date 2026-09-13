import { createSignal, For } from 'solid-js';
import { css } from 'solid-styled-components';
import './assets/normalize.css';
import { classNames } from '@libs/utils/classNames';
import { demos } from './demos';

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

export default App;
