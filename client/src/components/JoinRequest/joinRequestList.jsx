// import React from "react";
// import List from "../List.jsx";
// import JoinRequestCard from './joinRequestCard.jsx';
// import * as apiService from "../apiService.js";

// const JoinRequestList = () => {
//   const currentUserId = JSON.parse(localStorage.getItem("currentUser"))?.id;

//   const renderItem = (request, refresh) => (
//     <JoinRequestCard
//       request={request}
//       setRequests={refresh}
//       currentUserId={currentUserId}
//     />
//   );

//   return (
//     <div>
//       <h2>📬 כל בקשות ההצטרפות</h2>
//       <List
//        endpoint={`joinRequests/user`}
//         renderItem={renderItem}
//         filters={[
//           { label: "שלי", value: "mine" },
//           { label: "ID עולה", value: "id" }
//         ]}
//         newItem={() => alert("טופס חדש להצטרפות")}
//       />
//     </div>
//   );
// };

// export default JoinRequestList;


import React, { useState } from "react";
import List from "../List.jsx";
import JoinRequestCard from './joinRequestCard.jsx';
import * as apiService from "../apiService.js";

const JoinRequestList = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser?.id;
  const isAdmin = currentUser?.role === "admin";

  const [onlyMine, setOnlyMine] = useState(true);
  const [sortKey, setSortKey] = useState(isAdmin ? "mine" : "");

  const handleToggle = () => {
    const nextSort = sortKey === "mine" ? "" : "mine";
    setSortKey(nextSort);
    setOnlyMine(nextSort === "mine");
  };

  const renderItem = (request, refresh) => (
    <JoinRequestCard
      request={request}
      setRequests={refresh}
      currentUserId={currentUserId}
    />
  );

  return (
    <div>
      <h2>📬 {isAdmin ? "הבקשות שלך (מנהל)" : "כל בקשות ההצטרפות"}</h2>
      {isAdmin && (
        <button onClick={handleToggle}>
          {onlyMine ? "הצג את כל הבקשות" : "הצג רק את הבקשות שלי"}
        </button>
      )}
      <List
        endpoint={`joinRequests/user`}
        renderItem={renderItem}
        filters={[
          { label: "שלי", value: "mine" },
          { label: "ID עולה", value: "id" }
        ]}
        sort={sortKey}
        newItem={() => alert("טופס חדש להצטרפות")}
      />
    </div>
  );
};

export default JoinRequestList;
