// import CallList from './Call/CallList'

// const Home = () => {
//   return (
//     <main>
//       <h2>דף הבית</h2>
//        <CallList />
//     </main>
//   );
// };

// export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import CallList from './Call/CallList';
import JoinRequestList from './JoinRequest/joinRequestList';
import '../css/Home.css'; // 🔹 ודא שהקובץ נמצא בתיקיית css
import { addData } from "./apiService";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await addData("users/logout", {});  // קריאה גנרית
      localStorage.removeItem('currentUser');
      navigate('/login');
    } catch (err) {
      alert("שגיאה ביציאה מהמערכת");
    }
  };



  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">📖 ברוך הבא למערכת החברותות</h1>
        <div className="home-buttons">
               <button className="log-out-btn" onClick={handleLogout}>
            יציאה
          </button>
          <button className="profile-btn" onClick={() => navigate('/UserProfile')}>
            פרופיל אישי
          </button>
          <button className="chavruta-history-btn" onClick={() => navigate('/ChavrutaList')}>
            ניהול חברותות
          </button>
        </div>
      </header>

      <div className="home-content">
        <div className="home-section right-section">
          <CallList />
        </div>
        <div className="home-section left-section">
          <JoinRequestList />
        </div>
      </div>
    </div>
  );
};

export default Home;
