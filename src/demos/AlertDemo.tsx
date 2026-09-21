import { Alert } from '@libs/components/Alert';
import { Icon } from '@libs/components/Icon';
import { Button } from '@libs/components/Button';
import { Show, createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const alertDemo: Demo = {
  name: 'Alert',
  desc: '提示条, 五种变体 (surface / info / success / warning / error), 可关闭与可折叠, 折叠展开带高度动画。',
  render: () => <AlertDemo />,
};

function AlertDemo() {
  const [visible, setVisible] = createSignal(true);
  const [open, setOpen] = createSignal(false);

  return (
    <DemoList>
      <Row caption='五种变体'>
        <div class={colClassName}>
          <Alert title='Surface 提示' start={<Icon name='inbox' />}>
            默认变体, 带 surface-variant 描边。
          </Alert>
          <Alert variant='info' title='Info 提示' start={<Icon name='info' />}>
            这是一条信息提示。
          </Alert>
          <Alert variant='success' title='Success 提示' start={<Icon name='check_circle' />}>
            操作已成功完成。
          </Alert>
          <Alert variant='warning' title='Warning 提示' start={<Icon name='warning' />}>
            请注意潜在风险。
          </Alert>
          <Alert variant='error' title='Error 提示' start={<Icon name='error' />}>
            操作失败, 请重试。
          </Alert>
        </div>
      </Row>
      <Row caption='仅标题'>
        <div class={colClassName}>
          <Alert title='Surface 提示' start={<Icon name='inbox' />} />
          <Alert variant='info' title='Info 提示' start={<Icon name='info' />} />
          <Alert variant='success' title='Success 提示' start={<Icon name='check_circle' />} />
          <Alert variant='warning' title='Warning 提示' start={<Icon name='warning' />} />
          <Alert variant='error' title='Error 提示' start={<Icon name='error' />} />
        </div>
      </Row>
      <Row caption='可关闭'>
        <div class={colClassName}>
          <Show when={visible()} fallback={<Button onClick={() => setVisible(true)}>恢复提示</Button>}>
            <Alert variant='error' closable onClose={() => setVisible(false)} start={<Icon name='error' />} title='发生错误'>
              点击右侧按钮关闭本条提示。
            </Alert>
          </Show>
        </div>
      </Row>
      <Row caption='折叠 (受控 open)'>
        <div class={colClassName}>
          <Alert collapsed open={open()} onToggle={setOpen} start={<Icon name='help' />} title='这是什么?'>
            折叠模式下正文收纳在标题下方, 点击右侧箭头展开, 高度动画自动播放; 再次点击收起。
            这是一段较长的说明文字, 用于展示多行内容的展开与收起效果。
          </Alert>
          <StateText>{open() ? '已展开' : '已收起'}</StateText>
        </div>
      </Row>
      <Row caption='尾部操作'>
        <Alert variant='info' start={<Icon name='event' />} title='会议提醒' end={<Button size='extra-small' variant='text' onClick={() => {}}>稍后</Button>}>
          30 分钟后开始。
        </Alert>
      </Row>
    </DemoList>
  );
}

const colClassName = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 12px;
`;
