// Selection des balises du formulaire

const emailInput = document.querySelector("form #email");
const passwordInput = document.querySelector("form #password");
const loginForm = document.querySelector("form");
const messageError = document.querySelector(".login p");

// Login
// Ajout d'un écouteur d'événement pour le formulaire de connexion
loginForm.addEventListener("submit", (e) => {
    
    // Empêche que le formulaire de connexion recharge la page 
    e.preventDefault();

    // Récupère les valeurs des champs email et password saisies par l'utilisateur 
    const userEmail = emailInput.value;
    const userPassword = passwordInput.value;

    // Vérification si les champs sont vides. Affiche un message d'erreur 
    // si l'un des champs est vide et arrête l'exécution
    if (!userEmail || !userPassword) {
        messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
        return;
    }

    // Préparation des données à envoyer au serveur sous forme d'objet JSON 
    const login = {
        email: userEmail,
        password: userPassword,
    };

    