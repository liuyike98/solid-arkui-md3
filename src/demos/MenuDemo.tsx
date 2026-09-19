import { Button } from '@libs/components/Button';
import { Icon } from '@libs/components/Icon';
import { Menu, MenuContent, MenuContextTrigger, MenuGroup, MenuGroupLabel, MenuItem, MenuItemTrigger, MenuSeparator, MenuTrigger } from '@libs/components/Menu';
import { createSignal, For } from 'solid-js';
import { css } from 'solid-styled-components';
import { DemoList, Row, StateText } from './DemoList';
import type { Demo } from './types';

export const menuDemo: Demo = {
  name: 'Menu',
  desc: 'MD3 菜单, surface-container 容器 + 全宽高亮项, 支持图标 / 分组 / 分隔线 / 二级子菜单 / 右键菜单。',
  render: () => <MenuDemo />,
};

const fileItems = [
  { value: 'new', label: '新建', icon: 'add' },
  { value: 'open', label: '打开...', icon: 'folder_open' },
  { value: 'save', label: '保存', icon: 'save' },
] as const;

function MenuDemo() {
  const [selected, setSelected] = createSignal('');

  return (
    <DemoList>
      <Row caption='基础'>
        <Menu open onSelect={(details) => setSelected(details.value)}>
          <MenuTrigger>
            <Button variant='outlined'>
              File
              <Icon name='expand_more' size={20} />
            </Button>
          </MenuTrigger>
          <MenuContent>
            <For each={fileItems}>{(item) => <MenuItem value={item.value} icon={item.icon}>{item.label}</MenuItem>}</For>
            <MenuSeparator />
            <MenuItem value='exit' icon='logout'>
              退出
            </MenuItem>
          </MenuContent>
        </Menu>
        <StateText>最近选择: {selected() || '-'}</StateText>
      </Row>
      <Row caption='分组与禁用'>
        <Menu>
          <MenuTrigger>
            <Button variant='tonal'>分组菜单</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuGroup>
              <MenuGroupLabel>编辑</MenuGroupLabel>
              <MenuItem value='copy' icon='content_copy'>
                复制
              </MenuItem>
              <MenuItem value='paste' icon='content_paste'>
                粘贴
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>高级</MenuGroupLabel>
              <MenuItem value='cut' icon='content_cut' disabled>
                剪切 (禁用)
              </MenuItem>
            </MenuGroup>
          </MenuContent>
        </Menu>
      </Row>
      <Row caption='二级菜单'>
        <Menu>
          <MenuTrigger>
            <Button variant='outlined'>导出文件</Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value='doc' icon='description'>
              文档
            </MenuItem>
            <Menu >
              <MenuItemTrigger>图片</MenuItemTrigger>
              <MenuContent>
                <MenuItem value='png' icon='image'>
                  PNG
                </MenuItem>
                <MenuItem value='jpg' icon='image'>
                  JPG
                </MenuItem>
                <Menu >
                  <MenuItemTrigger>压缩包</MenuItemTrigger>
                  <MenuContent>
                    <MenuItem value='zip' icon='folder_zip'>
                      ZIP
                    </MenuItem>
                    <MenuItem value='tar' icon='folder_zip'>
                      TAR
                    </MenuItem>
                  </MenuContent>
                </Menu>
              </MenuContent>
            </Menu>
            <MenuSeparator />
            <MenuItem value='print' icon='print'>
              打印
            </MenuItem>
          </MenuContent>
        </Menu>
      </Row>
      <Row caption='右键菜单'>
        <Menu>
          <MenuContextTrigger>
            <div class={contextBoxClassName}>在此区域点击右键</div>
          </MenuContextTrigger>
          <MenuContent>
            <MenuItem value='refresh' icon='refresh'>
              刷新
            </MenuItem>
            <MenuItem value='inspect' icon='build'>
              检查
            </MenuItem>
          </MenuContent>
        </Menu>
      </Row>
    </DemoList>
  );
}

const contextBoxClassName = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  height: 96px;
  border: 1px dashed var(--mdui-color-outline);
  border-radius: 8px;
  color: var(--mdui-color-on-surface-variant);
  font-size: 14px;
  user-select: none;
`;
