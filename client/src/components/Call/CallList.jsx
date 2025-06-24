import React from "react";
import List from "../List.jsx";
import CallCard from "./CallCard";
import * as apiService from "../apiService.js"

// מיפוי של call + המשתמש שיצר אותו
async function fetchCallsWithUsers() {
  const calls = await apiService.fetchData("calls");
  const users = await apiService.fetchData("users");

  return calls.map((call) => ({
    ...call,
    user: users.find((u) => u.userId === call.userId) || {},
  }));
}

const CallsPage = () => {
  const currentUserId = JSON.parse(localStorage.getItem("currentUser"))?.userId;

  const renderItem = (callWithUser, refresh) => (
    <CallCard
      call={callWithUser}
      user={callWithUser.user}
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
        newItem={() => alert("כאן אפשר להוסיף יצירת קריאה חדשה")}
        fetchCustom={fetchCallsWithUsers}
      />
    </div>
  );
};

export default CallsPage;
