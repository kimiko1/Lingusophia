import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import React, { Suspense } from 'react';

const Home = React.lazy(() => import('./components/05-pages/Home'));
const LessonSelection = React.lazy(() => import('./components/05-pages/LessonSelection'));
const Calendar = React.lazy(() => import('./components/05-pages/Calendar'));
const ScheduleLesson = React.lazy(() => import('./components/05-pages/ScheduleLesson'));
const MyLessons = React.lazy(() => import('./components/05-pages/MyLessons'));
const CustomerReviews = React.lazy(() => import('./components/05-pages/CustomerReviews'));
const Profile = React.lazy(() => import('./components/05-pages/Profile'));
const Settings = React.lazy(() => import('./components/05-pages/Settings'));
const Bookings = React.lazy(() => import('./components/05-pages/Bookings'));
const Success = React.lazy(() => import('./components/05-pages/Success'));
const Cancel = React.lazy(() => import('./components/05-pages/Cancel'));
const Admin = React.lazy(() => import('./components/05-pages/Admin'));
const Login = React.lazy(() => import('./components/05-pages/Login'));
const Register = React.lazy(() => import('./components/05-pages/Register'));
const Logout = React.lazy(() => import('./components/05-pages/Logout'));
const NotFound = React.lazy(() => import('./components/05-pages/NotFound'));

import { AdminHeaderTemplate, HeaderTemplate, ProtectedRoute } from './components/04-templates';
import './styles/main-new.scss';


const App = () => {
  return (
    <Provider store={store}>
      <Router basename="/">
        <Suspense fallback={<div>Chargement...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />

            {/* Routes privées avec layout et protection explicite */}
            <Route element={<HeaderTemplate />}>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/schedule-lesson" element={<ProtectedRoute><ScheduleLesson /></ProtectedRoute>} />
              <Route path="/lesson-selection" element={<ProtectedRoute><LessonSelection /></ProtectedRoute>} />
              <Route path="/my-lessons" element={<ProtectedRoute><MyLessons /></ProtectedRoute>} />
              <Route path="/customer-reviews" element={<ProtectedRoute><CustomerReviews /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>

            {/* Admin route, protected and without HeaderTemplate */}
            <Route element={<AdminHeaderTemplate />}>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Teacher"]}>
                  <Admin />
                </ProtectedRoute>
                }
                />
            </Route>

            {/* 404 Not Found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;