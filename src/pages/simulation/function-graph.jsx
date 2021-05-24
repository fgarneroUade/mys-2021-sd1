import React, { Fragment, useEffect, useRef } from 'react'
import { Card } from 'antd';
import functionPlot from 'function-plot'
import { derive, getTrayectorias } from '../../utils';

import './styles.scss';

export const FunctionPlot = ({ input, zones, dots }) => {
  const rootEl = useRef(null);
  const fasesEl = useRef(null);
  const xvstEl = useRef(null);

  const points = dots.map(({ value, color }) => {
    return {
      points: [
        [value, 0]
      ],
      fnType: 'points',
      graphType: 'scatter',
      color,
    };
  });

  const options = {
    grid: true,
    width: 1100,
    height: 600,
    data: [
      {
        fn: input,
        derivative: {
          fn: derive(input),
          updateOnMouseMove: true
        }
      }, ...points
    ]
  };
  // Array.prototype.push.apply(options.data, points);

  const arrows = zones.map(({ result, direction }) => {
    const vector = direction === 'left' ? -0.3 : 0.3;
    return {
      vector: [vector, 0],
      offset: [result, 0],
      graphType: 'polyline',
      fnType: 'vector'
    }
  })

  const fases = {
    width: 1100,
    height: 200,
    yAxis: {
      domain: [-1, 1],
    },
    xAxis: {
      label: 'X',
    },
    data: [...points, ...arrows],
  };

  const xvstDots = dots.map(({ value, color }) => {
    return {
      fn: `y = ${value}`,
      text: 'y = 1',
      color
    };
  });

  const trayectorias = getTrayectorias(zones);

  const xvst = {
    width: 1100,
    height: 500,
    zoom: true,
    xAxis: {
      label: 't'
    },
    yAxis: {
      label: 'x(t)'
    },
    annotations: dots.map(({ value, name, type }) => {
      return {
        y: value,
        text: `${name} = ${parseFloat(value).toFixed(2)} (${type})`,
        color: '#eeeeee'
      };
    }),
    data: [...xvstDots, ...trayectorias],
  };

  useEffect(() => {
    try {
      const a = functionPlot(Object.assign({}, options, { target: rootEl.current }));
      const b = functionPlot(Object.assign({}, fases, { target: fasesEl.current }));
      const c = functionPlot(Object.assign({}, xvst, { target: xvstEl.current }));
      a.addLink(b);
    } catch (e) {}
  }, [input])

  return (
    <Fragment>
      <Card title="Gráfico de la función" bordered={true} style={{ marginTop: 20 }}>
        <div ref={rootEl} />
      </Card>
      <Card title="Diagrama de fases" bordered={true} style={{ marginTop: 20 }}>
        <div className="fases" ref={fasesEl} />
      </Card>
      <Card title="Diagrama X vs. T" bordered={true} style={{ marginTop: 20 }}>
        <div className="xvst" ref={xvstEl} />
      </Card>
    </Fragment>
  )
};
