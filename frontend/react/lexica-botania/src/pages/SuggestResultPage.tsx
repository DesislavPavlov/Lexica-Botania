import BackgroundVideo from '../components/BackgroundVideo';
import { motion } from 'framer-motion';
import ThankYouVideo from '../assets/thankYouVideo.webm';
import ErrorVideo from '../assets/suggestErrorPageVideo.webm';
import { useSearchParams } from 'react-router';
import ReturnHomeButton from '../components/ReturnHomeButton';

const SuggestResultPage = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <BackgroundVideo
          src={success ? ThankYouVideo : ErrorVideo}
        ></BackgroundVideo>
      </motion.div>

      <div className="message-wrapper entrance-outwards">
        {success ? (
          <>
            <h5 className="header">
              Thank you for contributing to Lexica Botania!
            </h5>
            <p className="message">
              It means a lot to us that you are taking part in this project,
              thank you!
            </p>
            <p className="message">
              An admin will soon review your flower suggestion, and if
              everything is alright, you will very soon see your own suggestion
              in the website!
            </p>
            <p className="message">
              If you have any more flowers in mind, do not hesitate to suggest
              them as well!
            </p>
          </>
        ) : (
          <>
            <h5 className="header">Uh oh! An error ocurred!</h5>
            <p className="message">
              It appears we have a problem, we could not save your suggestion!
            </p>
            <p className="message">
              Please try again and if you see this page again make sure to
              contact our support team!
            </p>
          </>
        )}
      </div>

      <ReturnHomeButton></ReturnHomeButton>
    </>
  );
};

export default SuggestResultPage;
