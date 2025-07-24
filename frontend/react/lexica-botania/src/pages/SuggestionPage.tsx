import BackgroundVideo from '../components/BackgroundVideo';
import suggestPageVideo from '../assets/suggestPageVideo.webm';
import FormStep from '../components/FormStep';
import ReturnHomeButton from '../components/ReturnHomeButton';
import { submitFlower, submitSuggestion } from '../services/api';
import { useNavigate } from 'react-router';
import MultiStepForm from '../components/MultiStepForm';
import { getIsAdmin } from '../services/supabaseService';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';

const suggestionPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkIsAdmin() {
      setIsAdmin(await getIsAdmin());
    }

    checkIsAdmin();
  }, []);

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);

    const form = new FormData();
    form.append('nameBg', formData.nameBg);
    form.append('nameEng', formData.nameEng);
    form.append('nameLatin', formData.nameLatin);

    if (formData.file) {
      form.append('file', formData.file);
    }

    const result = (await getIsAdmin())
      ? await submitFlower(form)
      : await submitSuggestion(form);

    let path = '';
    if (result) {
      path = '/suggestion-result?success=true';
    } else {
      path = '/suggestion-result?success=false';
    }

    setIsLoading(false);
    navigate(path);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <BackgroundVideo src={suggestPageVideo}></BackgroundVideo>

      <section className="entrance-outwards">
        <ReturnHomeButton></ReturnHomeButton>

        <MultiStepForm handleSubmit={handleSubmit}>
          <FormStep
            header={isAdmin ? 'Add a Flower' : 'Expanding Lexica Botania'}
            paragraph={
              isAdmin
                ? 'As an admin, your suggestion will be automatically added as a flower. The other steps will have their default dialogue.'
                : 'Suggest your own flowers, an admin may approve them! To begin with, what is the scientific name of the flower you want to suggest?'
            }
            inputName="nameLatin"
            label="Latin Name"
          />
          <FormStep
            header="Wonderful!"
            paragraph="Let us continue with an image of the flower (must be .webp)"
            inputName="file"
            label="Insert image file..."
            isFile
          />
          <FormStep
            header="Splendid! Next up - common names!"
            paragraph="Tell us how the flower is called by common people in your area or globally in English!"
            inputName="nameEng"
            label="English Name"
          />
          <FormStep
            header="Thank you very much! One last step..."
            paragraph="And finally, we would like you to add the Bulgarian common name of this flower."
            inputName="nameBg"
            label="Bulgarian Name"
          />
        </MultiStepForm>
      </section>
    </>
  );
};

export default suggestionPage;
