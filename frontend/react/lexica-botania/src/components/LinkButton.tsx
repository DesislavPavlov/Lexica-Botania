import type { PropsWithChildren } from 'react';
import '../css/linkButton.css';
import { Link } from 'react-router';

interface Props {
  linkTo: string;
  hiddenText?: string;
  onHover?: () => void;
}

const LinkButton = ({
  children,
  linkTo,
  hiddenText,
  onHover,
}: PropsWithChildren<Props>) => {
  return (
    <div className="link-container">
      <Link
        to={linkTo}
        className="link-button"
        onMouseEnter={onHover}
        onFocus={onHover}
      >
        {children}
      </Link>
      <p className="hidden-text">{hiddenText}</p>
    </div>
  );
};

export default LinkButton;
