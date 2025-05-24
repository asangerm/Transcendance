export function renderProfile() {
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
                    <h1 class="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-20 h-20 bg-gray-300 rounded-full"></div>
                            <div>
                                <h2 class="text-xl font-semibold">Username</h2>
                                <p class="text-gray-500">Player since 2024</p>
                            </div>
                        </div>
                        <div class="border-t pt-4">
                            <h3 class="text-lg font-semibold mb-2">Statistics</h3>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-center">
                                    <p class="text-2xl font-bold">0</p>
                                    <p class="text-gray-500">Wins</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-2xl font-bold">0</p>
                                    <p class="text-gray-500">Losses</p>
                                </div>
                                <div class="text-center">
                                    <p class="text-2xl font-bold">0</p>
                                    <p class="text-gray-500">Games</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = content;
    }
}