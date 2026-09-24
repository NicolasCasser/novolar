import './Header.css';
import logo from '../../../assets/logo.png';

function Header() {
  return (
    <header>
      <a href="/" aria-label="NovoLar">
        <img src={logo} alt="NovoLar" />
      </a>

      <nav>
        <a href="/">Início</a>
        <a href="/#animals">Navegar</a>
      </nav>
    </header>
  );
}

export default Header;
