import { FileText, Heart, House, Clock } from 'lucide-react';
import './HowItWorksSection.css';

function HowItWorksSection() {
  return (
    <section className="how-it-works" id="como-funciona">
      <div className="how-it-works-header">
        <h2>Como funciona</h2>

        <p>O processo de adoção na NovoLar é simples e transparente.</p>
      </div>

      <div className="how-it-works-grid">
        <article className="how-it-works-card">
          <div className="how-it-works-icon">
            <Heart />
          </div>

          <h3>Encontre seu companheiro</h3>

          <p>
            Explore os animais disponíveis e encontre aquele que combina com
            você.
          </p>
        </article>

        <article className="how-it-works-card">
          <div className="how-it-works-icon">
            <FileText />
          </div>

          <h3>Conheça o animal</h3>

          <p>
            Conheça a história e as características do animal que chamou sua
            atenção.
          </p>
        </article>

        <article className="how-it-works-card">
          <div className="how-it-works-icon">
            <Clock />
          </div>

          <h3>Envie sua solicitação</h3>

          <p>
            Preencha o formulário de interesse para iniciar o processo de
            adoção.
          </p>
        </article>

        <article className="how-it-works-card">
          <div className="how-it-works-icon">
            <House />
          </div>

          <h3>Comece uma nova história</h3>

          <p>
            Aguarde o contato da equipe e dê um novo começo ao seu companheiro.
          </p>
        </article>
      </div>
    </section>
  );
}

export default HowItWorksSection;
