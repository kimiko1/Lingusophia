import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from 'react';

const Home = lazy(() => import('./components/05-pages/Home'));
const LessonSelection = lazy(() => import('./components/05-pages/LessonSelection'));
const Calendar = lazy(() => import('./components/05-pages/Calendar'));
const ScheduleLesson = lazy(() => import('./components/05-pages/ScheduleLesson'));
const MyLessons = lazy(() => import('./components/05-pages/MyLessons'));
const CustomerReviews = lazy(() => import('./components/05-pages/CustomerReviews'));
const Profile = lazy(() => import('./components/05-pages/Profile'));
const Settings = lazy(() => import('./components/05-pages/Settings'));
const Bookings = lazy(() => import('./components/05-pages/Bookings'));
const Success = lazy(() => import('./components/05-pages/Success'));
const Cancel = lazy(() => import('./components/05-pages/Cancel'));
const Admin = lazy(() => import('./components/05-pages/Admin'));
const Login = lazy(() => import('./components/05-pages/Login'));
const Register = lazy(() => import('./components/05-pages/Register'));
const Logout = lazy(() => import('./components/05-pages/Logout'));
const NotFound = lazy(() => import('./components/05-pages/NotFound'));

import { AdminHeaderTemplate, HeaderTemplate, ProtectedRoute } from './components/04-templates';
import { LessonsProvider } from './contexts/LessonsContext';
import { BookingProvider } from './contexts/BookingContext';
import './styles/main-new.scss';


const App = () => {
  return (
    <LessonsProvider>
      <BookingProvider>
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
      </BookingProvider>
    </LessonsProvider>
  );
};

export default App;