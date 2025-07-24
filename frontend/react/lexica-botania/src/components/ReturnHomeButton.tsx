import '../css/returnHomeButton.css';
import LinkButton from './LinkButton';

const ReturnHomeButton = () => {
  return (
    <div className="back-button-wrapper">
      <LinkButton linkTo="/">&#8617;</LinkButton>
    </div>
  );
};

export default ReturnHomeButton;
