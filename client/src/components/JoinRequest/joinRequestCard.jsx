import React from "react";
import "../../css/CallCard.css"; // משתמש באותו CSS כמו CallCard
import { joinRequestStatus } from "../formatHelpers";
import * as apiService from "../apiService";

function JoinRequestCard({ request, setRequests, currentUserId }) {
  const isOwner = request.userId === currentUserId;

  const handleDelete = async () => {
    if (!apiService.confirmAction("האם אתה בטוח שברצונך לדחות את הבקשה?")) return;
    try {
      await apiService.deleteData(`joinRequests/${request.id}`);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      alert("שגיאה במחיקת הבקשה: " + error.message);
    }
  };

  const handleApprove = async () => {
  try {
    // שלח בקשה ליצירת חברותא חדשה
    await apiService.addData("chavrutas", {
      user1: request.userId,         // בעל הקריאה
      user2: request.targetUserId,   // מי שביקש להצטרף
      callId: request.callId,
      notesUser1: "",
      notesUser2: ""
    });

    // אפשר לעדכן סטטוס הבקשה ל"מאושר" (אם יש צורך)
    // await apiService.patchData(`joinRequests/${request.id}`, { status: "approved" });

    alert("חברותא נוצרה בהצלחה!");
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
  } catch (error) {
    alert("שגיאה ביצירת החברותא: " + error.message);
  }
};
  return (
    <div className="call-card">
      <h3>📩 בקשה להצטרפות לקריאה #{request.callId}</h3>
      <p><strong>נשלחה מ:</strong> משתמש #{request.targetUserId}</p>
      <p><strong>סטטוס:</strong> {joinRequestStatus[request.status]}</p>
      <p><strong>פרטים:</strong> {request.details}</p>
      <p><strong>תאריך:</strong> {new Date(request.requestedAt).toLocaleString("he-IL")}</p>
     
        <div className="call-buttons">
          <button onClick={handleDelete}>מצטער, כבר לא רלוונטי</button>
           <button onClick={handleApprove}>מצוין! 👍</button>
        </div>
      
    </div>
  );
}

export default JoinRequestCard;
