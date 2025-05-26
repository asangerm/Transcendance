import './styles/global.css';
import { initRouter } from './router';
import { renderHome } from './pages/home';

// Initialize the router
initRouter();

// Initial render
renderHome();