import { derivative, compile, evaluate } from 'mathjs'
import nerdamer from'nerdamer/nerdamer.core.js'
import 'nerdamer/Algebra.js'
import 'nerdamer/Calculus.js'
import 'nerdamer/Solve.js'

import { DoubleLeftOutlined, DoubleRightOutlined, ShrinkOutlined, ArrowsAltOutlined } from '@ant-design/icons';

export const derive = (input) => {
  try {
    return derivative(input, 'x').toString();
  } catch (error) {
    return input;
  }
}

export const getRoot = (input) => {
  try {
    const solutions = nerdamer.solveEquations(input, 'x');
    solutions.sort(sortSolutions);
    return solutions.map(item => item.text());
  } catch (error) {
    console.log(error)
    return [];
  }
}

export const toEquation = (input) => {
  try {
    const cleaned = input.replace(/\*/, '\\cdot').replace(/sqrt/, '\\sqrt');
    return cleaned;
  } catch (error) {
    console.log(error)
    return input;
  }
}

const buildZone = (func, input, left, right) => {
  const result = compile(input).evaluate();
  const value = func.evaluate({x: result});

  return {
    from: left == null ? '-∞' : left.text(),
    to: right == null ? '+∞' : right.text(),
    direction: (result.type === 'Complex' && result.re >= 0 || value >= 0) ? 'right' : 'left',
    value,
    result,
    first: left == null,
    last: right == null,
    valueFrom: left == null ? '-∞' : parseFloat(evaluate(left.text())).toFixed(2),
    valueTo: right == null ? '+∞' : parseFloat(evaluate(right.text())).toFixed(2),
    imaginaryFrom: left != null && String(left.text()).includes('i'),
    imaginaryTo: right != null && String(right.text()).includes('i'),
    realFromImaginaryResult: result.type === 'Complex' ? result.re : undefined
  };
}

const sortSolutions = (a, b) => {
  if (a.lt(b)) {
    return -1;
  }
  if (a.gt(b)) {
    return 1;
  }
  return 0;
}

// Zonas
export const getZones = (input) => {
  try {
    const solutions = nerdamer.solveEquations(input, 'x').reverse();
    solutions.sort(sortSolutions);
    const func = compile(input);
    const zones = [];
    if (solutions.length > 0) {
      const [firstRoot] = solutions;
      zones.push(buildZone(func, `${firstRoot}-1`, null, firstRoot));

      console.log(zones);

      for (let index = 0; index < solutions.length; index++) {
        const left = solutions[index];
        const right = solutions[index+1];

        if (right == null) {
          zones.push(buildZone(func, `${left} + 1`, left));
        } else {
          zones.push(buildZone(func, `(${left} + ${right}) / 2`, left, right));
        }
        console.log(zones);
      };
    }

    return zones;
  } catch (error) {
    console.log(error)
    return [];
  }
}

export const getCleanZones = (zones) => {
  var cleaned = [];
  var up;
  var data;
  var next = false;

  zones.forEach(zone => {
    if (next) {
      if (!zone.imaginaryTo) {
        // vengo de un nodo abierto y mi sig no es imaginario
        data.direction = zone.direction;
        data.valueTo = zone.valueTo;
        data.to = zone.to;
        cleaned.push(data);
        data = undefined;
        next = false;
      }
    } else {
      data = zone;
      if (zone.imaginaryTo) {
        next = true;
      } else {
        cleaned.push(data);
        data = undefined;
      }
    }
    
    // datos del final
    if (data != undefined && zone.valueTo === '+∞') {
      if (next) {
        data.valueTo = '+∞';
        next = false;
        cleaned.push(data);
      }
    }
  });
  console.log('Clean Zones');
  console.log(cleaned);
  return cleaned;
}

// Puntos de equilibrio
export const dotTypes = (roots, zones) => {
  try {
    return roots.map((root, index) => {

      const left = zones[index].direction;
      const right = zones[index+1].direction;
      
      if (!zones[index].imaginaryTo) {
        if (left === right) {
          console.log('Generar Inestable---------------');
          return {
            value: zones[index].valueTo,
            type: 'Inestable',
            icon: left === 'left' ? <DoubleLeftOutlined /> : <DoubleRightOutlined />,
            color: 'warning',
            name: `X${index+1}*`,
            styles: 'badge badge-inestable',
            i: index
          }
        } else if (left === 'left') {
          console.log('Generar Repulsor---------------');
          return {
            value: zones[index].valueTo,
            type: 'Repulsor',
            icon: <ArrowsAltOutlined />,
            color: '#f5222d',
            name: `X${index+1}*`,
            styles: 'badge badge-repulsor',
            i: index
          }
        } else {
          console.log('Generar Atractor---------------');
          return {
            value: zones[index].valueTo,
            type: 'Atractor',
            icon: <ShrinkOutlined />,
            color: '#52c41a',
            name: `X${index+1}*`,
            styles: 'badge badge-atractor',
            i: index
          }
        }
      }
    })
  } catch (error) {
    return [];
  }
}

export const getCleanDots = (dots) => {
  var cleanDots = [];
  dots.forEach(dot => {
    if (dot !== undefined) {
      cleanDots.push(dot);
    }
  });
  return cleanDots;
}

// Diagrama X vs T
export const getTrayectorias = (zones) => {
  const data = [];

  zones.forEach(({ first, last, direction, valueFrom, valueTo, realFromImaginaryResult }) => {
    if (first) {
      if (direction === 'left') {
        // seccion de abajo - Hacia abajo
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueTo)-0.5).concat('-exp(x)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-4,4]
        });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueTo)-0.5).concat('-exp(x-4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [0,8]
        });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueTo)-0.5).concat('-exp(x+4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-8,0]
        });
      } else {
        // seccion de abajo - Hacia arriba
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueTo)-3).concat('+sqrt(x)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-4,4]
        });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueTo)-3).concat('+sqrt(x-4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [0,8]
        });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueTo)-3).concat('+sqrt(x+4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-8,0]
        });
      }
    } else if (last) {
      if (direction === 'left') {
        // seccion de arriba - Hacia abajo
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueFrom)+3).concat('-sqrt(x)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-4,4]
        });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueFrom)+3).concat('-sqrt(x-4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [0,8]
        });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueFrom)+3).concat('-sqrt(x+4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-8,0]
        });
      } else {
        // seccion de arriba - Hacia arriba
        data.push({
            fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueFrom)+0.5).concat('+exp(x)'),
            graphType: 'polyline',
            color: '#1890ff',
            range: [-4,4]
          });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueFrom)+0.5).concat('+exp(x-4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [0,8]
        });
        data.push({
          fn: String(Number(realFromImaginaryResult ? realFromImaginaryResult : valueFrom)+0.5).concat('+exp(x+4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-8,0]
        });
      }
    } else {
      var between = Math.abs((Number(valueFrom)-Number(valueTo)));
      var middlePont = (Number(valueFrom)+Number(valueTo))/2;
      if (direction === 'left') {
        // intermedia - Hacia abajo
        data.push({
          fn: String(middlePont).concat('-').concat('1/'+(between<=1?5:(between<=1.5?3:(between<=2.5?2.5:(between<=3?2:1))))).concat('cbrt(x)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-4,4]
        })
        data.push({
          fn: String(middlePont).concat('-').concat('1/'+(between<=1?5:(between<=1.5?3:(between<=2.5?2.5:(between<=3?2:1))))).concat('cbrt(x-4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [0,8]
        })
        data.push({
          fn: String(middlePont).concat('-').concat('1/'+(between<=1?5:(between<=1.5?3:(between<=2.5?2.5:(between<=3?2:1))))).concat('cbrt(x+4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-8,0]
        })
      } else {
        // intermedia - Hacia abajo
        data.push({
          fn: String(middlePont).concat('+').concat('1/'+(between<=1?5:(between<=1.5?3:(between<=2.5?2.5:(between<=3?2:1))))).concat('cbrt(x)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-4,4]
        });
        data.push({
          fn: String(middlePont).concat('+').concat('1/'+(between<=1?5:(between<=1.5?3:(between<=2.5?2.5:(between<=3?2:1))))).concat('cbrt(x-4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [0,8]
        });
        data.push({
          fn: String(middlePont).concat('+').concat('1/'+(between<=1?5:(between<=1.5?3:(between<=2.5?2.5:(between<=3?2:1))))).concat('cbrt(x+4)'),
          graphType: 'polyline',
          color: '#1890ff',
          range: [-8,0]
        });
      }
    }
  })
  return data;
}