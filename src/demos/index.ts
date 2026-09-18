import { buttonDemo } from './ButtonDemo';
import { checkBoxDemo } from './CheckBoxDemo';
import { iconDemo } from './IconDemo';
import { menuDemo } from './MenuDemo';
import { sliderDemo } from './SliderDemo';
import { spinnerDemo } from './SpinnerDemo';
import { switchDemo } from './SwitchDemo';
import type { Demo } from './types';

export type { Demo } from './types';

/** 演示注册表: 数组顺序 = 侧边栏顺序, 新增组件只需在这里追加一行 */
export const demos: Demo[] = [buttonDemo, iconDemo, menuDemo, switchDemo, checkBoxDemo, sliderDemo, spinnerDemo];
