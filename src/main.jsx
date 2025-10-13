import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store'
import AppInitializer from './components/AppInitializer'
import './i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <App />
      </AppInitializer>
    </Provider>
  </StrictMode>,
)
