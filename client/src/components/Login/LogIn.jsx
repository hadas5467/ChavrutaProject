// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// //import { useAuth } from '../context/AuthContext';
// import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import '../../css/LogIn.css'

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//  // const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       //await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError('שגיאה בהתחברות. אנא בדוק את הפרטים שלך.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrapper">
//     <div className="login-container">
//       <div className="login-box">
//         <div className="login-header">
//           <div className="icon-wrapper">
//             <div className="icon-bg">
//               <LogIn className="icon" />
//             </div>
//           </div>
//           <h1 className="login-title">התחברות</h1>
//           <p className="login-subtitle">התחבר לחשבון שלך</p>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="form-group">
//             <label htmlFor="email">כתובת מייל</label>
//             <div className="input-wrapper">
//               <Mail className="input-icon" />
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="הזן את כתובת המייל שלך"
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">סיסמה</label>
//             <div className="input-wrapper">
//               <Lock className="input-icon" />
//               <input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 placeholder="הזן את הסיסמה שלך"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="toggle-password"
//               >
//                 {showPassword ? <EyeOff /> : <Eye />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="login-button"
//           >
//             {loading ? (
//               <div className="spinner"></div>
//             ) : (
//               <>
//                 <LogIn className="btn-icon" />
//                 התחבר
//               </>
//             )}
//           </button>
//         </form>

//         <div className="signup-text">
//           <p>
//             אין לך חשבון?{' '}
//             <Link to="/signup" className="signup-link">
//               הרשם כאן
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default LoginPage;


// //npm install react-router-dom lucide-react
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addData } from '../apiService.js';

import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../../css/LogIn.css'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 // const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await addData("/api/users/logIn",{email, password});
      //await login(email, password);
      navigate('/');
    } catch (err) {
      setError('שגיאה בהתחברות. אנא בדוק את הפרטים שלך.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="icon-wrapper">
            <div className="icon-bg">
              <LogIn className="icon" />
            </div>
          </div>
          <h1 className="login-title">התחברות</h1>
          <p className="login-subtitle">התחבר לחשבון שלך</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">כתובת מייל</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="הזן את כתובת המייל שלך"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="הזן את הסיסמה שלך"
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

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <LogIn className="btn-icon" />
                התחבר
              </>
            )}
          </button>
        </form>

        <div className="signup-text">
          <p>
            אין לך חשבון?{' '}
            <Link to="/signup" className="signup-link">
              הרשם כאן
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;


//npm install react-router-dom lucide-react