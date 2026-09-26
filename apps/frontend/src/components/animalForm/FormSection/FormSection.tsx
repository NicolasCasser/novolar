import type { ReactNode } from 'react';

import './FormSection.css';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="form-section">
      <div className="form-section-header">
        <h2>{title}</h2>

        {description && <p>{description}</p>}
      </div>

      <div className="form-section-body">{children}</div>
    </section>
  );
}
