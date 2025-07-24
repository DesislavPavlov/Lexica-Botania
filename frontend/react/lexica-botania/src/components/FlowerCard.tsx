import { useEffect, useState } from 'react';
import '../css/flowerCard.css';
import { getIsAdmin } from '../services/supabaseService';
import {
  approveSuggestion,
  deleteFlower,
  deleteSuggestion,
} from '../services/api';

interface Props {
  id: string;
  imageUrl: string;
  nameLatin: string;
  nameEng: string;
  nameBg: string;
  suggestion?: boolean;
  onDelete: (id: string) => void;
  onApprove?: () => void;
}

const FlowerCard = ({
  id,
  imageUrl,
  nameLatin,
  nameEng,
  nameBg,
  suggestion = false,
  onDelete,
  onApprove,
}: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkIsAdmin() {
      setIsAdmin(await getIsAdmin());
    }

    checkIsAdmin();
  }, []);

  const handleFlowerDelete = async () => {
    const success = await deleteFlower(id);
    if (success) {
      onDelete(id);
    }
  };

  const handleSuggestionDelete = async () => {
    const success = await deleteSuggestion(id);
    if (success) {
      onDelete(id);
    }
  };

  const handleSuggestionApprove = async () => {
    const success = await approveSuggestion(id);
    if (success) {
      onApprove!();
    }
  };

  return (
    <div className={`flower-card ${suggestion ? 'suggestion' : ''}`}>
      <img
        src={imageUrl}
        alt={`Image of ${nameLatin}`}
        className="flower-image"
      />
      <div className="flower-names">
        <p className="name-latin">{nameLatin}</p>
        <div className="names-local">
          <p className="name-eng">{nameEng}</p>
          <p className="name-bg">{nameBg}</p>
        </div>
      </div>
      {isAdmin && (
        <div className="admin-controls">
          <button
            onClick={suggestion ? handleSuggestionDelete : handleFlowerDelete}
          >
            &#128465;
          </button>

          {suggestion && (
            <button onClick={handleSuggestionApprove}>&#10003;</button>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowerCard;
