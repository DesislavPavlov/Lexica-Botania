import notFoundVideo from '../assets/notFoundVideo.webm';
import ReturnHomeButton from '../components/ReturnHomeButton';
import BackgroundVideo from '../components/BackgroundVideo';

const NotFoundPage = () => {
  return (
    <>
      <BackgroundVideo src={notFoundVideo} />
      <ReturnHomeButton />
      <div className="message-wrapper">
        <h5 className="header">Oops! This link is invalid!</h5>
        <p className="message">
          You have landed on a page that does not exist! You can return to the
          home menu now!
        </p>
      </div>
    </>
  );
};

export default NotFoundPage;
