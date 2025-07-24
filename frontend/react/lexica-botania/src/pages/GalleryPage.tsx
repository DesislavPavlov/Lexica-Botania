import '../css/galleryPage.css';
import galleryPageVideo from '../assets/galleryPageVideo.webm';
import { useEffect, useState } from 'react';
import { getFlowers, getSuggestions } from '../services/api';
import type { Flower } from '../types/Flower';
import { getIsAdmin } from '../services/supabaseService';
import Loading from '../components/Loading';
import FlowerCard from '../components/FlowerCard';
import ReturnHomeButton from '../components/ReturnHomeButton';
import BackgroundVideo from '../components/BackgroundVideo';

const galleryPage = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [suggestions, setSuggestions] = useState<Flower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkIsAdmin() {
      setIsAdmin(await getIsAdmin());
    }

    checkIsAdmin();
    fetchFlowers();
  }, []);

  const fetchFlowers = async () => {
    if (await getIsAdmin()) {
      const suggestionsData = await getSuggestions();
      setSuggestions(suggestionsData);
    }

    const flowerData = await getFlowers();
    setFlowers(flowerData);
    setIsLoading(false);
  };

  const removeFlowerFromArray = (id: string) => {
    setFlowers((prev) => prev.filter((flower) => flower.id !== id));
  };

  const removeSuggestionFromArray = (id: string) => {
    setSuggestions((prev) => prev.filter((suggestion) => suggestion.id !== id));
  };

  const approveSuggestion = () => {
    fetchFlowers();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <BackgroundVideo src={galleryPageVideo} />

      <h3 className="header">Gallery {isAdmin && ' - Admin Dashboard'}</h3>

      <ReturnHomeButton />

      {flowers.length > 0 ? (
        <div className="flower-container">
          {flowers.map((flower) => (
            <FlowerCard
              key={flower.id}
              id={flower.id}
              imageUrl={flower.image_url}
              nameBg={flower.name_bg}
              nameEng={flower.name_eng}
              nameLatin={flower.name_latin}
              onDelete={removeFlowerFromArray}
            />
          ))}
        </div>
      ) : (
        <div className="no-flowers-wrapper">
          <h5 className="header">No flowers!</h5>
          <p className="message">
            It appears Lexica Botania currently has no flowers! Try to add some
            via the suggestion page!
          </p>
        </div>
      )}

      {suggestions.length > 0 ? (
        <>
          <hr />

          <div className="flower-container">
            {suggestions.map((suggestion) => (
              <FlowerCard
                key={suggestion.id}
                id={suggestion.id}
                imageUrl={suggestion.image_url}
                nameBg={suggestion.name_bg}
                nameEng={suggestion.name_eng}
                nameLatin={suggestion.name_latin}
                suggestion
                onDelete={removeSuggestionFromArray}
                onApprove={approveSuggestion}
              />
            ))}
          </div>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default galleryPage;
