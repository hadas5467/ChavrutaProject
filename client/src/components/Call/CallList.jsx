import React from "react";
import List from "../List.jsx";
import CallCard from "./CallCard";
import * as apiService from "../apiService.js"

// מיפוי של call + המשתמש שיצר אותו
async function fetchCallsWithUsers() {
  // const calls = await apiService.fetchData("calls");
  // const users = await apiService.fetchData("users");

  return calls.map((call) => {
    const matchedUser = users.find((u) => u.id === call.userId) || {};
    return {
      ...call,
      id: call.id,
      user: {
        ...matchedUser,
        id: matchedUser.id,
      }
    };
  });

}

const CallsList = () => {
  const currentUserId = JSON.parse(localStorage.getItem("currentUser"))?.id;

  const renderItem = (callWithUser, refresh) => (
    <CallCard
      call={callWithUser}
      // user={callWithUser.user}
      currentUserId={currentUserId}
      setCalls={refresh}
    />
  );

  return (
    <div>
      <h2>📚 כל הקריאות לחברותא</h2>
      <List
        endpoint="calls"
        renderItem={renderItem}
        filters={[
          { label: "שלי", value: "mine" },
          { label: "ID עולה", value: "id" }
        ]}
        newItem={() => navigate('/CallFrom')}    
             //fetchCustom={fetchCallsWithUsers}
      />
    </div>
  );
};

export default CallsList;
