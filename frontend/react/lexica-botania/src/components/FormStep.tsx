import { motion } from 'framer-motion';
import '../css/formStep.css';

interface Props {
  header: string;
  paragraph: string;
  inputName: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFile?: boolean;
  isEmail?: boolean;
  imagePreview?: string;
}

const FormStep = ({
  header,
  paragraph,
  inputName,
  label,
  value,
  onChange,
  isFile = false,
  isEmail = false,
  imagePreview,
}: Props) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: [0.5, 0.1, 0],
        scale: [0.95, 0.8, 0.8],
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <h5 className="step-header">{header}</h5>
      <p className="step-message">{paragraph}</p>
      <div className="form-input-wrapper">
        <label htmlFor={inputName}>{label}</label>
        <input
          type={isFile ? 'file' : isEmail ? 'email' : 'text'}
          id={inputName}
          name={inputName}
          value={isFile ? undefined : value}
          accept={isFile ? 'image/*' : undefined}
          onChange={onChange}
          required
          hidden={isFile ? true : false}
        />
        {isFile && imagePreview && (
          <div className="image-preview-wrapper">
            <img
              className="image-preview"
              src={imagePreview}
              alt="Preview of selected image"
            ></img>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FormStep;
