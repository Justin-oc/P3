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

    // Vérification si les champs sont vides. Affiche un message d'erreur si l'un des champs est vide et arrête l'exécution
    if (!userEmail || !userPassword) {
        messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
        return;
    }

     // Vérification du format de l'email
     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
     if (!emailRegex.test(userEmail)) {
         messageError.textContent = "L'adresse email n'est pas valide";
         return;
     }
 
     // Préparation des données à envoyer
     const login = {
         email: userEmail,
         password: userPassword,
     };
 
     // Conversion en JSON
     const user = JSON.stringify(login);
 
     // Envoi de la requête
     fetch("http://localhost:5678/api/users/login", {
         method: "POST",
         mode: "cors",
         credentials: "same-origin",
         headers: { "Content-Type": "application/json" },
         body: user,
     })
     .then((response) => {
         if (!response.ok) {
             return response.json().then((error) => {
                 messageError.textContent = "Erreur lors de la connexion : " + error.message;
                 throw new Error(`Erreur lors de la requête : ${error.message}`);
             });
         }
         return response.json();
     })
     .then((data) => {
         const { userId, token: userToken } = data;
         // Stockage dans sessionStorage
         window.sessionStorage.setItem("token", userToken);
         window.sessionStorage.setItem("userId", userId);
         window.sessionStorage.setItem("loged", "true");
 
         // Redirection après connexion
         window.location.href = "../index.html";
     })
     .catch((error) => {
         console.error("Une erreur s'est produite lors de la récupération des données", error);
         messageError.textContent = "Une erreur s'est produite. Veuillez réessayer.";
     });
 });


    