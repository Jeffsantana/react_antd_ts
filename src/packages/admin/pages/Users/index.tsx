import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FiMoreHorizontal } from 'react-icons/fi';

import {
  Table,
  Menu,
  Dropdown,
  Select,
  Breadcrumb,
  Button,
  Tooltip,
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import defaultRoutes from '../../../../config/routes/defaultRoutes';
import api from '../../../../services/api';
import { useToast } from '../../../../hooks/toast';
import { usePokaYoke } from '../../../../hooks/pokayoke';

import { Container, Header, BoxAction } from './styles';
import useFetch from '../../../../hooks/useFetchMemo';

const { Option } = Select;

interface UserState {
  id: string;
  active?: boolean;
  name: string;
  email: string;
}

const Users: React.FC = () => {
  const { data, mutate } = useFetch<UserState[]>('/users');
  const [pageSize, setPageSize] = useState<number>(10);
  const { pokaYoke, closePokaYoke } = usePokaYoke();
  const { addToast } = useToast();

  const { push } = useHistory();

  const columns = [
    {
      title: 'Ativo',
      dataIndex: 'active',
      key: 'name',
      render: (active: any) => (
        <span>{!active ? <CloseOutlined /> : <CheckOutlined />}</span>
      ),
      width: '5%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Button size="small" type="link">
          {name}
        </Button>
      ),
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ação',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (id: string) => {
        const MenuOptions = (
          <Menu>
            <Menu.Item
              key="0"
              onClick={() => push(`${defaultRoutes.admin}/users/${id}`)}
            >
              <span>Editar</span>
            </Menu.Item>
            <Menu.Item danger key="1" onClick={() => preHandleDelete(id)}>
              <span>Apagar</span>
            </Menu.Item>
          </Menu>
        );
        return (
          <BoxAction style={{ position: 'relative' }}>
            <Dropdown overlay={MenuOptions} trigger={['hover']}>
              <FiMoreHorizontal
                onClick={e => {
                  e.preventDefault();
                }}
              />
            </Dropdown>
          </BoxAction>
        );
      },
    },
  ];

  const handleDeleteUser = useCallback(
    async (user_id: string) => {
      api.delete(`/users/${user_id}`);

      const usersUpdated = data?.filter(user => user.id !== user_id);

      mutate(usersUpdated, false);
      addToast({
        type: 'success',
        title: 'Usuário removido com sucesso',
      });
      closePokaYoke();
    },
    [addToast, closePokaYoke, data, mutate],
  );

  const preHandleDelete = useCallback(
    (delete_id: string) => {
      pokaYoke({
        title: 'Você tem certeza que deseja remover este usuário?',
        callback: () => handleDeleteUser(delete_id),
        confirmButtonText: 'Apagar',
      });
    },
    [pokaYoke, handleDeleteUser],
  );

  return (
    <Container>
      <Header>
        <Breadcrumb>
          <Breadcrumb.Item
            href=""
            onClick={() => push(`${defaultRoutes.admin}`)}
          >
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <UserOutlined />
            <span>Usuários</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Tooltip title="Adicionar um novo usuário" placement="left">
          <Button
            type="primary"
            onClick={() => push(`${defaultRoutes.admin}/users/new`)}
          >
            Adicionar
          </Button>
        </Tooltip>
      </Header>
      <Table
        dataSource={data}
        loading={!data}
        columns={columns}
        pagination={{
          showSizeChanger: false,
          pageSize,
          defaultCurrent: 1,
          total: data ? data.length : 0,
          showTotal: () => {
            return (
              <div className="page-size">
                Itens por pagina:
                <Select
                  defaultValue="10"
                  style={{ width: 120 }}
                  onChange={value => setPageSize(parseInt(value, 10))}
                >
                  <Option value="10">10</Option>
                  <Option value="20">20</Option>
                  <Option value="50">50</Option>
                  <Option value="100">100</Option>
                </Select>
              </div>
            );
          },
        }}
        onRow={(record: { id: string }) => {
          return {
            onDoubleClick: () => {
              if (record) {
                push(`${defaultRoutes.admin}/users/${record.id}`);
              }
            },
          };
        }}
      />
    </Container>
  );
};

export default Users;