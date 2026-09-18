import { Button } from '@libs/components/Button';
import { Tooltip } from '@libs/components/Tooltip';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const tooltipDemo: Demo = {
  name: 'Tooltip',
  desc: 'MD3 文字提示, 悬停 / 聚焦触发, 深灰底 4dp 圆角, 支持 12 个方位与自定义开合延时。',
  render: () => <TooltipDemo />,
};

function TooltipDemo() {
  return (
    <DemoList>
      <Row caption='基础'>
        <Tooltip content='我是一条提示'>
          <Button variant='outlined'>悬停查看</Button>
        </Tooltip>
      </Row>
      <Row caption='方位'>
        <div class={groupClassName}>
          <Tooltip content='上方提示' placement='top'>
            <Button variant='tonal'>top</Button>
          </Tooltip>
          <Tooltip content='下方提示' placement='bottom'>
            <Button variant='tonal'>bottom</Button>
          </Tooltip>
          <Tooltip content='左侧提示' placement='left'>
            <Button variant='tonal'>left</Button>
          </Tooltip>
          <Tooltip content='右侧提示' placement='right'>
            <Button variant='tonal'>right</Button>
          </Tooltip>
        </div>
      </Row>
      <Row caption='自定义延时'>
        <Tooltip content='立即出现, 0.5s 后消失' openDelay={0} closeDelay={500}>
          <Button variant='outlined'>openDelay 0 / closeDelay 500</Button>
        </Tooltip>
      </Row>
      <Row caption='长文本'>
        <Tooltip content='Tooltip 适合放一句话说明, 长文本会自动换行, 最大宽度 250px。'>
          <Button variant='text'>长文本提示</Button>
        </Tooltip>
      </Row>
      <Row caption='禁用'>
        <Tooltip content='不会出现的提示' disabled>
          <Button variant='outlined'>disabled</Button>
        </Tooltip>
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
