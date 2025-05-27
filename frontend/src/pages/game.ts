export function renderGame() {
    const content = `
        <div class="min-h-screen bg-gray-100">
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