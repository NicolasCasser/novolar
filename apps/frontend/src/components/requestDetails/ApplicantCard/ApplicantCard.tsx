import { Mail, MapPin, Phone, User } from 'lucide-react';

import { states } from '../../../utils/locations';
import type { BrazilianState } from '../../../utils/locations';

import './ApplicantCard.css';

interface ApplicantCardProps {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: BrazilianState;
  message: string;
}

export function ApplicantCard({
  name,
  email,
  phone,
  city,
  state,
  message,
}: ApplicantCardProps) {
  const stateLabel =
    states.find((item) => item.value === state)?.label ?? state;

  return (
    <section className="applicant-card">
      <h2 className="applicant-card-title">
        <User />
        Informações do Interessado
      </h2>

      <div className="applicant-card-body">
        <ul className="applicant-card-fields">
          <li>
            <span className="applicant-card-label">NOME</span>

            <span className="applicant-card-value">{name}</span>
          </li>

          <li>
            <span className="applicant-card-label">CIDADE</span>

            <span className="applicant-card-value">{city}</span>
          </li>

          <li>
            <span className="applicant-card-label">E-MAIL</span>

            <span className="applicant-card-value applicant-card-value--with-icon">
              <Mail />
              {email}
            </span>
          </li>

          <li>
            <span className="applicant-card-label">ESTADO</span>

            <span className="applicant-card-value applicant-card-value--with-icon">
              <MapPin />
              {stateLabel}
            </span>
          </li>

          <li className="applicant-card-field--wide">
            <span className="applicant-card-label">TELEFONE</span>

            <span className="applicant-card-value applicant-card-value--with-icon">
              <Phone />
              {phone}
            </span>
          </li>
        </ul>

        <div className="applicant-card-divider" />

        <span className="applicant-card-label">MENSAGEM DE INTERESSE</span>

        <p className="applicant-card-message">{message}</p>
      </div>
    </section>
  );
}
