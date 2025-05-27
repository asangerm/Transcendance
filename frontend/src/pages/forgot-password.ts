export function renderForgotPassword() {
    const content = `
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
            <div class="max-w-md w-full mx-auto">
                <div class="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Réinitialisation du mot de passe</h2>
                    
                    <form id="forgotPasswordForm" class="space-y-6">
                        <div>
                            <p class="text-gray-600 mb-6 text-center">
                                Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
                            </p>
                        </div>

                        <!-- Email Input -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                placeholder="Entrez votre email"
                            >
                        </div>

                        <!-- Submit Button -->
                        <button
                            type="submit"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02]"
                        >
                            Envoyer le lien
                        </button>

                        <!-- Back to Login Link -->
                        <div class="text-center mt-4">
                            <a href="login" class="text-blue-600 hover:text-blue-800 transition-all duration-300">
                                Retour à la connexion
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
        const form = document.getElementById('forgotPasswordForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = (document.getElementById('email') as HTMLInputElement).value;
                
                // Afficher un message de confirmation
                alert('Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.');
                console.log('Password reset requested for:', email);
                // Add your password reset logic here
            });
        }
    }
} 