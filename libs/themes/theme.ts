import { argbFromHex, hexFromArgb, themeFromSourceColor, type CustomColor } from '@material/material-color-utilities';
import { createSignal } from 'solid-js';

export type ThemeMode = 'auto' | 'light' | 'dark';

/** 默认种子色 (与仓库现有橄榄绿一致) */
export const DEFAULT_SEED = '#596400';

type PaletteName = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutralVariant' | 'error';

/** M3 色彩角色 -> [取色调色板, 浅色 tone, 深色 tone] */
const ROLE_TONES: Record<string, [PaletteName, number, number]> = {
  primary: ['primary', 40, 80],
  'on-primary': ['primary', 100, 20],
  'primary-container': ['primary', 90, 30],
  'on-primary-container': ['primary', 30, 90],
  secondary: ['secondary', 40, 80],
  'on-secondary': ['secondary', 100, 20],
  'secondary-container': ['secondary', 90, 30],
  'on-secondary-container': ['secondary', 30, 90],
  tertiary: ['tertiary', 40, 80],
  'on-tertiary': ['tertiary', 100, 20],
  'tertiary-container': ['tertiary', 90, 30],
  'on-tertiary-container': ['tertiary', 30, 90],
  error: ['error', 40, 80],
  'on-error': ['error', 100, 20],
  'error-container': ['error', 90, 30],
  'on-error-container': ['error', 30, 90],
  surface: ['neutral', 98, 6],
  'on-surface': ['neutral', 10, 90],
  'surface-variant': ['neutralVariant', 90, 30],
  'on-surface-variant': ['neutralVariant', 30, 80],
  'surface-container-highest': ['neutral', 90, 22],
  'surface-container-high': ['neutral', 92, 17],
  'surface-container': ['neutral', 94, 12],
  'surface-container-low': ['neutral', 96, 10],
  'surface-container-lowest': ['neutral', 100, 4],
  'inverse-surface': ['neutral', 20, 90],
  'inverse-on-surface': ['neutral', 95, 20],
  'inverse-primary': ['primary', 80, 40],
  background: ['neutral', 98, 6],
  'on-background': ['neutral', 10, 90],
  outline: ['neutralVariant', 50, 60],
  'outline-variant': ['neutralVariant', 80, 30],
  scrim: ['neutral', 0, 0],
};

/** 业务扩展色, 参与色调混合 */
const CUSTOM_COLORS: CustomColor[] = [
  { value: argbFromHex('#008000'), name: 'success', blend: true },
  { value: argbFromHex('#ffebcd'), name: 'warning', blend: true },
];

/** 非色彩静态 token: 高度 / 形状 / 动效 / 水波纹 */
const STATIC_TOKENS = `
:root {
  color-scheme: light;

  --mdui-elevation-level1: 0 1px 2px 0 rgb(0 0 0 / 20%), 0 1px 3px 1px rgb(0 0 0 / 10%);
  --mdui-elevation-level2: 0 1px 2px 0 rgb(0 0 0 / 20%), 0 2px 6px 2px rgb(0 0 0 / 10%);
  --mdui-elevation-level3: 0 1px 3px 0 rgb(0 0 0 / 20%), 0 4px 8px 3px rgb(0 0 0 / 10%);
  --mdui-elevation-level4: 0 2px 3px 0 rgb(0 0 0 / 20%), 0 6px 10px 4px rgb(0 0 0 / 10%);
  --mdui-elevation-level5: 0 4px 4px 0 rgb(0 0 0 / 20%), 0 8px 12px 6px rgb(0 0 0 / 10%);

  --mdui-shape-corner-extra-small: 4px;
  --mdui-shape-corner-small: 8px;
  --mdui-shape-corner-medium: 12px;
  --mdui-shape-corner-large: 16px;
  --mdui-shape-corner-extra-large: 28px;

  --mdui-motion-duration-short1: 50ms;
  --mdui-motion-duration-short2: 100ms;
  --mdui-motion-duration-short3: 150ms;
  --mdui-motion-duration-short4: 200ms;
  --mdui-motion-duration-medium1: 250ms;
  --mdui-motion-duration-medium2: 300ms;
  --mdui-motion-duration-medium3: 350ms;
  --mdui-motion-duration-medium4: 400ms;
  --mdui-motion-duration-long1: 450ms;
  --mdui-motion-duration-long2: 500ms;
  --mdui-motion-duration-long3: 550ms;
  --mdui-motion-duration-long4: 600ms;

  --mdui-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --mdui-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --mdui-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --mdui-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --mdui-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --mdui-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);

  --mdui-ripple-color: currentColor;
  --mdui-ripple-opacity: 0.24;
  --mdui-ripple-hover-opacity: 0.1;
}
`;

const lightDark = (lightArgb: number, darkArgb: number) => `light-dark(${hexFromArgb(lightArgb)}, ${hexFromArgb(darkArgb)})`;

const generateColorVars = (seed: string): Record<string, string> => {
  const theme = themeFromSourceColor(argbFromHex(seed), CUSTOM_COLORS);
  const vars: Record<string, string> = {};

  for (const [role, [palette, lightTone, darkTone]] of Object.entries(ROLE_TONES)) {
    vars[`--mdui-color-${role}`] = lightDark(theme.palettes[palette].tone(lightTone), theme.palettes[palette].tone(darkTone));
  }

  /* success / warning 四件套: color / on-color / color-container / on-color-container */
  for (const custom of theme.customColors) {
    const name = custom.color.name ?? '';
    vars[`--mdui-color-${name}`] = lightDark(custom.light.color, custom.dark.color);
    vars[`--mdui-color-on-${name}`] = lightDark(custom.light.onColor, custom.dark.onColor);
    vars[`--mdui-color-${name}-container`] = lightDark(custom.light.colorContainer, custom.dark.colorContainer);
    vars[`--mdui-color-on-${name}-container`] = lightDark(custom.light.onColorContainer, custom.dark.onColorContainer);
  }

  return vars;
};

const [seedSignal, setSeedSignal] = createSignal(DEFAULT_SEED);
const [modeSignal, setModeSignal] = createSignal<ThemeMode>('light');

const applyVars = (vars: Record<string, string>) => {
  const style = document.documentElement.style;
  for (const [key, value] of Object.entries(vars)) style.setProperty(key, value);
};

/** 当前种子色 (hex) */
export const themeSeed = () => seedSignal();
/** 当前明暗模式 */
export const themeMode = () => modeSignal();

/** 换种子色: 重新生成整套 M3 色彩变量 */
export function setThemeSeed(seed: string) {
  setSeedSignal(seed);
  applyVars(generateColorVars(seed));
}

/** 明暗模式: auto 跟随系统 (依赖 light-dark(), 无需重算变量) */
export function setThemeMode(mode: ThemeMode) {
  setModeSignal(mode);
  document.documentElement.style.colorScheme = mode === 'auto' ? 'light dark' : mode;
}

/* 模块导入即完成初始化: 注入静态 token + 应用默认种子色 */
if (typeof document !== 'undefined') {
  if (!document.getElementById('mdui-theme-tokens')) {
    const style = document.createElement('style');
    style.id = 'mdui-theme-tokens';
    style.textContent = STATIC_TOKENS;
    document.head.appendChild(style);
  }
  applyVars(generateColorVars(DEFAULT_SEED));
}
