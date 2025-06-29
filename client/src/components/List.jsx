import React, { useEffect, useState } from 'react';
import { fetchData } from './apiService';
import '../css/list.css';
const RenderedItem = React.memo(({ item, refreshItems, handleDelete, renderItem }) => {
  return (
    <li>
      {renderItem(item, refreshItems)}
    </li>
  );
});

const List = ({ endpoint, renderItem, filters, newItem, defaultSort = '', sortFilters, sort: initialSort = '' }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState(initialSort || defaultSort);
  const [idFilter, setIdFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleClick = () => {
    if (newItem) {
      newItem();
    }
  };

  const fetchFilteredData = async () => {
    const myTable = endpoint.split('?')[0].split(' ')[0];
    let queryParams = [];

    const isChavruta = myTable.includes('chavrutas');
    const isLesson = myTable.includes('lessons');
    const isCall = myTable.includes('calls');
    const isJoinRequest = myTable.includes('joinRequests');

    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (userSearch) queryParams.push(`userSearch=${encodeURIComponent(userSearch)}`);
    if (subjectSearch) queryParams.push(`subjectSearch=${encodeURIComponent(subjectSearch)}`);

    if (idFilter) {
      if (isChavruta) queryParams.push(`chavrutaId=${idFilter}`);
      else if (isLesson) queryParams.push(`lessonId=${idFilter}`);
      else if (isCall) queryParams.push(`callId=${idFilter}`);
      else queryParams.push(`id=${idFilter}`);
    }
    if (startDate) queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
    if (endDate) queryParams.push(`endDate=${encodeURIComponent(endDate)}`);

    if (statusFilter.startsWith('status_')) {
      const status = statusFilter.replace('status_', '');
      queryParams.push(`status=${status}`);
    }

    if (sort === 'completed') queryParams.push('completed=true');
    else if (sort === 'unCompleted') queryParams.push('completed=false');
    else if (sort === 'date_asc') {
      if (isJoinRequest) {
        queryParams.push('sortBy=createdAt&sortOrder=ASC');
      }
    } else if (sort === 'date_desc') {
      if (isJoinRequest) {
        queryParams.push('sortBy=createdAt&sortOrder=DESC'); // ← כאן הטעות במקור
      }
    }
    else if (sort === 'id') queryParams.push('_sort=id&_order=asc');
    else if (sort === 'alphabetical') queryParams.push('_sort=title&_order=asc');

    const fullEndpoint = queryParams.length > 0
      ? `${myTable}?${queryParams.join('&')}`
      : myTable;

    try {
      const data = await fetchData(fullEndpoint);
      console.log('Fetched items:', data);
      setItems(data);
    } catch (error) {
      console.error('Error fetching filtered items:', error);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [endpoint, search, userSearch, subjectSearch, sort, statusFilter, idFilter, startDate, endDate]);

  return (
    <div>
      <div>
        {!endpoint.includes('joinRequests') && !endpoint.includes('chavrutas') && (
          <button onClick={handleClick}>קריאה חדשה</button>
        )}
        <div className="list-controls">
        <input type="text" placeholder="חיפוש כללי..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {(endpoint.includes('chavrutas') || endpoint.includes('calls') || endpoint.includes('joinRequests')) && (
          <input type="text" placeholder="חיפוש לפי שם החבר..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
        )}
        {(endpoint.includes('chavrutas') || endpoint.includes('calls')) && (
          <input type="text" placeholder="חיפוש בנושא/חומרים..." value={subjectSearch} onChange={(e) => setSubjectSearch(e.target.value)} />
        )}
        {(endpoint.includes('chavrutas') || endpoint.includes('calls') || endpoint.includes('joinRequests')) && (
          <>
            <div>
              <label>מתאריך:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label>עד תאריך:</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </>
        )}
        {(!endpoint.includes('joinRequests') && <div>
          <label>סנן לפי</label>
          <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
            <option value="">הכל </option>
            {filters?.map((filter) => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        </div>)}
</div>
        {/* <div>
          <label>מיון לפי תאריך:</label>
          <select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="">ברירת מחדל</option>
            {sortFilters?.map((filter) => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        </div> */}
      </div>
      <ul>
        {items.map((item) => (
          <RenderedItem
            key={item.id}
            item={item}
            refreshItems={fetchFilteredData}
            handleDelete={fetchFilteredData}
            renderItem={renderItem}
          />
        ))}
      </ul>
    </div>
  );
};

export default List;
