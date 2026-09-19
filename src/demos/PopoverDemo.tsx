import { Button } from '@libs/components/Button';
import { Popover } from '@libs/components/Popover';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const popoverDemo: Demo = {
  name: 'Popover',
  desc: 'MD3 浮出面板, 点击触发, 白色 surface + 阴影, 可带标题, 支持多方位。',
  render: () => <PopoverDemo />,
};

function PopoverDemo() {
  return (
    <DemoList>
      <Row caption='基础'>
        <Popover
          title='弹出框标题'
          content={<p class={textClassName}>点击触发元素打开, 点击外部或 Esc 关闭。</p>}
        >
          <Button variant='outlined'>打开 Popover</Button>
        </Popover>
      </Row>
      <Row caption='方位'>
        <div class={groupClassName}>
          <Popover content='上方' placement='top'>
            <Button variant='tonal'>top</Button>
          </Popover>
          <Popover content='下方' placement='bottom'>
            <Button variant='tonal'>bottom</Button>
          </Popover>
          <Popover content='左侧' placement='left'>
            <Button variant='tonal'>left</Button>
          </Popover>
          <Popover content='右侧' placement='right'>
            <Button variant='tonal'>right</Button>
          </Popover>
        </div>
      </Row>
      <Row caption='带操作'>
        <Popover
          title='删除项目?'
          content={
            <div>
              <p class={textClassName}>删除后不可恢复。</p>
              <div class={actionsClassName}>
                <Button variant='text' size='extra-small'>
                  取消
                </Button>
                <Button size='extra-small'>删除</Button>
              </div>
            </div>
          }
        >
          <Button variant='outlined'>危险操作</Button>
        </Popover>
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

const textClassName = css`
  margin: 0;
`;

const actionsClassName = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;
