export function renderGame() {
    const content = `
        <div class="min-h-screen bg-gray-100">
            <nav class="bg-white shadow-lg">
                <div class="max-w-6xl mx-auto px-4">
                    <div class="flex justify-between">
                        <div class="flex space-x-7">
                            <a href="/" data-nav class="flex items-center py-4">
                                <span class="font-semibold text-gray-500 text-lg">ft_transcendence</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <main class="container mx-auto px-4 py-8">
                <div class="bg-white p-8 rounded-lg shadow-md">
                    <h1 class="text-3xl font-bold text-gray-800 mb-4">Pong Game</h1>
                    <div id="gameCanvas" class="w-full h-96 bg-black rounded-lg">
                        <!-- Game canvas will be inserted here -->
                    </div>
                </div>
            </main>
        </div>
    `;

    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = content;
        // Game logic will be implemented here
    }
} 