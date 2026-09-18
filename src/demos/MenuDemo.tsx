import { Menu, MenuItem } from '@libs/components/Menu';
import { Row } from './DemoList';

export const menuDemo = {
  name: 'Menu',
  desc: '菜单组件',
  render: () => <MenuDemo />,
};

function MenuDemo() {
  return (
    <div>
      <Row caption='右键菜单'>
        <Menu>
          <MenuItem value=''/>
          <MenuItem value=''/>
        </Menu>
      </Row>
    </div>
  );
}
