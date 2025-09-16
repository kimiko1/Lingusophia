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

            {/* Routes privées avec protection globale */}
            <Route element={<ProtectedRoute><HeaderTemplate /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/schedule-lesson" element={<ScheduleLesson />} />
              <Route path="/lesson-selection" element={<LessonSelection />} />
              <Route path="/my-lessons" element={<MyLessons />} />
              <Route path="/customer-reviews" element={<CustomerReviews />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
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