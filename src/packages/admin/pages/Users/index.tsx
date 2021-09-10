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
  Input,
  Space
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
const { Search } = Input
interface UserState {
  _id: string;
  active?: boolean;
  name: string;
  email: string;
  phone_number?: string;
  createdAt?: string;
  updatedAp?: string;
  _v?: number;

}
interface UserDocs {
  docs?: UserState[],
  totalDocs?: number;
  offset?: string;
  limit?: string;
  totalPages?: number;
  page?: string;
  pagingCounter?: string;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: boolean;
  nextPage?: boolean;
}


const Users: React.FC = () => {
  const { data, mutate } = useFetch<UserDocs>('/user');
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
      dataIndex: '_id',
      key: '_id',
      width: '5%',
      render: (_id: string) => {
        const MenuOptions = (
          <Menu>
            <Menu.Item
              key="0"
              onClick={() => push(`${defaultRoutes.admin}/users/${_id}`)}
            >
              <span>Editar</span>
            </Menu.Item>
            <Menu.Item danger key="1" onClick={() => preHandleDelete(_id)}>
              <span>Apagar</span>
            </Menu.Item>
          </Menu>
        );
        return (
          <BoxAction style={{ position: 'static' }}>
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
      api.delete(`/user/${user_id}`);

      const usersUpdatedDocs: UserState[] = data?.docs?.filter(user => user._id !== user_id) ?? [];
      const mongooseElements = { ...data };
      mongooseElements.docs = usersUpdatedDocs;
      mongooseElements.totalDocs = mongooseElements.totalDocs ? mongooseElements.totalDocs - 1 : 0;
      const usersUpdated: UserDocs = { ...mongooseElements } ?? [];
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

  const onSearch = (search: any) => {
    console.log(search.length);


  }
  return (
    <Container>
      <Header>
        <Breadcrumb
          style={{ width: '14%', background: '' }}
        >
          <Breadcrumb.Item
            href=""
            onClick={() => push(`${defaultRoutes.admin}`)}
          >
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <span>Usuários</span>
            <span> </span>
            <UserOutlined />
          </Breadcrumb.Item>
        </Breadcrumb>
        <Search
          placeholder="Pesquisar"
          style={{ padding: '0 0 0 0', width: '56%' }}
          onSearch={onSearch}
          enterButton />

        <Tooltip title="Adicionar um novo usuário" placement="left">
          <Button
            type="primary"
            style={{ width: '14%', background: '#001529' }}
            onClick={() => push(`${defaultRoutes.admin}/users/new`)}
          >
            Adicionar
          </Button>
        </Tooltip>
      </Header>
      <Table
        dataSource={data?.docs}
        loading={!data}
        columns={columns}
        style={{ padding: '0 4% 0 4%' }}
        pagination={{
          // showSizeChanger: false,
          // pageSize,
          defaultCurrent: 1,
          total: data ? data.totalDocs : 0,
          defaultPageSize: 4,
          showTotal: (total: number) => { return `Total ${total} itens` },
          itemRender: (current, type, originalElement) => {

            return originalElement
          },

        }}
        onRow={(record: { _id: string }) => {
          return {
            onDoubleClick: () => {
              if (record) {
                push(`${defaultRoutes.admin}/users/${record._id}`);
              }
            },
          };
        }}
      />

    </Container>
  );
};

export default Users;
