import { IconButton } from '@libs/components/IconButton';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const iconButtonDemo: Demo = {
  name: 'IconButton',
  desc: 'MD3 图标按钮, 圆形 40dp 热区, 四种形态 (standard / filled / tonal / outlined), 悬停状态层 + 按下水波纹, size 控制直径。',
  render: () => <IconButtonDemo />,
};

function IconButtonDemo() {
  return (
    <DemoList>
      <Row caption='四种形态'>
        <div class={groupClassName}>
          <IconButton name='favorite' />
          <IconButton name='favorite' variant='filled' />
          <IconButton name='favorite' variant='tonal' />
          <IconButton name='favorite' variant='outlined' />
        </div>
      </Row>
      <Row caption='尺寸'>
        <div class={groupClassName}>
          <IconButton name='settings' variant='tonal' size={28} />
          <IconButton name='settings' variant='tonal' size={40} />
          <IconButton name='settings' variant='tonal' size={56} />
        </div>
      </Row>
      <Row caption='禁用'>
        <div class={groupClassName}>
          <IconButton name='share' />
          <IconButton name='share' disabled />
          <IconButton name='share' variant='filled' disabled />
        </div>
      </Row>
      <Row caption='事件透传'>
        <IconButton
          name='thumb_up'
          variant='outlined'
          aria-label='点赞'
          onClick={(event) => {
            const btn = event.currentTarget as HTMLButtonElement;
            btn.dataset.active = btn.dataset.active ? '' : '1';
          }}
        />
      </Row>
    </DemoList>
  );
}

const groupClassName = css`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;
