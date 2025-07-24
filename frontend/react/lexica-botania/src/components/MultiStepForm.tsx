import { AnimatePresence } from 'framer-motion';
import '../css/multiStepForm.css';
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from 'react';

interface FormStepProps {
  header: string;
  paragraph: string;
  inputName: string;
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFile?: boolean;
  isEmail?: boolean;
  imagePreview?: string;
}

interface Props {
  handleSubmit: (formData: Record<string, any>) => {};
}

const MultiStepForm = ({
  children,
  handleSubmit,
}: PropsWithChildren<Props>) => {
  // Read steps
  const steps = Children.toArray(children).filter((child) =>
    isValidElement<FormStepProps>(child)
  ) as React.ReactElement<FormStepProps>[];

  const initialFormData = steps.reduce((acc, currentStep) => {
    const key = currentStep.props.inputName;
    acc[key] = currentStep.props.isFile ? null : '';
    return acc;
  }, {} as Record<string, any>);

  // Constants & functions
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(0);
  const [imagePreview, setImagePreview] = useState('');

  const prevStep = () => {
    if (step === 0) {
      return;
    }

    setStep((prev) => prev - 1);
  };

  const nextStep = async () => {
    if (step === steps.length - 1) {
      handleSubmit(formData);
      return;
    }

    setStep((prev) => prev + 1);
  };

  const isStepValid = () => {
    const currentStep = steps[step];
    const key = currentStep.props.inputName;

    if (currentStep.props.isFile) {
      return formData[key];
    } else if (currentStep.props.isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(formData[key]);
    } else {
      return formData[key].trim();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files, value } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));
      setImagePreview(files?.[0] ? URL.createObjectURL(files?.[0]) : '');
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        nextStep();
      }}
    >
      <AnimatePresence mode="wait">
        {cloneElement(steps[step], {
          key: `step-${step}`,
          header: steps[step].props.header,
          paragraph: steps[step].props.paragraph,
          inputName: steps[step].props.inputName,
          label: steps[step].props.label,
          onChange: handleChange,
          isFile: steps[step].props.isFile,
          isEmail: steps[step].props.isEmail,
          value: formData[steps[step].props.inputName],
          imagePreview: steps[step].props.isFile ? imagePreview : undefined,
        })}

        <div className="form-button-wrapper button-bar">
          <button
            className="form-button prev"
            type="button"
            onClick={prevStep}
            disabled={step === 0}
          ></button>
          <button
            className="form-button next"
            type="button"
            onClick={nextStep}
            disabled={!isStepValid()}
          ></button>
        </div>
      </AnimatePresence>
    </form>
  );
};

export default MultiStepForm;
