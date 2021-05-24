import { Table } from 'antd';
import { CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';

export const ZonesTable = ({ zones, roots }) => {
  const dataSource = zones.map((zone, key) => ({ key: key.toString(), ...zone }));
  
  const columns = [
    {
      title: 'Desde',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'Hasta',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Dirección',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction) => {
        return direction === 'left' ? <CaretLeftOutlined style={{ color: '#f5222d'}} /> : <CaretRightOutlined style={{ color: '#52c41a'}} />
      }
    },
  ];

  return (
    <Table dataSource={dataSource} columns={columns} />
  );
};
