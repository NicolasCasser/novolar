import { CheckCircle } from 'lucide-react';

import './SuccessMessage.css';

interface SuccessMessageProps {
  title: string;
  description: string;
}

export function SuccessMessage({ title, description }: SuccessMessageProps) {
  return (
    <section className="success-message">
      <span className="success-message-icon">
        <CheckCircle />
      </span>

      <h1>{title}</h1>

      <p>{description}</p>
    </section>
  );
}
