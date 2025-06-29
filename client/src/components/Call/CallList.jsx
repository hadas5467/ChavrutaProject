// import React, { useState } from "react";
// import List from "../List.jsx";
// import CallCard from "./CallCard";
// import { useNavigate } from "react-router-dom";

// const CallsList = () => {
//   const navigate = useNavigate();
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const currentUserId = currentUser?.id;
//   const isAdmin = currentUser?.role === 'admin';

//   const [onlyMine, setOnlyMine] = useState(true); // מנהל רואה כברירת מחדל רק את הקריאות שלו
//   const [sortKey, setSortKey] = useState(isAdmin ? 'mine' : ''); // ברירת מחדל למנהל

//    const sortFilters = [
//     { value: 'date_desc', label: 'חדשות ביותר' },
//     { value: 'date_asc', label: 'ישנות ביותר' }
//   ];
//   const renderItem = (call, refreshItems) => (
//     <CallCard
//       key={call.id}
//       call={call}
//       currentUserId={currentUserId}
//       setCalls={refreshItems}
//     />
//   );

//   const handleToggle = () => {
//     const nextSort = sortKey === 'mine' ? '' : 'mine';
//     setSortKey(nextSort);
//     setOnlyMine(nextSort === 'mine');
//   };
  

//   return (
//     <div>
//       <h2>📚 {isAdmin ? "הקריאות שלך (מנהל)" : "כל הקריאות לחברותא"}</h2>
//       {isAdmin && (
//         <button onClick={handleToggle}>
//           {onlyMine ? "הצג את כל הקריאות" : "הצג רק את הקריאות שלי"}
//         </button>
//       )}
//       <List
//         endpoint="calls"
//         renderItem={renderItem}
//         filters={sortFilters}
//         newItem={() => navigate('/CallFrom')}
//         sort={sortKey}
//       />
//     </div>
//   );
// };

// export default CallsList;


import React, { useState } from "react";
import List from "../List.jsx";
import CallCard from "./CallCard";
import { useNavigate } from "react-router-dom";

const CallsList = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser?.id;
  const isAdmin = currentUser?.role === 'admin';

  const [onlyMine, setOnlyMine] = useState(true);
  const [sortKey, setSortKey] = useState(isAdmin ? 'mine' : '');

  const sortFilters = [
    { value: 'date_desc', label: 'חדשות ביותר' },
    { value: 'date_asc', label: 'ישנות ביותר' }
  ];
  
  const renderItem = (call, refreshItems) => (
    <CallCard
      key={call.id}
      call={call}
      currentUserId={currentUserId}
      setCalls={refreshItems}
    />
  );

  const handleToggle = () => {
    const nextSort = sortKey === 'mine' ? '' : 'mine';
    setSortKey(nextSort);
    setOnlyMine(nextSort === 'mine');
  };

  return (
    <div className="call-list-container">
      {isAdmin && (
        <div className="filter-controls">
          <button 
            className="toggle-filter-btn secondary" 
            onClick={handleToggle}
          >
            {onlyMine ? "הצג את כל הקריאות" : "הצג רק את הקריאות שלי"}
          </button>
        </div>
      )}
      <List
        endpoint="calls"
        renderItem={renderItem}
        sortFilters={sortFilters}
        newItem={() => navigate('/CallFrom')}
        sort={sortKey}
      />
    </div>
  );
};

export default CallsList;
