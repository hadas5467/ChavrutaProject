import React, { useState } from 'react';
import List from '../List';
import ChavrutaCard from './ChavrutaCard';
import { useNavigate, useLocation } from 'react-router-dom';

const ChavrutaList = ({ usersMap }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.id;
  const isAdmin = currentUser?.role === 'admin';
 

  // שליפת סטטוס מה-query (אם קיים)
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type'); // יכול להיות 'active', 'ended', 'pending_start'...

  // פילטרים בעמוד
  const filters = [
    { value: 'status_active', label: 'חברותות פעילות' },
    { value: 'status_pending_start', label: 'ממתינות להתחלה' },
    { value: 'status_paused', label: 'בהפסקה' },
    { value: 'status_ended', label: 'הסתיימו' },
    { value: 'mine', label: 'שייכות לי' },
  ];

  // אם יש type ברוט – נשלח אותו כברירת מחדל
  const initialSort = type ? `status_${type}` : '';

  // לוגיקה למנהל: מעבר בין "רק שלי" ל"הכל"
  const [onlyMine, setOnlyMine] = useState(!isAdmin);
  const [endpoint, setEndpoint] = useState(isAdmin ? `chavrutas/user/${userId}` : `chavrutas/user/${userId}`);
  const [sortKey, setSortKey] = useState(isAdmin ? 'mine' : initialSort);
 const listSortKey = onlyMine ? sortKey : '';

  const handleToggle = () => {
    const nextOnlyMine = !onlyMine;
    setOnlyMine(nextOnlyMine);
    setEndpoint(nextOnlyMine ? `chavrutas/user/${userId}` : 'chavrutas/');
    setSortKey(nextOnlyMine ? 'mine' : '');
  };

  const renderChavruta = (chavruta, refreshItems) => (
    <ChavrutaCard
      chavruta={chavruta}
      users={usersMap}
      refreshItems={refreshItems}
      currentUserId={userId}
      editable={true}
      onUpdateNote={async (id, field, value) => {
        await fetch(`/api/chavrutas/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field]: value })
        });
        refreshItems();
      }}
    />
  );

  return (
    <div>
      {isAdmin && (
        <button onClick={handleToggle}>
          {onlyMine ? 'הצג את כל החברותות' : 'הצג רק את החברותות שלי'}
        </button>
      )}
      <List className="chavruta-list"
        endpoint={endpoint}
        renderItem={renderChavruta}
       // newItem={() => navigate('new')}
        filters={filters}
        sort={listSortKey} // זה משתנה חדש שמוודא שבמצב 'הכל' לא נשלח userId
        defaultSort={initialSort}
      />
    </div>
  );
};

export default ChavrutaList;