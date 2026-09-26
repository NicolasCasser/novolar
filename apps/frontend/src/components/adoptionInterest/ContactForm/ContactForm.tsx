import { Send } from 'lucide-react';

import { states } from '../../../utils/locations';
import type { BrazilianState } from '../../../utils/locations';

import './ContactForm.css';

interface ContactFormProps {
  loading: boolean;
  error: string;
  values: {
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    city: string;
    state: BrazilianState | '';
    message: string;
  };
  onChange: (field: keyof ContactFormProps['values'], value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ContactForm({
  loading,
  error,
  values,
  onChange,
  onSubmit,
}: ContactFormProps) {
  return (
    <section className="contact-form">
      <h2>Seus Dados de Contato</h2>

      <p className="contact-form-description">
        As informações abaixo serão utilizadas pela equipe responsável para
        entrar em contato com você.
      </p>

      <form onSubmit={onSubmit}>
        <div className="contact-form-row">
          <div className="contact-form-field">
            <label htmlFor="applicantName">Nome completo</label>

            <input
              id="applicantName"
              name="applicantName"
              type="text"
              placeholder="Digite seu nome"
              value={values.applicantName}
              onChange={(event) =>
                onChange('applicantName', event.target.value)
              }
              disabled={loading}
              required
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor="applicantEmail">E-mail</label>

            <input
              id="applicantEmail"
              name="applicantEmail"
              type="email"
              placeholder="Digite seu e-mail"
              value={values.applicantEmail}
              onChange={(event) =>
                onChange('applicantEmail', event.target.value)
              }
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="contact-form-row contact-form-row--three">
          <div className="contact-form-field">
            <label htmlFor="applicantPhone">Telefone / WhatsApp</label>

            <input
              id="applicantPhone"
              name="applicantPhone"
              type="tel"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              value={values.applicantPhone}
              onChange={(event) =>
                onChange('applicantPhone', event.target.value)
              }
              disabled={loading}
              required
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor="city">Cidade</label>

            <input
              id="city"
              name="city"
              type="text"
              placeholder="Sua cidade"
              value={values.city}
              onChange={(event) => onChange('city', event.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor="state">Estado</label>

            <select
              id="state"
              name="state"
              value={values.state}
              onChange={(event) => onChange('state', event.target.value)}
              disabled={loading}
              required
            >
              <option value="">UF</option>

              {states.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="contact-form-field">
          <label htmlFor="message">Mensagem</label>

          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Conte um pouco sobre você e sua experiência com animais..."
            value={values.message}
            onChange={(event) => onChange('message', event.target.value)}
            disabled={loading}
            required
          />
        </div>

        <p className="contact-form-consent">
          Ao enviar esta solicitação você confirma que as informações fornecidas
          são verdadeiras.
        </p>

        {error && <p className="contact-form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar solicitação de interesse'}

          {!loading && <Send className="contact-form-button-icon" />}
        </button>
      </form>
    </section>
  );
}
