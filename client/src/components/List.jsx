// import React, { useEffect, useState } from 'react';
// // import '../css/List.css';
// import { fetchData } from './apiService';

// const RenderedItem = React.memo(({ item, refreshItems, handleDelete, renderItem }) => {
//   return (
//     <li key={item.id}>
//       {renderItem(item, refreshItems)}
//     </li>
//   );
// });

// const List = ({ endpoint, renderItem, filters, newItem }) => {
//   const [items, setItems] = useState([]);
//   const [search, setSearch] = useState('');
//   const [sort, setSort] = useState('');
//   const [idFilter, setIdFilter] = useState('');

//   const handleClick = () => {
//     newItem();
//   };

//   const fetchFilteredData = async () => {
//     const myTable = endpoint.split('?')[0].split(' ')[0];
//     let queryParams = [];

//     if (search) {
//       queryParams.push(`search=${encodeURIComponent(search)}`);
//     }
//     if (idFilter) {
//       queryParams.push(`id=${idFilter}`);
//     }
//     if (sort === 'mine') {
//       const currentUserId = JSON.parse(localStorage.getItem('currentUser'))?.id;
//       if (currentUserId) {
//         queryParams.push(`userId=${currentUserId}`);
//       }
//     } else if (sort === 'completed') {
//       queryParams.push('completed=true');
//     } else if (sort === 'unCompleted') {
//       queryParams.push('completed=false');
//     }
//     if (sort === 'id') {
//       queryParams.push('_sort=id&_order=asc');
//     } else if (sort === 'alphabetical') {
//       queryParams.push('_sort=title&_order=asc');
//     }

//     const fullEndpoint = queryParams.length > 0
//       ? `${myTable}?${queryParams.join('&')}`
//       : myTable;

//     try {
//       const data = await fetchData(fullEndpoint);
//       setItems(data);
//     } catch (error) {
//       console.error('Error fetching filtered items:', error);
//       setItems([]);
//     }
//   };

//   useEffect(() => {
//     fetchFilteredData();
//   }, [endpoint, search, sort, idFilter]);

//   return (
//     <div>
//       <div>
//         <button onClick={handleClick}>NEW</button>
//         <input
//           type="text"
//           placeholder="חפש..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="סנן לפי ID..."
//           value={idFilter}
//           onChange={(e) => setIdFilter(e.target.value)}
//         />
//         <select onChange={(e) => setSort(e.target.value)} defaultValue="">
//           <option value="">מיין לפי...</option>
//           {filters?.map((filter) => (
//             <option key={filter.value} value={filter.value}>
//               {filter.label}
//             </option>
//           ))}
//         </select>
//       </div>
//       <ul>
//         {items.map((item) => (
//           <RenderedItem
//             key={item.id}
//             item={item}
//             refreshItems={fetchFilteredData}
//             handleDelete={fetchFilteredData}
//             renderItem={renderItem}
//           />
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default List;


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

const List = ({ endpoint, renderItem, filters, newItem }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [idFilter, setIdFilter] = useState('');

  const handleClick = () => {
    newItem();
  };

  const fetchFilteredData = async () => {
    const myTable = endpoint.split('?')[0].split(' ')[0];
    let queryParams = [];

    if (search) {
      queryParams.push(`search=${encodeURIComponent(search)}`);
    }
    if (idFilter) {
      queryParams.push(`id=${idFilter}`);
    }
    if (sort === 'mine') {
      const currentUserId = JSON.parse(localStorage.getItem('currentUser'))?.id;
      if (currentUserId) {
        queryParams.push(`userId=${currentUserId}`);
      }
    } else if (sort === 'completed') {
      queryParams.push('completed=true');
    } else if (sort === 'unCompleted') {
      queryParams.push('completed=false');
    }
    if (sort === 'id') {
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
  }, [endpoint, search, sort, idFilter]);

  return (
    <div>
      <div>
        <button onClick={handleClick}>NEW</button>
        <input
          type="text"
          placeholder="חפש..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="סנן לפי ID..."
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
        />
        <select onChange={(e) => setSort(e.target.value)} defaultValue="">
          <option value="">מיין לפי...</option>
          {filters?.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {Array.isArray(items) && items.map((item) => (
          console.log('Rendering item:', item), // Debugging line
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