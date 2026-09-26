import { gql } from '@apollo/client';
import type { TypedDocumentNode } from '@apollo/client';
import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './AnimalForm.css';

import { AdminLayout } from '../../components/dashboard/AdminLayout/AdminLayout';
import { FormCheckbox } from '../../components/animalForm/FormCheckbox/FormCheckbox';
import { FormSection } from '../../components/animalForm/FormSection/FormSection';
import { ImageUploader } from '../../components/animalForm/ImageUploader/ImageUploader';
import { sexLabels, sizeLabels, speciesLabels } from '../../utils/animals';
import type { AnimalSex, AnimalSize, AnimalSpecies } from '../../utils/animals';
import { states } from '../../utils/locations';
import type { BrazilianState } from '../../utils/locations';

type CitiesData = {
  cities: string[];
};

type CitiesVariables = {
  state: BrazilianState;
};

type CreateAnimalData = {
  createAnimal: {
    id: string;
  };
};

type CreateAnimalInput = {
  name: string;
  description: string;
  species: AnimalSpecies;
  breed: string;
  sex: AnimalSex;
  size: AnimalSize;
  color: string;
  state: BrazilianState;
  city: string;
  ageInMonths: number;
  vaccinated: boolean;
  neutered: boolean;
  images: { fileId: string }[];
};

const CITIES: TypedDocumentNode<CitiesData, CitiesVariables> = gql`
  query AnimalFormCities($state: BrazilianState!) {
    cities(state: $state)
  }
`;

const CREATE_ANIMAL: TypedDocumentNode<
  CreateAnimalData,
  { input: CreateAnimalInput }
> = gql`
  mutation AnimalFormCreateAnimal($input: CreateAnimalInputDTO!) {
    createAnimal(input: $input) {
      id
    }
  }
`;

const API_URL = import.meta.env.VITE_API_URL.replace('/graphql', '');

const SESSION_EXPIRED = 'SESSION_EXPIRED';

// O upload de imagens acontece no FilesController (POST /files) e devolve o id
// do arquivo, que e o valor esperado pela mutation createAnimal.

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();

  body.append('file', file);

  const response = await fetch(`${API_URL}/files`, {
    method: 'POST',
    body,
    credentials: 'include',
  });

  if (response.status === 401) {
    throw new Error(SESSION_EXPIRED);
  }

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const uploaded = (await response.json()) as { id: string };

  return uploaded.id;
}

const initialValues = {
  name: '',
  species: '' as AnimalSpecies | '',
  breed: '',
  sex: '' as AnimalSex | '',
  size: '' as AnimalSize | '',
  age: '',
  ageInMonths: false,
  vaccinated: false,
  neutered: false,
  state: '' as BrazilianState | '',
  city: '',
  description: '',
};

function AnimalForm() {
  const navigate = useNavigate();
  const client = useApolloClient();

  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const { data: citiesData } = useQuery(CITIES, {
    variables: { state: values.state as BrazilianState },
    skip: !values.state,
  });

  const [createAnimal, { loading: saving }] = useMutation(CREATE_ANIMAL);

  function handleChange(field: keyof typeof initialValues, value: string) {
    setValues((current) => {
      const next = { ...current, [field]: value };

      if (field === 'state') {
        next.city = '';
      }

      return next;
    });
  }

  function handleToggle(field: 'vaccinated' | 'neutered', value: boolean) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleCancel() {
    navigate('/dashboard/animais');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (files.length === 0) {
      setError('Adicione ao menos uma foto do animal.');

      return;
    }

    const age = Number(values.age);

    if (!Number.isFinite(age) || age < 0) {
      setError('Informe uma idade válida.');

      return;
    }

    try {
      const fileIds = await Promise.all(files.map(uploadImage));

      await createAnimal({
        variables: {
          input: {
            name: values.name.trim(),
            description: values.description.trim(),
            species: values.species as AnimalSpecies,
            breed: values.breed.trim(),
            sex: values.sex as AnimalSex,
            size: values.size as AnimalSize,
            // A referencia visual nao possui o campo "cor", que porem e
            // obrigatorio na API e nunca e exibido no frontend.
            color: 'Não informado',
            state: values.state as BrazilianState,
            city: values.city.trim(),
            ageInMonths: values.ageInMonths ? age : age * 12,
            vaccinated: values.vaccinated,
            neutered: values.neutered,
            images: fileIds.map((fileId) => ({ fileId })),
          },
        },
      });

      // A listagem so e montada depois do navigate, entao invalidamos o cache
      // para o animal recem-criado ja aparecer na tabela e nos contadores.

      client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'animals' });

      navigate('/dashboard/animais');
    } catch (submitError) {
      const sessionExpired =
        submitError instanceof Error && submitError.message === SESSION_EXPIRED;

      if (sessionExpired) {
        setError('Sua sessao expirou. Entre novamente para salvar o animal.');

        return;
      }

      setError('Não foi possível salvar o animal. Tente novamente.');
    }
  }

  return (
    <AdminLayout title="Novo Animal">
      <div className="animal-form">
        <Link className="animal-form-back" to="/dashboard/animais">
          <ArrowLeft />
          Voltar
        </Link>

        <div className="animal-form-header">
          <h1>Novo animal</h1>

          <p>Preencha as informações do animal.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="animal-form-sections">
            <FormSection
              title="Imagens"
              description="Faça o upload de até 5 fotos do animal. Formatos suportados: JPG, PNG, WEBP."
            >
              <ImageUploader
                files={files}
                disabled={saving}
                onChange={setFiles}
              />
            </FormSection>

            <FormSection title="Informações básicas">
              <div className="animal-form-grid">
                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="name">
                    Nome <span>*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ex: Thor, Amora..."
                    value={values.name}
                    onChange={(event) =>
                      handleChange('name', event.target.value)
                    }
                    disabled={saving}
                    required
                  />
                </div>

                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="species">
                    Espécie <span>*</span>
                  </label>

                  <select
                    id="species"
                    name="species"
                    value={values.species}
                    onChange={(event) =>
                      handleChange('species', event.target.value)
                    }
                    disabled={saving}
                    required
                  >
                    <option value="">Selecione a espécie</option>

                    {(Object.keys(speciesLabels) as AnimalSpecies[]).map(
                      (species) => (
                        <option key={species} value={species}>
                          {speciesLabels[species]}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="breed">
                    Raça <span>*</span>
                  </label>

                  <input
                    id="breed"
                    name="breed"
                    type="text"
                    placeholder="Ex: SRD, Golden Retriever..."
                    value={values.breed}
                    onChange={(event) =>
                      handleChange('breed', event.target.value)
                    }
                    disabled={saving}
                    required
                  />
                </div>

                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="sex">
                    Sexo <span>*</span>
                  </label>

                  <select
                    id="sex"
                    name="sex"
                    value={values.sex}
                    onChange={(event) =>
                      handleChange('sex', event.target.value)
                    }
                    disabled={saving}
                    required
                  >
                    <option value="">Selecione o sexo</option>

                    {(Object.keys(sexLabels) as AnimalSex[]).map((sex) => (
                      <option key={sex} value={sex}>
                        {sexLabels[sex]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="size">
                    Porte <span>*</span>
                  </label>

                  <select
                    id="size"
                    name="size"
                    value={values.size}
                    onChange={(event) =>
                      handleChange('size', event.target.value)
                    }
                    disabled={saving}
                    required
                  >
                    <option value="">Selecione o porte</option>

                    {(Object.keys(sizeLabels) as AnimalSize[]).map((size) => (
                      <option key={size} value={size}>
                        {sizeLabels[size]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection title="Características">
              <div className="animal-form-grid animal-form-grid--three">
                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="age">
                    Idade <span>*</span>
                  </label>

                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="0"
                    placeholder="Ex: 2"
                    value={values.age}
                    onChange={(event) =>
                      handleChange('age', event.target.value)
                    }
                    disabled={saving}
                    required
                  />

                  <FormCheckbox
                    id="ageInMonths"
                    label="Idade em meses"
                    checked={values.ageInMonths}
                    disabled={saving}
                    onChange={(checked) =>
                      setValues((current) => ({
                        ...current,
                        ageInMonths: checked,
                      }))
                    }
                  />
                </div>

                <div className="animal-form-check">
                  <FormCheckbox
                    id="vaccinated"
                    label="Vacinado"
                    checked={values.vaccinated}
                    disabled={saving}
                    onChange={(checked) => handleToggle('vaccinated', checked)}
                  />
                </div>

                <div className="animal-form-check">
                  <FormCheckbox
                    id="neutered"
                    label="Castrado"
                    checked={values.neutered}
                    disabled={saving}
                    onChange={(checked) => handleToggle('neutered', checked)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Localização"
              description="Informe onde o animal se encontra atualmente."
            >
              <div className="animal-form-grid">
                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="state">
                    Estado <span>*</span>
                  </label>

                  <select
                    id="state"
                    name="state"
                    value={values.state}
                    onChange={(event) =>
                      handleChange('state', event.target.value)
                    }
                    disabled={saving}
                    required
                  >
                    <option value="">Selecione o estado</option>

                    {states.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="animal-form-field">
                  <label className="animal-form-label" htmlFor="city">
                    Cidade <span>*</span>
                  </label>

                  <select
                    id="city"
                    name="city"
                    value={values.city}
                    onChange={(event) =>
                      handleChange('city', event.target.value)
                    }
                    disabled={saving || !values.state}
                    required
                  >
                    <option value="">
                      {values.state
                        ? 'Selecione a cidade'
                        : 'Selecione o estado primeiro'}
                    </option>

                    {(citiesData?.cities ?? []).map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Sobre o animal"
              description="Descreva a personalidade, história e necessidades especiais."
            >
              <div className="animal-form-field">
                <label className="animal-form-label" htmlFor="description">
                  Descrição completa <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Thor é um cão muito dócil, resgatado após as enchentes..."
                  value={values.description}
                  onChange={(event) =>
                    handleChange('description', event.target.value)
                  }
                  disabled={saving}
                  required
                />
              </div>
            </FormSection>
          </div>

          {error && <p className="animal-form-error">{error}</p>}

          <div className="animal-form-actions">
            <button
              type="button"
              className="animal-form-cancel"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="animal-form-submit"
              disabled={saving}
            >
              <Save />

              {saving ? 'Salvando...' : 'Salvar animal'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AnimalForm;
