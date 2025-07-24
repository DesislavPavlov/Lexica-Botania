import { useNavigate } from 'react-router';
import { signOut } from '../services/supabaseService';

const AdminLogoutPage = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="message-wrapper">
      <h5 className="header">Are you sure you want to log out as an admin?</h5>
      <button onClick={handleSignOut}>YES</button>
      <button onClick={handleReturn}>NO</button>
    </div>
  );
};

export default AdminLogoutPage;
