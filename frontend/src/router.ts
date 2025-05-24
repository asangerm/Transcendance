type Route = {
    path: string;
    component: () => void;
}

const routes: Route[] = [
    { path: '/', component: () => import('./pages/home').then(m => m.renderHome()) },
    { path: '/game', component: () => import('./pages/game').then(m => m.renderGame()) },
    { path: '/profile', component: () => import('./pages/profile').then(m => m.renderProfile()) }
];

export function initRouter() {
    // Handle initial route
    handleRoute();

    // Handle browser back/forward buttons
    window.addEventListener('popstate', handleRoute);

    // Handle clicks on navigation links
    document.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.matches('[data-nav]')) {
            e.preventDefault();
            const path = target.getAttribute('href') || '/';
            navigateTo(path);
        }
    });
}

function handleRoute() {
    const path = window.location.pathname;
    const route = routes.find(route => route.path === path) || routes[0];
    route.component();
}

export function navigateTo(path: string) {
    window.history.pushState({}, '', path);
    handleRoute();
} 