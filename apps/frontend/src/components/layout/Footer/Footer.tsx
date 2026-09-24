import logo from '../../../assets/logo.png';
import './Footer.css';
import githubIcon from '../../../assets/github-svgrepo-com.svg';
import { SquareArrowOutUpRight } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src={logo} alt="NovoLar" />

          <p>Uma plataforma de adoção responsável de animais resgatados.</p>
        </div>

        <div className="footer-links">
          <span>LINKS RÁPIDOS</span>

          <a href="#animals">Animais</a>
          <a href="#como-funciona">Como funciona</a>
          <a
            href="https://github.com/NicolasCasser/novolar"
            className="footer-external-link"
          >
            GitHub
            <SquareArrowOutUpRight className="external-link-icon" />
          </a>
        </div>

        <div className="footer-project">
          <span>PROJETO</span>

          <p>Este é um projeto de código aberto para ajudar na causa animal.</p>

          <a
            className="footer-github-button"
            href="https://github.com/NicolasCasser/novolar"
            target="_blank"
            rel="noreferrer"
          >
            <img className="icon" src={githubIcon} alt="" />
            ver projeto no GitHub
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 NovoLar. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}

export default Footer;
