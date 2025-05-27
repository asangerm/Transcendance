export function renderGameSelection() {
    const content = `
        <div class="min-h-screen bg-gray-100">
            <main class="container mx-auto px-4 py-8">
                <h1 class="text-4xl font-bold text-center text-gray-800 mb-12">Sélection des Jeux</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    <!-- Pong Game Card -->
                    <a href="/game" class="group">
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div class="relative aspect-video bg-gray-900">
                                <img 
                                    src="../../images/pong-image.jpg" 
                                    alt="Pong Game" 
                                    class="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-90"
                                >
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                    <span class="text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Jouer au Pong
                                    </span>
                                </div>
                            </div>
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 mb-2">Pong</h2>
                                <p class="text-gray-600">Le classique jeu de tennis de table revisité</p>
                            </div>
                        </div>
                    </a>

                    <!-- Second Game Card -->
                    <a href="/game" class="group">
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <div class="relative aspect-video bg-gray-900">
                                <img 
                                    src="../../images/ageOfWar.jpg" 
                                    alt="Second Game" 
                                    class="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-90"
                                >
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                    <span class="text-white text-2xl font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Jouer au Jeu 2
                                    </span>
                                </div>
                            </div>
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 mb-2">Jeu 2</h2>
                                <p class="text-gray-600">Description du deuxième jeu</p>
                            </div>
                        </div>
                    </a>
                </div>
            </main>
        </div>
    `;

    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = content;
    }
} 