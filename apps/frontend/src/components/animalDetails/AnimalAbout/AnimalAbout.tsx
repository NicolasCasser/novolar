import './AnimalAbout.css';

interface AnimalAboutProps {
  description: string;
}

export function AnimalAbout({ description }: AnimalAboutProps) {
  const paragraphs = description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="animal-about">
      <h2>Sobre o animal</h2>

      {paragraphs.length === 0 ? (
        <p>Não há informações sobre este animal.</p>
      ) : (
        paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
      )}
    </section>
  );
}
