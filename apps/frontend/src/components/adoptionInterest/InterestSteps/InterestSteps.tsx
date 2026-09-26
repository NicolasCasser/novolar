import './InterestSteps.css';

const steps = ['Enviar solicitação', 'Análise', 'Contato'];

export function InterestSteps() {
  return (
    <section className="interest-steps">
      <h2>Próximos passos:</h2>

      <ol className="interest-steps-list">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`interest-step ${index === 0 ? 'active' : ''}`}
          >
            <span className="interest-step-marker">{index + 1}</span>

            <span className="interest-step-label">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
