import React from 'react';
import '../css/backgroundVideo.css';

interface Props {
  src: string;
  className?: string;
}

const BackgroundVideo = ({ src, className }: Props) => {
  return (
    <div className="video-container">
      <div className="overlay"></div>
      <video src={src} autoPlay loop muted className={className}></video>
    </div>
  );
};

export default BackgroundVideo;
