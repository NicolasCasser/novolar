import { useState } from 'react';

import './AnimalGallery.css';

interface AnimalGalleryImage {
  id: string;
  url: string;
}

interface AnimalGalleryProps {
  images: AnimalGalleryImage[];
  alt: string;
}

export function AnimalGallery({ images, alt }: AnimalGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex];

  return (
    <figure className="animal-gallery">
      <div className="animal-gallery-main">
        {selectedImage ? (
          <img src={selectedImage.url} alt={alt} />
        ) : (
          <span className="animal-gallery-placeholder">
            Sem imagens disponíveis
          </span>
        )}
      </div>

      {images.length > 1 && (
        <ul className="animal-gallery-thumbnails">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                className={index === selectedIndex ? 'active' : ''}
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver imagem ${index + 1} de ${images.length}`}
                aria-current={index === selectedIndex}
              >
                <img src={image.url} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
