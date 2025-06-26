// import React from "react";
// import List from "../List.jsx";
// import CallCard from "./CallCard";
// import * as apiService from "../apiService.js"
//    import { useNavigate } from "react-router-dom";
   
// // מיפוי של call + המשתמש שיצר אותו
// async function fetchCallsWithUsers() {
//   // const calls = await apiService.fetchData("calls");
//   // const users = await apiService.fetchData("users");

//   return calls.map((call) => {
//     const matchedUser = users.find((u) => u.id === call.userId) || {};
//     return {
//       ...call,
//       id: call.id,
//       user: {
//         ...matchedUser,
//         id: matchedUser.id,
//       }
//     };
//   });

// }

// const CallsList = () => {
//   const currentUserId = JSON.parse(localStorage.getItem("currentUser"))?.id;
//    const navigate = useNavigate();
   
//   const renderItem = (callWithUser, refresh) => (
//     <CallCard
//       call={callWithUser}
//       // user={callWithUser.user}
//       currentUserId={currentUserId}
//       setCalls={refresh}
//     />
//   );

//   return (
//     <div>
//       <h2>📚 כל הקריאות לחברותא</h2>
//       <List
//         endpoint="calls"
//         renderItem={renderItem}
//         filters={[
//           { label: "שלי", value: "mine" },
//           { label: "ID עולה", value: "id" }
//         ]}
//         newItem={() => navigate('/CallFrom')}    
//              //fetchCustom={fetchCallsWithUsers}
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

  const [onlyMine, setOnlyMine] = useState(true); // מנהל רואה כברירת מחדל רק את הקריאות שלו
  const [sortKey, setSortKey] = useState(isAdmin ? 'mine' : ''); // ברירת מחדל למנהל

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
    <div>
      <h2>📚 {isAdmin ? "הקריאות שלך (מנהל)" : "כל הקריאות לחברותא"}</h2>
      {isAdmin && (
        <button onClick={handleToggle}>
          {onlyMine ? "הצג את כל הקריאות" : "הצג רק את הקריאות שלי"}
        </button>
      )}
      <List
        endpoint="calls"
        renderItem={renderItem}
        filters={[
          { label: "שלי", value: "mine" },
          { label: "ID עולה", value: "id" },
        ]}
        newItem={() => navigate('/CallFrom')}
        sort={sortKey}
      />
    </div>
  );
};

export default CallsList;
