import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Login.css';

import petAdoptionImage from '../../assets/animals floating with balloons-rafiki.svg';
import logo from '../../assets/logo.png';
import logo2 from '../../assets/logo-2.png';

type LoginData = {
  login: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

type LoginVariables = {
  input: {
    email: string;
    password: string;
  };
};

const LOGIN: TypedDocumentNode<LoginData, LoginVariables> = gql`
  mutation Login($input: AuthInputDTO!) {
    login(input: $input) {
      user {
        id
        name
        email
      }
    }
  }
`;

function Login() {
  const navigate = useNavigate();

  const [login, { loading }] = useMutation(LOGIN);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: {
          input: {
            email,
            password,
          },
        },
      });

      console.log('Login realizado:', data);

      if (data?.login?.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);

      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, 4000);
    }
  }

  return (
    <main className="login-page">
      {showError && (
        <div className="login-toast">
          <span className="login-toast__icon">!</span>

          <span className="login-toast__message">
            E-mail ou senha inválidos.
          </span>
        </div>
      )}

      <section className="login-branding">
        <div className="login-brand">
          <img src={logo} alt="Logo NovoLar" className="login-brand__logo" />
        </div>

        <img
          src={petAdoptionImage}
          alt="Cachorro e gato"
          className="login-branding__image"
        />

        <div className="login-branding__text">
          <h1>Compromisso com o Bem-Estar</h1>

          <p>
            Nossa plataforma administrativa garante que cada animal receba a
            atenção e o cuidado necessários para encontrar seu lar definitivo.
          </p>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-container">
          <div className="login-form-header">
            <div className="login-form-header__title">
              <img
                src={logo2}
                alt="NovoLar"
                className="login-form-header__logo"
              />

              <h2>Acesso administrativo</h2>
            </div>

            <p>Entre para gerenciar os animais e solicitações de adoção.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">E-mail</label>

              <Mail className="login-input-icon" />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Senha</label>

              <Lock className="login-input-icon" />

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                disabled={loading}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}

              {!loading && <ArrowRight className="login-button__icon" />}
            </button>
          </form>

          <p className="login-footer">
            © 2026 NovoLar Administrativo — Sistema de Gestão de Animais
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
