export function renderLogin() {
    const content = `
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
            <div class="max-w-md w-full mx-auto">
                <div class="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Connexion</h2>
                    
                    <form id="loginForm" class="space-y-6">
                        <!-- Username/Email Input -->
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                                Nom d'utilisateur ou Email
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                placeholder="Entrez votre nom d'utilisateur"
                            >
                        </div>

                        <!-- Password Input -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                placeholder="Entrez votre mot de passe"
                            >
                        </div>

                        <!-- Remember Me Checkbox -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300"
                                >
                                <label for="remember" class="ml-2 block text-sm text-gray-700">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-800 transition-all duration-300">
                                Mot de passe oublié?
                            </a>
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
                        >
                            Se connecter
                        </button>

                        <!-- Sign Up Link -->
                        <div class="text-center mt-4">
                            <span class="text-gray-600">Pas encore de compte?</span>
                            <a href="register" class="text-blue-600 hover:text-blue-800 ml-1 transition-all duration-300">
                                S'inscrire
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = content;
        
        // Add form submission handler
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Add your login logic here
                const username = (document.getElementById('username') as HTMLInputElement).value;
                const password = (document.getElementById('password') as HTMLInputElement).value;
                const remember = (document.getElementById('remember') as HTMLInputElement).checked;
                
                console.log('Login attempt:', { username, password, remember });
                // Add your authentication logic here
            });
        }
    }
} 