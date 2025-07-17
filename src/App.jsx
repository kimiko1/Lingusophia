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
  Logout
} from './components/05-pages';
import { HeaderTemplate, ProtectedRoute } from './components/04-templates';
import './styles/main-new.scss';


const App = () => {
  return (
    <Provider store={store}>
      <Router basename="/">
        <Routes>
          {/* Routes avec HeaderTemplate */}
          <Route
            path="*"
            element={
              <HeaderTemplate>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="/schedule-lesson" element={<ProtectedRoute><ScheduleLesson /></ProtectedRoute>} />
                  <Route path="/lesson-selection" element={<ProtectedRoute><LessonSelection /></ProtectedRoute>} />
                  <Route path="/my-lessons" element={<ProtectedRoute><MyLessons /></ProtectedRoute>} />
                  <Route path="/customer-reviews" element={<CustomerReviews />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/cancel" element={<Cancel />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
              </HeaderTemplate>
            }
          />
          {/* Route admin sans HeaderTemplate */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={["Admin", "Teacher"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;