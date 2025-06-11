export function renderRegister() {
    const content = `
        <div class="min-h-screen flex items-center justify-center">
            <div class="max-w-md w-full mx-auto">
                <div class="bg-primary dark:bg-primary-dark rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <h2 class="text-3xl font-bold text-center mb-8">Inscription</h2>
                    
                    <form id="registerForm" class="space-y-6">
                        <!-- Username Input -->
                        <div>
                            <label for="username" class="block text-sm font-medium mb-2">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                class="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                placeholder="Choisissez un nom d'utilisateur"
                            >
                        </div>

                        <!-- Email Input -->
                        <div>
                            <label for="email" class="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                class="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                placeholder="Entrez votre email"
                            >
                        </div>

                        <!-- Password Input -->
                        <div>
                            <label for="password" class="block text-sm font-medium mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                class="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                placeholder="Créez un mot de passe"
                            >
                        </div>

                        <!-- Confirm Password Input -->
                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium mb-2">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                class="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                placeholder="Confirmez votre mot de passe"
                            >
                        </div>

                        <!-- Terms Checkbox -->
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    required
                                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300"
                                >
                            </div>
                            <div class="ml-3">
                                <label for="terms" class="text-sm text-muted dark:text-muted-dark">
                                    J'accepte les <a href="#" class="links-style">conditions d'utilisation</a>
                                    et la <a href="#" class="links-style">politique de confidentialité</a>
                                </label>
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            class="w-full button-primary"
                        >
                            S'inscrire
                        </button>

                        <!-- Login Link -->
                        <div class="text-center mt-4">
                            <span class="text-muted dark:text-muted-dark">Déjà un compte?</span>
                            <a href="/login" class="links-style">
                                Se connecter
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
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Add your registration logic here
                const username = (document.getElementById('username') as HTMLInputElement).value;
                const email = (document.getElementById('email') as HTMLInputElement).value;
                const password = (document.getElementById('password') as HTMLInputElement).value;
                const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
                const terms = (document.getElementById('terms') as HTMLInputElement).checked;
                
                if (password !== confirmPassword) {
                    alert('Les mots de passe ne correspondent pas');
                    return;
                }
                fetch('http://localhost:8000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => {
                            throw new Error(err.message || 'Une erreur est survenue');
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Inscription réussie 🎉');
                    console.log('Success:', data);
                    // Tu peux aussi rediriger :
                    // window.location.href = '/login';
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    alert(`Erreur: ${error.message}`);
                });
            });
        }
    }
} 