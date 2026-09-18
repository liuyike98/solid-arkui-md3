import { Button, type ButtonSize, type ButtonVariant } from '@libs/components/Button';
import { Icon } from '@libs/components/Icon';
import { createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const buttonDemo: Demo = {
  name: 'Button',
  desc: 'MD3 按钮, 五种形态 (filled / elevated / tonal / outlined / text), 四档尺寸, 前后缀图标, 水波纹。',
  render: () => <ButtonDemo />,
};

const variants: ButtonVariant[] = ['filled', 'elevated', 'tonal', 'outlined', 'text'];
const sizes: [ButtonSize | undefined, string][] = [
  ['extra-small', 'extra-small'],
  [undefined, 'small (默认)'],
  ['medium', 'medium'],
  ['large', 'large'],
];

function ButtonDemo() {
  const [count, setCount] = createSignal(0);

  return (
    <DemoList>
      <Row caption='五种形态'>
        <div class={groupClassName}>
          {variants.map((variant) => (
            <Button variant={variant}>{variant}</Button>
          ))}
        </div>
      </Row>
      <Row caption='前后缀图标'>
        <div class={groupClassName}>
          <Button iconStart={<Icon name='star' />}>Button</Button>
          <Button iconStart={<Icon name='star' />} iconEnd={<Icon name='close' />}>
            Button
          </Button>
          <Button variant='text' iconEnd={<Icon name='close' />}>
            Text
          </Button>
        </div>
      </Row>
      <Row caption='尺寸'>
        <div class={groupClassName}>
          {sizes.map(([size, caption]) => (
            <Button size={size}>{caption}</Button>
          ))}
        </div>
      </Row>
      <Row caption='禁用'>
        <div class={groupClassName}>
          <Button disabled>Disabled</Button>
          <Button variant='outlined' disabled>
            Disabled
          </Button>
        </div>
      </Row>
      <Row caption='点击计数'>
        <Button onClick={() => setCount(count() + 1)}>+1</Button>
        <StateText>当前: {count()}</StateText>
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
