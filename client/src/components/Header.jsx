// // client/src/components/Header.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { addData } from "./apiService";
// import '../css/Home.css'; 

// const Header = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await addData("users/logout", {});
//       localStorage.removeItem('currentUser');
//       navigate('/login');
//     } catch (err) {
//       alert("שגיאה ביציאה מהמערכת");
//     }
//   };

//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
// const profileImageName = currentUser?.profile;
// const profileImageSrc = profileImageName
//     ? `http://localhost:4000/api/users/profile/${profileImageName}`
//     : null;

//    return (
//     <header className="home-header">
//       <div>
//         <h1>ברוך הבא למערכת חברותא</h1>
//         <p className="home-subtitle">מצא חברותא ללימוד משותף או הצטרף לקריאות קיימות</p>
//       </div>

//       <div className="home-buttons">
//         <button className="log-out-btn" onClick={handleLogout}>
//           יציאה מהמערכת
//         </button>

//         <div className="profile-image-wrapper">
//           <img
//             src={profileImageSrc}
//             alt="תמונת פרופיל"
//             style={{ maxWidth: 60 }}
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = '/default-profile.png';
//             }}
//           />
//         </div>

//         <button className="profile-btn" onClick={() => navigate('/UserProfile')}>
//           פרופיל אישי
//         </button>
//         <button className="chavruta-history-btn" onClick={() => navigate('/ChavrutaList')}>
//           ניהול חברותות
//         </button>
//         <button className="chavruta-history-btn" onClick={() => navigate('/home')}>
//           דף הבית
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addData } from "./apiService";
import '../css/Home.css'; 

const Header = () => {
  const navigate = useNavigate();
console.log("Header loaded!");

  const handleLogout = async () => {
    try {
      await addData("users/logout", {});
      localStorage.removeItem('currentUser');
      navigate('/login');
    } catch (err) {
      alert("שגיאה ביציאה מהמערכת");
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const profileImageName = currentUser?.profile;
  const profileImageSrc = profileImageName
    ? `http://localhost:4000/api/users/profile/${profileImageName}`
    : null;

  return (
    <header className="home-header">
      <div className="header-left">
        <h1>ברוך הבא למערכת חברותא</h1>
        <p className="home-subtitle">מצא חברותא ללימוד משותף או הצטרף לקריאות קיימות</p>
      </div>

      <div className="home-buttons">
        <button className="log-out-btn" onClick={handleLogout}>
          יציאה
        </button>

        <div className="profile-image-wrapper">
          <img
            src={profileImageSrc}
            alt="תמונת פרופיל"
            style={{ maxWidth: 60 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-profile.png';
            }}
          />
        </div>

        <button className="profile-btn" onClick={() => navigate('/UserProfile')}>
          פרופיל אישי
        </button>
        <button className="chavruta-history-btn" onClick={() => navigate('/ChavrutaList')}>
          ניהול חברותות
        </button>
        <button className="chavruta-history-btn" onClick={() => navigate('/home')}>
          דף הבית
        </button>
      </div>
    </header>
  );
};

export default Header;
