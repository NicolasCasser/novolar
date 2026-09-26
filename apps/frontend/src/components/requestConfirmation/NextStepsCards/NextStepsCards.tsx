import { Mail, PawPrint, ShieldCheck } from 'lucide-react';

import './NextStepsCards.css';

const cards = [
  {
    title: 'Confirmação por E-mail',
    description: 'Você receberá um e-mail com o resumo da sua solicitação.',
    icon: Mail,
  },
  {
    title: 'Processo de Análise',
    description: 'A equipe responsável analisará as informações enviadas.',
    icon: ShieldCheck,
  },
  {
    title: 'Preparação do Lar',
    description:
      'Enquanto aguarda, aproveite para organizar o ambiente e se preparar para receber seu novo companheiro.',
    icon: PawPrint,
  },
];

export function NextStepsCards() {
  return (
    <ul className="next-steps-cards">
      {cards.map(({ title, description, icon: Icon }) => (
        <li key={title} className="next-steps-card">
          <span className="next-steps-card-icon">
            <Icon />
          </span>

          <h2>{title}</h2>

          <p>{description}</p>
        </li>
      ))}
    </ul>
  );
}
