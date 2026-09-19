import { Button } from '@libs/components/Button';
import { Dialog, DialogActions, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@libs/components/Dialog';
import { createSignal } from 'solid-js';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const dialogDemo: Demo = {
  name: 'Dialog',
  desc: 'MD3 对话框, 28dp 圆角面板 + 半透明遮罩, 组合式 Title / Description / Actions, 支持受控开关。',
  render: () => <DialogDemo />,
};

function DialogDemo() {
  const [open, setOpen] = createSignal(false);

  return (
    <DemoList>
      <Row caption='基础'>
        <Dialog>
          <DialogTrigger>
            <Button variant='outlined'>打开对话框</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>订阅更新</DialogTitle>
            <DialogDescription>我们会通过邮件推送产品更新, 你可以随时取消订阅。</DialogDescription>
            <DialogActions>
              <Button variant='text'>取消</Button>
              <Button>订阅</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Row>
      <Row caption='受控开关'>
        <Dialog open={open()} onOpenChange={(details) => setOpen(details.open)}>
          <DialogTrigger>
            <Button variant='outlined'>打开</Button>
          </DialogTrigger>
          <DialogContent closeIcon={null}>
            <DialogTitle>受控模式</DialogTitle>
            <DialogDescription>开关状态由外部 signal 管理, 只能通过按钮关闭。</DialogDescription>
            <DialogActions>
              <Button variant='text' onClick={() => setOpen(false)}>
                我知道了
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <StateText>open: {String(open())}</StateText>
      </Row>
    </DemoList>
  );
}
