import './OpenSourceSection.css';
import githubIcon from '../../../assets/github-svgrepo-com.svg';

function OpenSourceSection() {
  return (
    <section className="open-source">
      <div className="open-source-content">
        <p>
          ⓘ O NovoLar é uma plataforma de código aberto criada para facilitar a
          adoção responsável de animais resgatados.
        </p>

        <a
          href="https://github.com/NicolasCasser/novolar"
          target="_blank"
          rel="noreferrer"
        >
          <img src={githubIcon} alt="" />
          Siga-nos no GitHub
        </a>
      </div>
    </section>
  );
}

export default OpenSourceSection;
