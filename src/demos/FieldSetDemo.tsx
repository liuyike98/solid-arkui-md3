import { FieldSet } from '@libs/components/FieldSet';
import { Icon } from '@libs/components/Icon';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const fieldSetDemo: Demo = {
  name: 'FieldSet',
  desc: '带缺口图例的边框容器: 复用 TextField 的 clip-path 缺口方案, 图例浮在顶线, focused 2px 主色, floating 图例沉入盒内。',
  render: () => <FieldSetDemo />,
};

function FieldSetDemo() {
  return (
    <DemoList>
      <Row caption='三种状态'>
        <div class={colClassName}>
          <FieldSet legend='图例浮在顶线 (默认)' body={<div>主体内容, 顶线在图例处断开。</div>} />
          <FieldSet focused legend='focused' body={<div>2px 主色描边 (边框 + outline 内圈)。</div>} />
          <FieldSet floating legend='图例沉入 (内容待输入)' body={<div class={hintClassName} />} />
        </div>
      </Row>
      <Row caption='前尾区'>
        <FieldSet
          start={<Icon name='search' />}
          legend='带 start / end'
          body={<div>前导图标与尾部区域。</div>}
          end={<span class={endClassName}>3/5</span>}
        />
      </Row>
    </DemoList>
  );
}

const colClassName = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 16px;
`;

const hintClassName = css`
  min-height: 22px;
`;

const endClassName = css`
  font-size: 12px;
  color: var(--mdui-color-on-surface-variant);
`;
