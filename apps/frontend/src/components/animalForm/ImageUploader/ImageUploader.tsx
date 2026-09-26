import { Plus, Upload, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import './ImageUploader.css';

const MAX_IMAGES = 5;

const PREVIEW_SLOTS = 4;

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageUploaderProps {
  files: File[];
  disabled?: boolean;
  onChange: (files: File[]) => void;
}

export function ImageUploader({
  files,
  disabled = false,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  // As previews usam object URLs temporarias: cada lote e revogado assim que
  // a lista muda ou o componente e desmontado.

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // A referencia exibe quatro posicoes de preview ao lado da area de envio;
  // as fotos selecionadas ocupam essas posicoes da esquerda para a direita.

  const emptySlots = Math.max(PREVIEW_SLOTS - files.length, 0);

  function addFiles(incoming: File[]) {
    setError('');

    if (incoming.length === 0) {
      return;
    }

    const unsupported = incoming.find(
      (file) => !ACCEPTED_TYPES.includes(file.type),
    );

    if (unsupported) {
      setError('Formatos suportados: JPG, PNG e WEBP.');

      return;
    }

    if (files.length + incoming.length > MAX_IMAGES) {
      setError(`Você pode enviar até ${MAX_IMAGES} fotos.`);

      return;
    }

    onChange([...files, ...incoming]);
  }

  function removeFile(index: number) {
    setError('');

    onChange(files.filter((_, current) => current !== index));
  }

  function openPicker() {
    if (disabled || files.length >= MAX_IMAGES) {
      return;
    }

    inputRef.current?.click();
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));

    // Permite selecionar o mesmo arquivo novamente depois de remover.

    event.target.value = '';
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    setDragging(false);

    if (disabled) {
      return;
    }

    addFiles(Array.from(event.dataTransfer.files));
  }

  const canAdd = !disabled && files.length < MAX_IMAGES;

  return (
    <>
      <div className="image-uploader">
        <div
          className={`image-uploader-dropzone ${dragging ? 'dragging' : ''} ${
            disabled ? 'disabled' : ''
          }`}
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();

              openPicker();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();

            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Upload />

          <strong>Clique para enviar</strong>

          <span>ou arraste e solte</span>
        </div>

        {files.map((file, index) => (
          <div className="image-uploader-item" key={previews[index]}>
            <img src={previews[index]} alt={file.name} />

            <button
              type="button"
              onClick={() => removeFile(index)}
              disabled={disabled}
              aria-label={`Remover ${file.name}`}
            >
              <X />
            </button>
          </div>
        ))}

        {Array.from({ length: emptySlots }).map((_, index) => (
          <button
            type="button"
            className="image-uploader-slot"
            key={index}
            onClick={openPicker}
            disabled={!canAdd}
            aria-label="Adicionar foto"
          >
            <Plus />
          </button>
        ))}
      </div>

      <input
        ref={inputRef}
        className="image-uploader-input"
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleInputChange}
      />

      {error && <p className="image-uploader-error">{error}</p>}
    </>
  );
}
