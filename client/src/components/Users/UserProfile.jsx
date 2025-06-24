// import React, { useState } from 'react';
// import '../../css/UserProfile.css'
// //import { useAuth } from '../context/AuthContext';
// import { User, Mail, Phone, Calendar, Edit, Save, X } from 'lucide-react';
// //import { sectorMap, methodMap as contactMethodMap } from '../formatHelpers';
// import {
//     languageMap,
//     genderMap,
//     methodMap,
// } from '../formatHelpers'

// const ProfilePage = () => {
//   //const { user } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: user?.fullName || '',
//     email: user?.email || '',
//     phoneNumber: user?.phoneNumber || '',
//     age: user?.age || 0,
//     sector: user?.sector || '',
//     preferredContact: user?.preferredContact || ''
//   });

//   const sectorOptions = Object.entries(genderMap).map(([value, label]) => ({
//     value,
//     label
//   }));

//   const contactOptions = Object.entries(languageMap).map(([value, label]) => ({
//     value,
//     label
//   }));

//   const handleSave = () => {
//     console.log('Saving user data:', formData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setFormData({
//       fullName: user?.fullName || '',
//       email: user?.email || '',
//       phoneNumber: user?.phoneNumber || '',
//       age: user?.age || 0,
//       sector: user?.sector || '',
//       preferredContact: user?.preferredContact || ''
//     });
//     setIsEditing(false);
//   };

//   const getSectorLabel = (value) => genderMap?.[value] || value;
//   const getContactLabel = (value) => contactMethodMap?.[value] || value;

//   return (
//     <div className="profile-container">
//       <div className="profile-card">
//         <div className="profile-header">
//           <div className="profile-header-left">
//             <div className="profile-icon-wrapper">
//               <User className="profile-icon" />
//             </div>
//             <div>
//               <h1 className="profile-title">הפרופיל שלי</h1>
//               <p className="profile-subtitle">נהל את פרטי החשבון שלך</p>
//             </div>
//           </div>
//           {!isEditing ? (
//             <button onClick={() => setIsEditing(true)} className="edit-btn">
//               <Edit className="icon" />
//               עריכה
//             </button>
//           ) : (
//             <div className="edit-actions">
//               <button onClick={handleSave} className="save-btn">
//                 <Save className="icon" />
//                 שמור
//               </button>
//               <button onClick={handleCancel} className="cancel-btn">
//                 <X className="icon" />
//                 ביטול
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="form-grid">
//           {[
//             {
//               label: 'שם מלא',
//               value: formData.fullName,
//               key: 'fullName',
//               icon: <User className="input-icon" />,
//               type: 'text'
//             },
//             {
//               label: 'כתובת מייל',
//               value: formData.email,
//               key: 'email',
//               icon: <Mail className="input-icon" />,
//               type: 'email'
//             },
//             {
//               label: 'מספר טלפון',
//               value: formData.phoneNumber,
//               key: 'phoneNumber',
//               icon: <Phone className="input-icon" />,
//               type: 'tel'
//             },
//             {
//               label: 'גיל',
//               value: formData.age,
//               key: 'age',
//               icon: <Calendar className="input-icon" />,
//               type: 'number'
//             }
//           ].map(({ label, value, key, icon, type }) => (
//             <div key={key}>
//               <label className="field-label">{label}</label>
//               {isEditing ? (
//                 <input
//                   type={type}
//                   value={value}
//                   onChange={e => setFormData({ ...formData, [key]: e.target.value })}
//                   className="input"
//                 />
//               ) : (
//                 <div className="input-display">
//                   {icon}
//                   <span>{user?.[key]}</span>
//                 </div>
//               )}
//             </div>
//           ))}

//           <div>
//             <label className="field-label">סקטור</label>
//             {isEditing ? (
//               <select
//                 value={formData.sector}
//                 onChange={e => setFormData({ ...formData, sector: e.target.value })}
//                 className="input"
//               >
//                 {sectorOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <div className="input-display">
//                 <span>{getSectorLabel(user?.sector || '')}</span>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="field-label">אמצעי התקשרות מועדף</label>
//             {isEditing ? (
//               <select
//                 value={formData.preferredContact}
//                 onChange={e =>
//                   setFormData({ ...formData, preferredContact: e.target.value })
//                 }
//                 className="input"
//               >
//                 {contactOptions.map(option => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <div className="input-display">
//                 <span>{getContactLabel(user?.preferredContact || '')}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
