import './HeroSection.css';
import img from '../../../assets/Cat and dog-bro.svg';

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-content-inner">
          <span className="hero-badge">ADOTE, NÃO COMPRE</span>

          <h1>
            Encontre seu novo <span>melhor amigo.</span>
          </h1>

          <p>
            Adote um animal resgatado e mude duas vidas para sempre. Explore
            nosso diretório de companheiros e encontre o par perfeito para o seu
            lar.
          </p>

          <div className="hero-actions">
            <a className="btn-primary" href="#animals">
              Explorar Animais
            </a>
            <a className="btn-secondary" href="#como-funciona">
              Como Funciona
            </a>
          </div>
        </div>
      </div>

      <div className="hero-image-container">
        <div className="hero-image">
          <img src={img} alt="Animais disponíveis para adoção" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
