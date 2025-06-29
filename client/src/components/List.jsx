import React, { useEffect, useState } from 'react';
// import '../css/List.css';
import { fetchData } from './apiService';

const RenderedItem = React.memo(({ item, refreshItems, handleDelete, renderItem }) => {
  return (
    <li >
      {renderItem(item, refreshItems)}
    </li>
  );
});

const List = ({ endpoint, renderItem, filters, newItem, defaultSort = '', sortFilters }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState(defaultSort);
  const [idFilter, setIdFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleClick = () => {
    newItem();
  };

  const fetchFilteredData = async () => {
    const myTable = endpoint.split('?')[0].split(' ')[0];
    let queryParams = [];

    // זיהוי סוג הנתונים לפי ה-endpoint
    const isChavruta = myTable.includes('chavrutas');
    const isLesson = myTable.includes('lessons');
    const isCall = myTable.includes('calls');
    const isJoinRequest = myTable.includes('joinRequests');

    // חיפוש - עבור חברותות נשלח כפרמטר search
    if (search) {
      queryParams.push(`search=${encodeURIComponent(search)}`);
    }

    // חיפוש לפי שם משתמש (עם מי החברותא)
    if (userSearch && (isChavruta || isCall)) {
      queryParams.push(`userSearch=${encodeURIComponent(userSearch)}`);
    }

    // חיפוש בנושא/חומרים
    // חיפוש בנושא/חומרים (עבור חברותות וקריאות)
    if (subjectSearch && (isChavruta || isCall)) {
        queryParams.push(`subjectSearch=${encodeURIComponent(subjectSearch)}`);
      }


      // סינון לפי ID
      if (idFilter) {
        if (isChavruta) {
          queryParams.push(`chavrutaId=${idFilter}`);
        } else if (isLesson) {
          queryParams.push(`lessonId=${idFilter}`);
        } else if (isCall) {
          queryParams.push(`callId=${idFilter}`);
        } else {
          queryParams.push(`id=${idFilter}`);
        }
      }
      // סינון לפי תאריך (עבור חברותות)
      if (startDate && (isChavruta || isCall)) {
        queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
      }
      if (endDate && (isChavruta || isCall)) {
        queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
      }
      // סינונים מיוחדים
      if (statusFilter.startsWith('status_')) {
        // סינון לפי סטטוס
        const status = statusFilter.replace('status_', '');
        if (isChavruta) {
          queryParams.push(`status=${status}`);
        } else if (isCall) {
          queryParams.push(`status=${status}`);
        }
      } else if (sort === 'completed') {
        queryParams.push('completed=true');
      } else if (sort === 'unCompleted') {
        queryParams.push('completed=false');
      } else if (sort === 'date_asc') {
        if (isChavruta) {
          queryParams.push('sortBy=startedAt&sortOrder=ASC');
        } else if (isCall) {
          queryParams.push('sortBy=createdAt&sortOrder=ASC');
        }
      } else if (sort === 'date_desc') {
        if (isChavruta) {
          queryParams.push('sortBy=startedAt&sortOrder=DESC');
        } else if (isCall) {
          queryParams.push('sortBy=createdAt&sortOrder=DESC');
        }
      } else if (sort === 'id') {
        queryParams.push('_sort=id&_order=asc');
      } else if (sort === 'alphabetical') {
        queryParams.push('_sort=title&_order=asc');
      }


      const fullEndpoint = queryParams.length > 0
        ? `${myTable}?${queryParams.join('&')}`
        : myTable;

      try {
        const data = await fetchData(fullEndpoint);
        console.log('Fetched items:', data); // Debugging line
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
          <button onClick={handleClick}>NEW</button>
          <input
            type="text"
            placeholder="חיפוש כללי..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {(endpoint.includes('chavrutas') || endpoint.includes('calls')) && (
            <input
              type="text"
              placeholder="חיפוש לפי שם החבר..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          )}

          {/* חיפוש בנושא - רק עבור חברותות */}
          {(endpoint.includes('chavrutas') || endpoint.includes('calls')) && (
            <input
              type="text"
              placeholder="חיפוש בנושא/חומרים..."
              value={subjectSearch}
              onChange={(e) => setSubjectSearch(e.target.value)}
            />
          )}
          {/* סינון לפי תאריך - רק עבור חברותות */}
          {(endpoint.includes('chavrutas') || endpoint.includes('calls')) && (
            <>
              <div >
                <label >מתאריך:</label>
                <input
                  type="date"
                  placeholder="מתאריך..."
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div >
                <label>עד תאריך:</label>
                <input
                  type="date"
                  placeholder="עד תאריך..."
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div >
             {endpoint.includes('chavrutas')
                ? 'תאריך התחלת החברותא (לא תאריך יצירת הקריאה)'
                : 'תאריך יצירת הקריאה'
              }
              </div>
            </>
          )}
          {/* <div >
            <label >סנן לפי ID:</label>
            <input
              type="number"
              placeholder="סנן לפי ID..."
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
            />
          </div> */}

          {/* פילטר סטטוס */}
          <div >
            <label >סנן לפי </label>
            <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
              <option value="">הכל </option>
              {filters?.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            {/* <div >
              פעילות = חברותות פעילות, ממתינות = טרם התחילו
            </div> */}
          </div>

          {/* מיון לפי תאריך */}
          <div>
            <label >מיון לפי תאריך:</label>
            <select onChange={(e) => setSort(e.target.value)} value={sort}>
              <option value="">ברירת מחדל</option>
              {sortFilters?.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <div >
              חדשות ביותר     
              </div>
          </div>
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