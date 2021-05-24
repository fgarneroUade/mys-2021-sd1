import { useState } from 'react';
import { Layout } from 'antd';

import './App.css';

import { SimulationPage } from './pages/simulation';

const { Header, Content, Footer } = Layout;

const pages = [
  {
    id: 1,
    title: 'Simulación 1D',
    component: SimulationPage,
  }
]

const App = () => {
  const [selected] = useState(0);

  const Component = pages[selected].component;

  return (
    <Layout className="ms-layout">
      <Header style={{ width: '100%', background: '#2c2c2c' }}>
        <div className="logo">
          Sistemas Dinámicos 1D
        </div>
        <div className="logo logo-left">
          Modelado y Simulación - MaNo 1c 2021
        </div>
      </Header>
      <Content style={{ padding: '0 50px'}}>
        <div className="site-layout-background" style={{ marginTop: 20, padding: 24, minHeight: 380 }}>
          <Component />
        </div>
      </Content>
      <Footer style={{ width: '100%', background: '#2c2c2c' }}>
        Profesor: <b>Acero</b>, Fernando<br/>
        Alumnos:
        <ul>
          <li><b>Alles</b>, Francisco (LU 1044380)</li>
          <li><b>Garnero</b>, Federico (LU 1064523)</li>
        </ul>
      </Footer>
    </Layout>
  );
}

export default App;
