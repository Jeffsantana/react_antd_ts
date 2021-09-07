import React from 'react';
import { useHistory } from 'react-router-dom';
import { AiFillTool } from 'react-icons/ai';
import { GiGears } from 'react-icons/gi';

import { Container } from './styles';
import defaultRoutes from '../../../../config/routes/defaultRoutes';
import { useAuth } from '../../../../hooks/auth';

const baseURL = defaultRoutes;

const Home: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  return (
    <Container>
      <p>
        Seja bem-vindo,
        {user.name}
      </p>
      <div>
        <button
          type="button"
          onClick={() => history.push(`${baseURL.planning}`)}
        >
          <AiFillTool size={52} />
          <h4>MYFLEET PLAN</h4>
          <p>Engenharia, Planejamento, Controle e Produção</p>
        </button>
        <button type="button" onClick={() => history.push(`${baseURL.admin}`)}>
          <GiGears size={52} />
          <h4>MYFLETT ADMIN</h4>
          <p>Centro de Controle de Configurações</p>
        </button>
      </div>
    </Container>
  );
};

export default Home;
