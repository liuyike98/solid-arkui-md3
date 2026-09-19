import { Button } from '@libs/components/Button';
import { Toaster, createToaster } from '@libs/components/Toast';
import { css } from 'solid-styled-components';
import { DemoList, Row } from './DemoList';
import type { Demo } from './types';

export const toastDemo: Demo = {
  name: 'Toast',
  desc: 'MD3 消息条 (snackbar), 深灰底白字, 四种类型带彩色图标, 支持操作按钮与自定义时长, 右下角堆叠弹出。',
  render: () => <ToastDemo />,
};

function ToastDemo() {
  const toaster = createToaster({ placement: 'bottom-end', gap: 12 });

  return (
    <DemoList>
      <Row caption='四种类型'>
        <div class={groupClassName}>
          <Button
            variant='tonal'
            onClick={() => toaster.create({ title: '操作成功', description: '文件已保存', type: 'success' })}
          >
            success
          </Button>
          <Button variant='tonal' onClick={() => toaster.create({ title: '操作失败', description: '请检查网络', type: 'error' })}>
            error
          </Button>
          <Button variant='tonal' onClick={() => toaster.create({ title: '存储空间不足', type: 'warning' })}>
            warning
          </Button>
          <Button variant='tonal' onClick={() => toaster.create({ title: '新版本可用', type: 'info' })}>
            info
          </Button>
        </div>
      </Row>
      <Row caption='带操作按钮'>
        <Button
          variant='outlined'
          onClick={() =>
            toaster.create({
              title: '已删除 3 条记录',
              type: 'info',
              action: { label: '撤销', onClick: () => toaster.create({ title: '已撤销', type: 'success' }) },
            })
          }
        >
          删除并撤销
        </Button>
      </Row>
      <Row caption='自定义时长'>
        <Button variant='outlined' onClick={() => toaster.create({ title: '这条提示 10 秒后才消失', duration: 10000 })}>
          duration 10s
        </Button>
      </Row>
      <Toaster toaster={toaster} />
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
