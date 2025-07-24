import ReturnHomeButton from '../components/ReturnHomeButton';

const FailedAdminLoginPage = () => {
  return (
    <>
      <ReturnHomeButton />

      <div className="message-wrapper">
        <h5 className="header">Invalid administrator credentials!</h5>
        <p className="message">
          You have tried to enter with the wrong credentials for the admin
          account, if you are not an admin, please refrain from doing so again.
        </p>
      </div>
    </>
  );
};

export default FailedAdminLoginPage;
