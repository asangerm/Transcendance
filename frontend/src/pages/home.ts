export function renderHome() {
    const content = `
        <div class="min-h-screen bg-gray-100">
            <main class="container mx-auto px-4 py-8">
                <div class="bg-white p-8 rounded-lg shadow-md">
                    <h1 class="text-3xl font-bold text-gray-800 mb-4">Welcome to ft_transcendence</h1>
                    <p class="text-gray-600">Ready to play some Pong?</p>
                    <button id="playButton" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Play Now
                    </button>
                </div>
            </main>
        </div>
    `;

    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = content;
        
        // Add event listener to the play button
        const playButton = document.getElementById('playButton');
        if (playButton) {
            playButton.addEventListener('click', () => {
                import('../router').then(m => m.navigateTo('/game'));
            });
        }
    }
} 