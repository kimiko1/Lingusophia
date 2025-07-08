import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// All components from new Atomic Design structure
import { 
  Home, 
  LessonSelection, 
  ComponentShowcase, 
  Calendar,
  ScheduleLesson,
  MyLessons,
  CustomerReviews,
  Profile,
  Settings
} from './components/05-pages';
import { HeaderTemplate } from './components/04-templates';
import './styles/main-new.scss';


const App = () => {
  return (
    <Router basename="/">
      <HeaderTemplate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/schedule-lesson" element={<ScheduleLesson />} />
          <Route path="/lesson-selection" element={<LessonSelection />} />
          <Route path="/my-lessons" element={<MyLessons />} />
          <Route path="/customer-reviews" element={<CustomerReviews />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/showcase" element={<ComponentShowcase />} />
        </Routes>
      </HeaderTemplate>
    </Router>
  );
};

export default App;