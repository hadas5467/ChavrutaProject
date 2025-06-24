// // SignUpBasic.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import { addData } from '../apiService.js';
// import '../../css/Signup.css';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     gmail: '',
//     password: '',
//     sex: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const result = await addData('users/register-basic', formData);
//       // שמור מזהה משתמש/טוקן אם צריך
//       navigate('/complete-profile');
//     } catch (err) {
//       setError('שגיאה בהרשמה. נסה שוב.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-wrapper">
//       <form className="signup-form" onSubmit={handleSubmit}>
//         <h2>הרשמה למערכת</h2>

//         <InputField
//           label="שם מלא"
//           name="name"
//           icon={<User />}
//           type="text"
//           value={formData.name}
//           onChange={handleInputChange}
//         />

//         <InputField
//           label="כתובת מייל"
//           name="gmail"
//           icon={<Mail />}
//           type="email"
//           value={formData.gmail}
//           onChange={handleInputChange}
//         />

//         <InputField
//           label="מין"
//           name="sex"
//           type="select"
//           value={formData.sex}
//           onChange={handleInputChange}
//           options={[
//             { value: '', label: 'בחר' },
//             { value: 'male', label: 'זכר' },
//             { value: 'female', label: 'נקבה' },
//           ]}
//         />

//         <PasswordField
//           value={formData.password}
//           onChange={handleInputChange}
//           showPassword={showPassword}
//           setShowPassword={setShowPassword}
//         />

//         <button type="submit" className="signup-button" disabled={loading}>
//           {loading ? 'טוען...' : 'הרשם'}
//         </button>

//         {error && <div className="signup-error">{error}</div>}
//       </form>
//     </div>
//   );
// };

// const InputField = ({ label, name, type, value, onChange, icon, options }) => (
//   <div className="input-group">
//     <label className="label">{label}</label>
//     <div className="relative">
//       {icon && <span className="icon-left">{icon}</span>}
//       {type === 'select' ? (
//         <select name={name} value={value} onChange={onChange} className="input" required>
//           {options.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>
//       ) : (
//         <input
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="input"
//           required
//         />
//       )}
//     </div>
//   </div>
// );

// const PasswordField = ({ value, onChange, showPassword, setShowPassword }) => (
//   <div className="input-group">
//     <label className="label">סיסמה</label>
//     <div className="relative">
//       <Lock className="icon-left" />
//       <input
//         type={showPassword ? 'text' : 'password'}
//         name="password"
//         value={value}
//         onChange={onChange}
//         className="input password-input"
//         required
//       />
//       <button
//         type="button"
//         onClick={() => setShowPassword(!showPassword)}
//         className="toggle-password"
//       >
//         {showPassword ? <EyeOff /> : <Eye />}
//       </button>
//     </div>
//   </div>
// );

// export default SignUp;


// SignUpBasic.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../../css/Signup.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    gmail: '',
    password: '',
    sex: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/fullSignUp', { state: formData });
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>הרשמה למערכת</h2>

        <InputField
          label="שם מלא"
          name="name"
          icon={<User />}
          type="text"
          value={formData.name}
          onChange={handleInputChange}
        />

        <InputField
          label="כתובת מייל"
          name="gmail"
          icon={<Mail />}
          type="email"
          value={formData.gmail}
          onChange={handleInputChange}
        />

        <InputField
          label="מין"
          name="sex"
          type="select"
          value={formData.sex}
          onChange={handleInputChange}
          options={[
            { value: '', label: 'בחר' },
            { value: 'male', label: 'זכר' },
            { value: 'female', label: 'נקבה' },
          ]}
        />

        <PasswordField
          value={formData.password}
          onChange={handleInputChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <button type="submit" className="signup-button">
          המשך לשלב הבא
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, icon, options }) => (
  <div className="input-group">
    <label className="label">{label}</label>
    <div className="relative">
      {icon && <span className="icon-left">{icon}</span>}
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} className="input" required>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="input"
          required
        />
      )}
    </div>
  </div>
);

const PasswordField = ({ value, onChange, showPassword, setShowPassword }) => (
  <div className="input-group">
    <label className="label">סיסמה</label>
    <div className="relative">
      <Lock className="icon-left" />
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={value}
        onChange={onChange}
        className="input password-input"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="toggle-password"
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>
  </div>
);

export default SignUp;
