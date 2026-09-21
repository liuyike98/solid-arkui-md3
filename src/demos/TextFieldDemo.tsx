import { Icon } from '@libs/components/Icon';
import { IconButton } from '@libs/components/IconButton';
import { TextArea, TextField } from '@libs/components/TextField';
import { createSignal } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const textFieldDemo: Demo = {
  name: 'TextField',
  desc: 'MD3 轮廓文本框, 标签浮动切角、辅助/错误文案、前后缀图标、禁用与必填; TextArea 为多行版本。',
  render: () => <TextFieldDemo />,
};

function TextFieldDemo() {
  const [email, setEmail] = createSignal('');
  const [bio, setBio] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);

  return (
    <DemoList>
      <Row caption='基础'>
        <div class={colClassName}>
          <TextField label='用户名' helper='展示在个人主页的名称' />
          <TextField label='邮箱'  value={email()} onInput={(e) => setEmail(e.currentTarget.value)} invalid={email() !== '' && !email().includes('@')} error={email() !== '' && !email().includes('@') ? '邮箱格式不正确' : undefined} />
        </div>
      </Row>
      <Row caption='带图标'>
        <div class={colClassName}>
          <TextField label='搜索' iconStart={<Icon name='search' size={20}/>} />
          <TextField
            label='密码'
            defaultValue='123456'
            type={showPassword() ? 'text' : 'password'}
            iconStart={<Icon name='lock' size={20}/>}
            iconEnd={
              <IconButton
                size={32}
                name={showPassword() ? 'visibility_off' : 'visibility'}
                aria-label={showPassword() ? '隐藏密码' : '显示密码'}
                onClick={() => setShowPassword((v) => !v)}
              />
            }
          />
        </div>
      </Row>
      <Row caption='必填与禁用'>
        <div class={colClassName}>
          <TextField label='昵称' required />
          <TextField label='不可编辑' disabled value='固定内容' />
        </div>
      </Row>
      <Row caption='多行文本'>
        <div class={colClassName}>
          <TextArea label='简介' helper={`${bio().length} / 200`} value={bio()} onInput={(e) => setBio(e.currentTarget.value)} />
          <TextArea label='错误示例' error='该内容包含敏感词' value='一些被拒绝的输入' />
        </div>
      </Row>
      <Row caption='受控回显'>
        <TextField label='备注' value={email()} onInput={(e) => setEmail(e.currentTarget.value)} />
        <StateText>{email() || '-'}</StateText>
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
