import React, { useState ,useEffect} from "react";
import List from "../List.jsx";
import JoinRequestCard from './joinRequestCard.jsx';
import * as apiService from "../apiService.js";

const JoinRequestList = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserId = currentUser?.id;
  const isAdmin = currentUser?.role === "admin";

  // ברירת מחדל: אדמין רואה רק את שלו
  const [onlyMine, setOnlyMine] = useState(true);
  const [sortKey, setSortKey] = useState(isAdmin ? "mine" : "");
  const [requests, setRequests] = useState([]);

  // הוספת state ל-endpoint
  const [endpoint, setEndpoint] = useState(isAdmin ? "joinRequests/user" : "joinRequests/user");

  // const handleToggle = () => {
  //   if (onlyMine) {
  //     setEndpoint("joinRequests/"); // כל הבקשות
  //   } else {
  //     setEndpoint("joinRequests/user"); // רק שלי
  //   }
  //   setOnlyMine(!onlyMine);
  // };

// פונקציית רענון
  const fetchRequests = async () => {
    try {
      const data = await apiService.getData(endpoint);
      setRequests(data);
    } catch {
      setRequests([]);
    }
  };

    useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [endpoint]);

const handleToggle = () => {
  const nextOnlyMine = !onlyMine;
  setOnlyMine(nextOnlyMine);
  setEndpoint(nextOnlyMine ? "joinRequests/user" : "joinRequests/");
  setSortKey(nextOnlyMine ? "mine" : "");
};

  const renderItem = (request, refresh) => (
    <JoinRequestCard
      request={request}
      setRequests={refresh}
        refreshRequests={fetchRequests}
      currentUserId={currentUserId}
    />
  );

  return (
    <div>
      <h2>📬 {isAdmin ? "הבקשות שלך (מנהל)" : "כל בקשות ההצטרפות"}</h2>
      {isAdmin && (
        <button onClick={handleToggle}>
          {onlyMine ?  "הצג את כל הבקשות"   : "הצג רק את הבקשות שלי"}
        </button>
      )}
      <List
        endpoint={endpoint}
        renderItem={renderItem}
        filters={[
          { label: "שלי", value: "mine" },
          { label: "ID עולה", value: "id" }
        ]}
        sort={sortKey}
       // newItem={() => alert("טופס חדש להצטרפות")}
      />
    </div>
  );
};

export default JoinRequestList;