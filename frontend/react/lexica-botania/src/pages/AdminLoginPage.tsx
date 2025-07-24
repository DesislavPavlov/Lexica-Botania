import FormStep from '../components/FormStep';
import ReturnHomeButton from '../components/ReturnHomeButton';
import { useNavigate } from 'react-router';
import MultiStepForm from '../components/MultiStepForm';
import { signIn } from '../services/supabaseService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData: Record<string, any>) => {
    const adminSignedIn = await signIn(formData.email, formData.password);

    if (!adminSignedIn) {
      console.log('Invalid administrator credentials!');
      navigate('/admin-failed');
    } else {
      console.log('Administrator successfully logged in!');
      navigate('/');
    }
  };
  return (
    <>
      <section className="entrance-outwards">
        <ReturnHomeButton></ReturnHomeButton>
        <MultiStepForm handleSubmit={handleSubmit}>
          <FormStep
            header="Enter Admin Email"
            paragraph=""
            inputName="email"
            label="Email"
            isEmail
          />
          <FormStep
            header="Enter Magical Password"
            paragraph=""
            inputName="password"
            label="Magical passoword"
          />
        </MultiStepForm>
      </section>
    </>
  );
};

export default AdminLoginPage;
