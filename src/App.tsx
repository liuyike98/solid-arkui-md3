import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import './assets/normalize.css';
import { Switch } from '@libs/components/Switch';

function App() {
  return (
    <Wrapper>
      <h2>Switch</h2>
      <Switch />
      <div>unchecked</div>
      <Switch checked={false}/>
      <div>checked</div>
      <Switch checked={true}/>
      <div>disabled</div>
      <Switch disabled={true}/>
      <Switch checked disabled={true}/>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 16px;
  overflow: auto;
`;
