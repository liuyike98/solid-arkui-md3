import { Button } from '@libs/components/Button';
import { Loading, showLoadingModal } from '@libs/components/Loading';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const loadingDemo: Demo = {
  name: 'Loading',
  desc: 'MD3 圆形加载, 7 帧形变 + 旋转动画 (支持 d: path() 用 CSS 关键帧, 旧浏览器回退 SMIL), 两种形态, 另含全屏遮罩弹层。',
  render: () => <LoadingDemo />,
};

function LoadingDemo() {
  return (
    <DemoList>
      <Row caption='默认'>
        <div class={groupClassName}>
          <Loading />
          <Loading variant='contained' />
        </div>
      </Row>
      <Row caption='尺寸'>
        <div class={groupClassName}>
          <Loading class={smallClassName} />
          <Loading class={largeClassName} />
        </div>
      </Row>
      <Row caption='全屏弹层'>
        <Button
          variant='filled'
          onClick={() => {
            const close = showLoadingModal();
            setTimeout(close, 3000);
          }}
        >
          3 秒后自动关闭
        </Button>
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
  gap: 16px;
`;

const smallClassName = css`
  width: 24px;
`;

const largeClassName = css`
  width: 64px;
`;
