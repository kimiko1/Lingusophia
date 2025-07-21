import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import {
  Home,
  LessonSelection,
  Calendar,
  ScheduleLesson,
  MyLessons,
  CustomerReviews,
  Profile,
  Settings,
  Bookings,
  Success,
  Cancel,
  Admin,
  Login,
  Register,
  Logout,
  NotFound
} from './components/05-pages';
import { AdminHeaderTemplate, HeaderTemplate, ProtectedRoute } from './components/04-templates';
import './styles/main-new.scss';


const App = () => {
  return (
    <Provider store={store}>
      <Router basename="/">
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
      </Router>
    </Provider>
  );
};

export default App;