import { ScrollArea } from '@libs/components/ScrollArea';
import { For } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const scrollAreaDemo: Demo = {
  name: 'ScrollArea',
  desc: 'MD3 滚动容器, 隐藏原生滚动条, 悬停 / 滚动时淡入细滚动条, 横竖向均支持。',
  render: () => <ScrollAreaDemo />,
};

const paragraph =
  'Material Design 3 是 Google 的设计系统, 提供了动态取色、组件规范与动效标准。滚动区域组件用于在固定尺寸的内容框内浏览溢出内容, 滚动条平时隐藏, 交互时淡入, 避免长期占用视觉空间。';

function ScrollAreaDemo() {
  return (
    <DemoList>
      <Row caption='竖向滚动'>
        <div class={verticalBoxClassName}>
          <ScrollArea>
            <For each={Array.from({ length: 8 })}>{() => <p class={textClassName}>{paragraph}</p>}</For>
          </ScrollArea>
        </div>
      </Row>
      <Row caption='横向滚动'>
        <div class={horizontalBoxClassName}>
          <ScrollArea>
            <div class={rowContentClassName}>
              <For each={Array.from({ length: 10 })}>{(_, i) => <div class={cellClassName}>{i()}</div>}</For>
            </div>
          </ScrollArea>
        </div>
      </Row>
    </DemoList>
  );
}

const verticalBoxClassName = css`
  flex: 1;
  min-width: 0;
  height: 180px;
  border: 1px solid var(--mdui-color-outline-variant);
  border-radius: 8px;
`;

const horizontalBoxClassName = css`
  flex: 1;
  min-width: 0;
  border: 1px solid var(--mdui-color-outline-variant);
  border-radius: 8px;
`;

const textClassName = css`
  margin: 0;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 22px;
  color: var(--mdui-color-on-surface-variant);
`;

const rowContentClassName = css`
  display: flex;
  gap: 12px;
  padding: 12px;
`;

const cellClassName = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 96px;
  height: 64px;
  border-radius: 8px;
  background-color: var(--mdui-color-primary-container);
  color: var(--mdui-color-primary);
  font-size: 18px;
`;
