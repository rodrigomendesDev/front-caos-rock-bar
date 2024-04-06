import './styles.css';
import Logo from '../../assets/fav_icon_b.jpeg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getItem, setItem } from '../../utils/storage';
import api from '../../services/api';

function Login() {
  const navigate = useNavigate();

  const [nameUser, setNameUser] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    const token = getItem('token');

    if (token) {
      navigate('/main');
    }

  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!nameUser || !password) {
        return;
      }

      const response = await api.post('/login', {
        nome_usuario: nameUser,
        senha: password
      });

      const { usuario, token } = response.data;

      setItem('token', token);
      setItem('userId', usuario.id);
      setItem('userName', usuario.nome);

      navigate('/main');

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container-login-page'>
      <img src={Logo} alt='logo' className='logo' />

      <div className='container-login-user'>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className="container-inputs-login">
            <label htmlFor="user">Usuário: </label>
            <input
              type="text"
              name="user"
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
            />
          </div>
          <div className="container-inputs-login">
            <label htmlFor="password">Senha: </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-small btn-standard">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
