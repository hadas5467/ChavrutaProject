import React, { useState } from "react";
import List from "../List.jsx";
import JoinRequestCard from './joinRequestCard.jsx';

const JoinRequestList = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser?.id;
  const isAdmin = currentUser?.role === "admin";
  const [onlyMine, setOnlyMine] = useState(true);
  const [endpoint, setEndpoint] = useState("joinRequests/user");

  const handleToggle = () => {
    const nextOnlyMine = !onlyMine;
    setOnlyMine(nextOnlyMine);
    setEndpoint(nextOnlyMine ? "joinRequests/user" : "joinRequests/");
  };

  const renderItem = (request, refresh) => (
    <JoinRequestCard
      request={request}
      setRequests={refresh}
      refreshRequests={refresh}
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
        endpoint={endpoint}
        renderItem={renderItem}
        filters={[
          { label: "ממתינות", value: "status_pending" },
          { label: "אושרו", value: "status_approved" },
          { label: "נדחו", value: "status_declined" }
        ]}
        sortFilters={[
          { label: "חדשות קודם", value: "date_desc" },
          { label: "ישנות קודם", value: "date_asc" },
          { label: "לפי ID", value: "id" }
        ]}
        defaultSort="date_desc"
       // newItem={() => {}}
      />
    </div>
  );
};

export default JoinRequestList;
