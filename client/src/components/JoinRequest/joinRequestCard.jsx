import React, { useState } from 'react';
import "../../css/CallCard.css"; // משתמש באותו CSS כמו CallCard
import { joinRequestStatus } from "../formatHelpers";
import * as apiService from "../apiService";

function JoinRequestCard({ request, setRequests, refreshRequests, currentUserId }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isOwner = request.targetUserId === currentUserId;
  const isAdmin = currentUser?.role === "admin";

  const [disabled, setDisabled] = useState(false);

  const handleDelete = async () => {
    if (disabled) return;
    setDisabled(true);
    if (!(isOwner || isAdmin)) {
      alert("רק בעל הבקשה או מנהל יכולים למחוק בקשה זו.");
      return;
    }
    if (!apiService.confirmAction("האם אתה בטוח שברצונך לדחות את הבקשה?")) return;
    try {
      await apiService.deleteData(`joinRequests/${request.id}`);
      refreshRequests();
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (error) {
      alert("שגיאה במחיקת הבקשה ");
    }
  };
const handleApprove = async () => {
  try {
    await apiService.addData("joinRequests/approve", {
      user1: request.userId,
      user2: request.targetUserId,
      callId: request.callId
    });
    refreshRequests();
    setRequests((prev) => prev.filter((r) => r.callId !== request.callId));
    alert("חברותא נוצרה בהצלחה!");
  } catch (err) {
    alert("שגיאה ביצירת החברותא");
  }
};
  // const handleApprove = async () => {
  //   if (disabled) return;
  //   setDisabled(true);
  //   try {
  //     await apiService.addData("chavrutas", {
  //       user1: request.userId,
  //       user2: request.targetUserId,
  //       callId: request.callId,
  //       notesUser1: "",
  //       notesUser2: ""
  //     });

  //     const sameCallRequests = await apiService.fetchData(`joinRequests/byCall/${request.callId}`);
  //     if (!Array.isArray(sameCallRequests)) throw new Error("קבלת בקשות נכשלה");

  //     for (const r of sameCallRequests) {
  //       await apiService.deleteData(`joinRequests/${r.id}`);
  //     }

  //     refreshRequests();
  //     setRequests((prev) => prev.filter((r) => r.callId !== request.callId));
  //     alert("חברותא נוצרה בהצלחה!");
  //   } catch (error) {
  //     alert("שגיאה ביצירת החברותא: " + error.message);
  //     setDisabled(false);
  //   }
  // };

  return (
    <div className="call-card">
      <h3>📩 בקשה להצטרפות לקריאה #{request.callId}</h3>
      <p><strong>נשלחה מ:</strong> משתמש #{request.targetUserId}</p>
      <p><strong>סטטוס:</strong> {joinRequestStatus[request.status]}</p>
      <p><strong>פרטים:</strong> {request.details}</p>
      <p><strong>תאריך:</strong> {new Date(request.requestedAt).toLocaleString("he-IL")}</p>

      {(isOwner || (isAdmin && isOwner)) && (
        <div className="call-buttons">
          <button onClick={handleDelete}>מצטער, כבר לא רלוונטי</button>
          <button onClick={handleApprove}>מצוין! 👍</button>
        </div>
      )}

    </div>
  );
}

export default JoinRequestCard;
