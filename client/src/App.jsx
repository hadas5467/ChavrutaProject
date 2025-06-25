import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import ProtectedRoute from './components/Users/ProtectedRoute';

// import List from './components/List';

// Login
import Login from './components/Login/LogIn';
import SignUp from './components/Login/SignUp';
import FullSignUp from './components/Login/FullSignUp';

// Users
 //import UserProfile from './components/Users/UserProfile';

// // Chavrutas
// import ChavrutaCard from './components/Chavrutas/ChavrutaCard';
// import ChavrutaComments from './components/Chavrutas/ChavrutaCommetns';
// import ChavrutaForm from './components/Chavrutas/ChavrutaFrom';
// import ChavrutaHistory from './components/Chavrutas/ChavrutaHistory';
import ChavrutaList from './components/Chavrutas/ChavrutaList';


// // Lessons
// import LessonCard from './components/Lessons/LessonCard';
// import LessonForm from './components/Lessons/LessonForm';
// import LessonList from './components/Lessons/LeesonList';

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/fullSignUp" element={<FullSignUp />} />
         {/* <Route path="/home" element={<Home />} /> */}
         <Route path="/home" element={
           <ProtectedRoute>
             <Home />
             {/* <ChavrutaList /> */}
           </ProtectedRoute>
         } />
        <Route path="chavrutaList" element={<ChavrutaList />} />



         {/* </Route> */}


        {/* <Route path="/UserProfile" element={<UserProfile />} /> */}

        {/* <Route path="/home/users/:userId" element={<Home />}>

          <Route path="chavrutaCard" element={<ChavrutaCard />} />
          <Route path="chavrutaComments" element={<ChavrutaComments />} />
          <Route path="chavrutaForm" element={<ChavrutaForm />} />
          <Route path="chavrutaHistory" element={<ChavrutaHistory />} />
          <Route path="chavrutaList" element={<ChavrutaList />} />

          <Route path="lessonCard" element={<LessonCard />} />
          <Route path="lessonForm" element={<LessonForm />} />
          <Route path="lessonList" element={<LessonList />} />

          <Route path="list" element={<List />} />
        </Route>   */}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
