import { buttonDemo } from './ButtonDemo';
import { checkBoxDemo } from './CheckBoxDemo';
import { dialogDemo } from './DialogDemo';
import { iconButtonDemo } from './IconButtonDemo';
import { iconDemo } from './IconDemo';
import { loadingDemo } from './LoadingDemo';
import { menuDemo } from './MenuDemo';
import { popoverDemo } from './PopoverDemo';
import { progressDemo } from './ProgressDemo';
import { radioDemo } from './RadioDemo';
import { scrollAreaDemo } from './ScrollAreaDemo';
import { selectDemo } from './SelectDemo';
import { sliderDemo } from './SliderDemo';
import { spinnerDemo } from './SpinnerDemo';
import { switchDemo } from './SwitchDemo';
import { textFieldDemo } from './TextFieldDemo';
import { toastDemo } from './ToastDemo';
import { tooltipDemo } from './TooltipDemo';
import type { Demo } from './types';

export type { Demo } from './types';

/** 演示注册表: 数组顺序 = 侧边栏顺序, 新增组件只需在这里追加一行 */
export const demos: Demo[] = [
  buttonDemo,
  iconDemo,
  iconButtonDemo,
  menuDemo,
  switchDemo,
  checkBoxDemo,
  sliderDemo,
  spinnerDemo,
  selectDemo,
  tooltipDemo,
  loadingDemo,
  radioDemo,
  progressDemo,
  popoverDemo,
  dialogDemo,
  toastDemo,
  scrollAreaDemo,
  textFieldDemo,
];
