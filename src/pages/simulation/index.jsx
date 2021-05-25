import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Card, Col, Input, Row } from 'antd';
import { Fragment, useState } from 'react';
import { addStyles } from "react-mathquill";
import { dotTypes, getCleanDots, getRoot, getZones, getCleanZones } from '../../utils';
import { FunctionPlot } from "../simulation/function-graph";
import MathJax from 'react-mathjax';

addStyles();

export const SimulationPage = () => {
  const [input, setInput] = useState('2x^2-4');
  const [show, setShow] = useState(true);
  // al obtener el input, se manda a calcular la funcion
  const roots = getRoot(input);
  // const derivative = derive(input);
  const zones = getZones(input);
  const dots = dotTypes(roots, zones);
  const cleanDots = getCleanDots(dots);
  const cleanZones = getCleanZones(zones);

  return (
    <div>
      <Input.Search
        placeholder="Ingrese una función"
        allowClear
        defaultValue="2x^2-4"
        enterButton="Calcular"
        prefix="f(x) = "
        size="large"
        onChange={() => setShow(false)}
        onSearch={(value) => {
          setInput(value);
          setShow(true);
        }}
      />
      {show && (
        <Fragment>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Sistema Dinámico - 1D" bordered={true} style={{ marginTop: 20 }}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={String('\\dot x=f(x)=').concat(input).concat(',x(0) = x_0')} />
                </MathJax.Provider>
              </Card>
            </Col>
            
            <Col span={6}>
              <Card title="Puntos de equilibrio" bordered={true} style={{ marginTop: 20 }}>
                {console.log('cleanDots')}
                {console.log(cleanDots)}
                {cleanDots.length > 0 && cleanDots.map(({ value, type, styles, icon, i }) => (
                  <MathJax.Provider>
                    <p>
                      <MathJax.Node inline formula={String('x_{').concat(i+1).concat('} : ').concat(parseFloat(value).toFixed(2))} /> <div className={styles}>{icon} {type}</div>
                    </p>
                  </MathJax.Provider>
                ))}
                {cleanDots.length == 0 && <p><i>Sin puntos de equilibrio</i></p>}
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Zonas" bordered={true} style={{ marginTop: 20 }}>
                <MathJax.Provider>
                  <ul className="data-zones">
                    {cleanZones.map(function(item) {
                      return <li>{item.direction === 'left' ? <CaretLeftOutlined style={{ color: '#f5222d'}} /> : <CaretRightOutlined style={{ color: '#52c41a'}} />} 
                              {<MathJax.Node inline formula={'('+item.valueFrom+' ; '+item.valueTo+')'} />}
                            </li>;
                    })}
                  </ul>
                </MathJax.Provider>
              </Card>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={24}>
              <FunctionPlot input={input} zones={cleanZones} dots={cleanDots} />  
            </Col>
          </Row>
        </Fragment>
      )}
    </div>
  );
};
