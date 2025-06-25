import React from "react";
import List from "../List.jsx";
import JoinRequestCard from './joinRequestCard.jsx';
import * as apiService from "../apiService.js";

const JoinRequestList = () => {
  const currentUserId = JSON.parse(localStorage.getItem("currentUser"))?.id;

  const renderItem = (request, refresh) => (
    <JoinRequestCard
      request={request}
      setRequests={refresh}
      currentUserId={currentUserId}
    />
  );

  return (
    <div>
      <h2>📬 כל בקשות ההצטרפות</h2>
      <List
        endpoint="joinRequests"
        renderItem={renderItem}
        filters={[
          { label: "שלי", value: "mine" },
          { label: "ID עולה", value: "id" }
        ]}
        newItem={() => alert("טופס חדש להצטרפות")}
      />
    </div>
  );
};

export default JoinRequestList;
