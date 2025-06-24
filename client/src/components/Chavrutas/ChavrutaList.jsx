import React from 'react';
import List from './List';
import ChavrutaCard from './ChavrutaCard';
import { useNavigate, useLocation } from 'react-router-dom';

const ChavrutaList = ({ usersMap }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // שליפת סטטוס מה-query (אם קיים)
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type'); // יכול להיות 'active', 'ended', 'pending_start'...

  const renderChavruta = (chavruta, refreshItems) => (
    <ChavrutaCard
      chavruta={chavruta}
      users={usersMap}
      refreshItems={refreshItems}
      currentUserId={JSON.parse(localStorage.getItem('currentUser'))?.id}
      editable={true}
      onUpdateNote={async (id, field, value) => {
        await fetch(`/api/chavruta/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field]: value })
        });
        refreshItems();
      }}
    />
  );

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

  return (
    <List
      endpoint="chavruta"
      renderItem={renderChavruta}
      newItem={() => navigate('new')}
      filters={filters}
      defaultSort={initialSort}
    />
  );
};

export default ChavrutaList;
