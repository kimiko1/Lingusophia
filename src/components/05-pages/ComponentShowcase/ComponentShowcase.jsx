import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Title, 
  Input, 
  Logo, 
  NavLink, 
  UserGreeting, 
  Modal, 
  OvalCard, 
  TeacherInfo 
} from '../../01-atoms';
import { LanguageCard, NavItem, CategoryCard } from '../../02-molecules';
import { Navbar, Navigations } from '../../03-organisms';
import { faSearch, faUser, faHeart, faDownload, faHome, faBook, faCog } from '@fortawesome/free-solid-svg-icons';
import './ComponentShowcase.scss';

/**
 * ComponentShowcase - Page de démonstration des composants
 * Présente tous les composants atomiques et moléculaires
 */
const ComponentShowcase = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOval, setSelectedOval] = useState(null);

  const languages = [
    { name: 'English', flag: '🇺🇸' },
    { name: 'Français', flag: '🇫🇷' },
    { name: 'Español', flag: '🇪🇸' },
    { name: '中文', flag: '🇨🇳' },
    { name: '日本語', flag: '🇯🇵' },
    { name: 'Deutsch', flag: '🇩🇪' }
  ];

  const categories = [
    { name: 'Beginner', color: 'green', description: 'Start your journey' },
    { name: 'Intermediate', color: 'orange', description: 'Build your skills' },
    { name: 'Advanced', color: 'red', description: 'Master the language' },
    { name: 'Expert', color: 'purple', description: 'Perfect your fluency' }
  ];

  return (
    <div className="component-showcase">
      <div className="container">
        <Title level={1} align="center" className="showcase-title">
          Component Showcase
        </Title>
        <p className="showcase-description">
          Présentation des composants Atomic Design de LearnALanguage
        </p>

        {/* Logo Section */}
        <section className="showcase-section">
          <Title level={2}>Logo</Title>
          <Card padding="lg">
            <div className="logo-grid">
              <div className="logo-group">
                <h4>Sizes</h4>
                <Logo size="small" />
                <Logo size="medium" />
                <Logo size="large" />
              </div>
              <div className="logo-group">
                <h4>Variants</h4>
                <Logo variant="default" />
                <Logo variant="primary" />
                <Logo variant="gradient" clickable />
              </div>
            </div>
          </Card>
        </section>

        {/* User Greeting Section */}
        <section className="showcase-section">
          <Title level={2}>User Greeting</Title>
          <Card padding="lg">
            <div className="greeting-grid">
              <UserGreeting name="Alice" animated />
              <UserGreeting name="Bob" variant="primary" size="large" />
              <UserGreeting name="Charlie" variant="warm" greeting="Bonjour" emoji="🌟" />
            </div>
          </Card>
        </section>

        {/* NavLink Section */}
        <section className="showcase-section">
          <Title level={2}>Navigation Links</Title>
          <Card padding="lg">
            <div className="navlink-grid">
              <NavLink icon={faHome} href="/" label="Home" />
              <NavLink icon={faBook} href="/lessons" label="Lessons" isActive />
              <NavLink icon={faUser} href="/profile" label="Profile" />
              <NavLink icon={faCog} href="/settings" label="Settings" disabled />
            </div>
          </Card>
        </section>

        {/* Teacher Info Section */}
        <section className="showcase-section">
          <Title level={2}>Teacher Info</Title>
          <Card padding="lg">
            <div className="teacher-grid">
              <TeacherInfo 
                name="Marie Dubois" 
                image="https://via.placeholder.com/60" 
                title="French Teacher"
                layout="vertical"
              />
              <TeacherInfo 
                name="John Smith" 
                image="https://via.placeholder.com/60" 
                title="English Teacher"
                layout="horizontal"
                variant="card"
                interactive
              />
              <TeacherInfo 
                name="Yuki Tanaka" 
                image="https://via.placeholder.com/60" 
                title="Japanese Teacher"
                size="small"
                variant="minimal"
              />
            </div>
          </Card>
        </section>

        {/* OvalCard Section */}
        <section className="showcase-section">
          <Title level={2}>Oval Cards</Title>
          <Card padding="lg">
            <div className="oval-grid">
              <OvalCard 
                variant="primary" 
                isSelected={selectedOval === 'option1'}
                onClick={() => setSelectedOval('option1')}
                interactive
              >
                <p>Interactive Option 1</p>
              </OvalCard>
              <OvalCard 
                variant="success" 
                size="large"
                isSelected={selectedOval === 'option2'}
                onClick={() => setSelectedOval('option2')}
                interactive
              >
                <p>Large Success Card</p>
              </OvalCard>
              <OvalCard variant="warning" size="small">
                <p>Small Warning</p>
              </OvalCard>
            </div>
          </Card>
        </section>

        {/* Modal Section */}
        <section className="showcase-section">
          <Title level={2}>Modal</Title>
          <Card padding="lg">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              size="medium"
            >
              <p>This is a modal content example with our new Modal component!</p>
              <p>It includes proper accessibility features and customizable options.</p>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </Modal>
          </Card>
        </section>

        {/* Buttons Section */}
        <section className="showcase-section">
          <Title level={2}>Buttons</Title>
          <Card padding="lg">
            <div className="button-grid">
              <div className="button-group">
                <h4>Variants</h4>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              
              <div className="button-group">
                <h4>Sizes</h4>
                <Button size="sm">Small</Button>
                <Button size="base">Base</Button>
                <Button size="lg">Large</Button>
              </div>
              
              <div className="button-group">
                <h4>With Icons</h4>
                <Button icon={faUser}>Profile</Button>
                <Button icon={faDownload} iconPosition="right">Download</Button>
                <Button icon={faHeart} variant="outline">Like</Button>
              </div>
              
              <div className="button-group">
                <h4>States</h4>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="showcase-section">
          <Title level={2}>Cards</Title>
          <div className="card-grid">
            <Card padding="lg">
              <Title level={3}>Default Card</Title>
              <p>This is a default card with base styling and large padding.</p>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <Title level={3}>Elevated Card</Title>
              <p>This card has enhanced shadow for emphasis.</p>
            </Card>
            
            <Card variant="outlined" padding="lg">
              <Title level={3}>Outlined Card</Title>
              <p>This card uses borders instead of shadows.</p>
            </Card>
            
            <Card interactive hover padding="lg">
              <Title level={3}>Interactive Card</Title>
              <p>This card responds to hover and click interactions.</p>
            </Card>
          </div>
        </section>

        {/* Typography Section */}
        <section className="showcase-section">
          <Title level={2}>Typography</Title>
          <Card padding="lg">
            <Title level={1}>Heading Level 1</Title>
            <Title level={2}>Heading Level 2</Title>
            <Title level={3}>Heading Level 3</Title>
            <Title level={4}>Heading Level 4</Title>
            <Title level={5}>Heading Level 5</Title>
            <Title level={6}>Heading Level 6</Title>
            
            <div className="typography-variants">
              <Title level={2} variant="primary">Primary Title</Title>
              <Title level={2} variant="secondary">Secondary Title</Title>
              <Title level={2} variant="muted">Muted Title</Title>
            </div>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="showcase-section">
          <Title level={2}>Inputs</Title>
          <Card padding="lg">
            <div className="input-grid">
              <Input
                label="Default Input"
                placeholder="Enter text..."
                helperText="This is a helper text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <Input
                label="With Left Icon"
                placeholder="Search..."
                icon={faSearch}
                iconPosition="left"
              />
              
              <Input
                label="With Right Icon"
                placeholder="Username"
                icon={faUser}
                iconPosition="right"
              />
              
              <Input
                label="Error State"
                placeholder="Invalid input"
                error
                errorText="This field is required"
              />
              
              <Input
                label="Success State"
                placeholder="Valid input"
                success
                helperText="Looks good!"
              />
              
              <Input
                label="Disabled"
                placeholder="Cannot edit"
                disabled
              />
            </div>
          </Card>
        </section>

        {/* Language Cards Section */}
        <section className="showcase-section">
          <Title level={2}>Language Cards</Title>
          <Card padding="lg">
            <Title level={3} align="center">Select a Language</Title>
            <div className="language-grid">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.name}
                  language={lang.name}
                  flag={lang.flag}
                  isSelected={selectedLanguage === lang.name}
                  onClick={setSelectedLanguage}
                />
              ))}
            </div>
            
            {selectedLanguage && (
              <Card variant="elevated" padding="base" className="selection-result">
                <p>
                  <strong>Selected:</strong> {selectedLanguage}
                </p>
              </Card>
            )}
          </Card>
        </section>

        {/* Compact Language Cards */}
        <section className="showcase-section">
          <Title level={2}>Compact Language Cards</Title>
          <Card padding="lg">
            <div className="compact-language-grid">
              {languages.slice(0, 3).map((lang) => (
                <LanguageCard
                  key={`compact-${lang.name}`}
                  language={lang.name}
                  flag={lang.flag}
                  variant="compact"
                  size="sm"
                  isSelected={selectedLanguage === lang.name}
                  onClick={setSelectedLanguage}
                />
              ))}
            </div>
          </Card>
        </section>

        {/* Category Cards Section */}
        <section className="showcase-section">
          <Title level={2}>Category Cards</Title>
          <Card padding="lg">
            <div className="category-grid">
              {categories.map((category) => (
                <CategoryCard
                  key={category.name}
                  category={category.name}
                  color={category.color}
                  description={category.description}
                  isSelected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                />
              ))}
            </div>
          </Card>
        </section>

        {/* NavItem Section */}
        <section className="showcase-section">
          <Title level={2}>Navigation Items</Title>
          <Card padding="lg">
            <ul className="navitem-list">
              <NavItem icon={faHome} href="/" label="Home" isActive />
              <NavItem icon={faBook} href="/lessons" label="Lessons" variant="primary" />
              <NavItem icon={faUser} href="/profile" label="Profile" variant="secondary" />
              <NavItem icon={faCog} href="/settings" label="Settings" disabled />
            </ul>
          </Card>
        </section>

        {/* Organisms Section */}
        <section className="showcase-section">
          <Title level={2}>Organisms</Title>
          
          <Title level={3}>Navigations</Title>
          <Card padding="none" className="showcase-organism">
            <Navigations variant="compact" />
          </Card>

          <Title level={3} className="mt-lg">Navbar Preview</Title>
          <Card padding="none" className="showcase-organism">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <Navbar 
                variant="primary" 
                userName="Demo User"
                showUserInfo={true}
              />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ComponentShowcase;
