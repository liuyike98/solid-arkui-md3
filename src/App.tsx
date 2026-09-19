import { Icon } from '@libs/components/Icon';
import { setThemeMode, setThemeSeed, themeMode, themeSeed } from '@libs/themes/theme';
import { createSignal, For } from 'solid-js';
import { css } from 'solid-styled-components';
import './assets/normalize.css';
import { classNames } from '@libs/utils/classNames';
import { demos } from './demos';

/** 导航底部主题色选择器: 种子色预设 */
const SEED_PRESETS = [
  { label: '橄榄', seed: '#596400' },
  { label: '海蓝', seed: '#00658e' },
  { label: '紫罗兰', seed: '#6750a4' },
];

function App() {
  const [active, setActive] = createSignal(demos[0]);

  return (
    <div class={shellClassName}>
      <nav class={navClassName}>
        <div class={navScrollClassName}>
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
        </div>
        <div class={themeBarClassName}>
          <div class={themeBarTitleClassName}>主题色</div>
          <div class={themeBarRowClassName}>
            <div class={swatchGroupClassName}>
              <For each={SEED_PRESETS}>
                {(preset) => (
                  <button
                    type='button'
                    class={classNames(swatchClassName, { [swatchActiveClassName]: preset.seed === themeSeed() })}
                    style={{ '--swatch': preset.seed }}
                    title={preset.label}
                    aria-label={`切换主题色: ${preset.label}`}
                    onClick={() => setThemeSeed(preset.seed)}
                  />
                )}
              </For>
            </div>
            <button
              type='button'
              class={modeToggleClassName}
              title={themeMode() === 'dark' ? '切换为浅色' : '切换为深色'}
              aria-label='切换深色模式'
              onClick={() => setThemeMode(themeMode() === 'dark' ? 'light' : 'dark')}
            >
              <Icon name={themeMode() === 'dark' ? 'light_mode' : 'dark_mode'} size={18} />
            </button>
          </div>
        </div>
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
  background-color: var(--mdui-color-background);
  color: var(--mdui-color-on-background);
`;

const navClassName = css`
  display: flex;
  flex-direction: column;
  flex: none;
  box-sizing: border-box;
  width: 232px;
  padding: 24px 12px;
  border-right: 1px solid var(--mdui-color-outline-variant);
`;

const navScrollClassName = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

const navTitleClassName = css`
  padding: 0 16px 8px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--mdui-color-outline);
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
  color: var(--mdui-color-on-surface-variant);
  cursor: pointer;
  transition: background-color ease 150ms;

  &:hover {
    background-color: color-mix(in srgb, var(--mdui-color-primary) 8%, transparent);
  }
`;

const navItemActiveClassName = css`
  background-color: var(--mdui-color-secondary-container);
  color: var(--mdui-color-on-secondary-container);
`;

/* 底部主题色选择区 */
const themeBarClassName = css`
  flex: none;
  padding: 16px 16px 4px;
  border-top: 1px solid var(--mdui-color-outline-variant);
`;

const themeBarTitleClassName = css`
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: var(--mdui-color-outline);
`;

const themeBarRowClassName = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const swatchGroupClassName = css`
  display: flex;
  gap: 12px;
`;

const swatchClassName = css`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: var(--swatch);
  cursor: pointer;
  transition:
    box-shadow 150ms cubic-bezier(0.2, 0, 0, 1),
    scale 150ms cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    scale: 1.1;
  }
`;

const swatchActiveClassName = css`
  box-shadow:
    0 0 0 2px var(--mdui-color-background),
    0 0 0 4px var(--swatch);
`;

const modeToggleClassName = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--mdui-color-outline-variant);
  border-radius: 50%;
  background: none;
  color: var(--mdui-color-on-surface-variant);
  cursor: pointer;
  transition:
    background-color 150ms cubic-bezier(0.2, 0, 0, 1),
    border-color 150ms cubic-bezier(0.2, 0, 0, 1);

  &:hover {
    background-color: color-mix(in srgb, var(--mdui-color-on-surface) 8%, transparent);
    border-color: var(--mdui-color-outline);
  }
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
  color: var(--mdui-color-on-surface);
`;

const descClassName = css`
  max-width: 640px;
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--mdui-color-outline);
`;

export default App;
