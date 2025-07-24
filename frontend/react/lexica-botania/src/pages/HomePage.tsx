import { useEffect, useInsertionEffect, useState } from 'react';
import suggestionVideo from '../assets/suggestVideo.webm';
import galleryVideo from '../assets/galleryVideo.webm';
import BackgroundVideo from '../components/BackgroundVideo';
import LinkButton from '../components/LinkButton';
import '../css/homePage.css';
import { getIsAdmin, getIsSignedIn, signIn } from '../services/supabaseService';
import Loading from '../components/Loading';
import AdminSignOut from '../components/AdminSignOut';

const HomePage = () => {
  const [hovered, setHovered] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [signInError, setSignInError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useInsertionEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const email = import.meta.env.VITE_GUEST_EMAIL;
    const pass = import.meta.env.VITE_GUEST_PASSWORD;

    async function initialGuestSignIn() {
      const isSignedIn = await getIsSignedIn();
      if (isSignedIn) {
        setIsLoading(false);
        return;
      }

      const successfullSignIn = await signIn(email, pass);
      if (!successfullSignIn) {
        setSignInError(true);
      }

      setIsLoading(false);
    }

    async function checkIsAdmin() {
      setIsAdmin(await getIsAdmin());
    }

    initialGuestSignIn();
    checkIsAdmin();
  }, []);

  const handleHover = (videoName: string): void => {
    if (hovered === videoName) {
      return;
    }

    setIsFading(true);
    setTimeout(() => {
      setHovered(videoName);
      setIsFading(false);
    }, 300);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (signInError) {
    return (
      <div className="message-wrapper">
        <h5 className="header">We are verry sorry!</h5>
        <p className="message">
          It appears we have a problem with our servers, please contact our
          support crew at <i>support@lexica-botania.cool</i>
        </p>
      </div>
    );
  }

  return (
    <section id="homeSection" className="entrance-inwards">
      {isAdmin && <AdminSignOut />}

      <h1>
        Lexica Botania{' '}
        <span className="title-admin">{isAdmin && 'Admin edition'}</span>
      </h1>

      <BackgroundVideo
        className={`${isFading && 'fade-out'}`}
        src={hovered === 'gallery' ? galleryVideo : suggestionVideo}
      ></BackgroundVideo>

      <div className="buttons-container">
        <LinkButton
          linkTo="/suggestion"
          hiddenText="Suggest!"
          onHover={() => handleHover('suggest')}
        >
          🪻
        </LinkButton>
        <div className="separator"></div>
        <LinkButton
          linkTo="/gallery"
          hiddenText="Gallery"
          onHover={() => handleHover('gallery')}
        >
          📖
        </LinkButton>
      </div>
    </section>
  );

  // return (
  //   <div className="relative h-screen w-screen overflow-hidden">
  //     {/* Video background */}
  //     <video
  //       className="absolute top-0 left-0 w-full h-full object-cover z-0"
  //       src={hovered === 'suggest' ? suggestionVideo : galleryVideo}
  //       autoPlay
  //       loop
  //       muted
  //     />

  //     {/* Dark overlay */}
  //     <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-10" />

  //     {/* Buttons */}
  //     <div className="relative z-20 flex flex-col items-center justify-center h-full gap-6 text-white">
  //       <h1 className="text-4xl font-bold">What would you like to do?</h1>
  //       <div className="flex gap-4">
  //         <button
  //           onMouseEnter={() => setHovered('suggest')}
  //           onMouseLeave={() => setHovered('gallery')}
  //           className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg"
  //         >
  //           Suggest a Flower
  //         </button>
  //         <button
  //           onMouseEnter={() => setHovered('view')}
  //           className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg"
  //         >
  //           View Flowers
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default HomePage;
