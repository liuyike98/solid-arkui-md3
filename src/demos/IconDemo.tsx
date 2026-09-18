import { Icon } from '@libs/components/Icon';
import type { MaterialIcon } from '@material-design-icons/font';
import { For } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const iconDemo: Demo = {
  name: 'Icon',
  desc: 'Material Icons 字体图标, name 指定图标, size 指定像素尺寸, 颜色跟随 currentColor。',
  render: () => <IconDemo />,
};

const commonIcons: MaterialIcon[] = [
  'home',
  'star',
  'favorite',
  'search',
  'settings',
  'delete',
  'edit',
  'close',
  'check',
  'add',
  'remove',
  'share',
  'download',
  'more_vert',
  'notifications',
  'account_circle',
];

const iconSizes: number[] = [18, 24, 36, 48, 64];

function IconDemo() {
  return (
    <DemoList>
      <Row caption='常用图标'>
        <div class={gridClassName}>
          <For each={commonIcons}>{(name) => <Icon name={name} />}</For>
        </div>
      </Row>
      <Row caption='尺寸'>
        <div class={gridClassName}>
          <For each={iconSizes}>{(size) => <Icon name='star' size={size} />}</For>
        </div>
      </Row>
      <Row caption='跟随颜色'>
        <div class={gridClassName}>
          <span class={redClassName}>
            <Icon name='favorite' />
          </span>
          <span class={greenClassName}>
            <Icon name='check_circle' />
          </span>
          <span class={blueClassName}>
            <Icon name='info' />
          </span>
        </div>
      </Row>
    </DemoList>
  );
}

const gridClassName = css`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const redClassName = css`
  color: #ba1a1a;
`;

const greenClassName = css`
  color: #006d3d;
`;

const blueClassName = css`
  color: #00658e;
`;
