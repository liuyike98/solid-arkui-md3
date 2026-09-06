import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import './assets/normalize.css';

function App() {
  return <Wrapper></Wrapper>;
}

export default App;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;
