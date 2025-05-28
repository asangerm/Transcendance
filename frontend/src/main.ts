import './styles/global.css';
import { initRouter } from './router';
import { renderHome } from './pages/home';
import { initializeNavigation } from './navigation';
import { initializeTheme } from './theme';

// Initialize the theme
initializeTheme();

// Initialize the router
initRouter();

// Initial render
renderHome();

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
});