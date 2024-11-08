if (!window.fetch) {
    alert("Your browser does not support fetch API");
}

/* Éléments du DOM pour la galerie et les boutons de catégories */
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".container-filters");

/* Fonction asynchrone pour récupérer les images de la gallerie via le backend */
async function getWorks() {
    try {
        /* Demande à l'API de m'envoyer les images */
        const response = await fetch("http://localhost:5678/api/works");

        /* vérification de la demande */
        if (!response.ok) {
            throw new Error("Erreur de récupération des images via l'API.");
        }

        /* Si la réponse est OK, je la retourne en tant que JSON */
        return await response.json();
    } catch (error) {

        /*  Si erreur message erreur */
        console.error(error.message);
        /* Tableau vide car pas d'images récupérées */
        return [];
    }
}

/* Fonction asynchrone pour afficher les œuvres (works) */
async function displayWorks() {
    /* Récupération des images via l'API */
    const works = await getWorks();

    /* Suppression du block gallery */
    gallery.innerHTML = "";

    /* Pour chaque work dans le tableau, j'appel la fonction qui correspond */
    works.forEach((work) => {
        createWorks(work);
    });
}
/* Appel de la fonction pour afficher les images */
displayWorks();

/* Fonction pour créer les différents works */
function createWorks(work) {
    /* Crée un élément <figure> pour chaque works */
    const figure = document.createElement("figure");

    /* Crée un élément <img> pour afficher l'image */
    const img = document.createElement("img");

    /* Crée un élément <figcaption> pour afficher la caption */
    const figcaption = document.createElement("figcaption");

    /* Définit l'attribut src de l'élément img avec l'URL de l'image de l'œuvre */
    img.src = work.imageUrl;

    /* Définit le contenu textuel de l'élément "figcaption" avec le titre de l'œuvre */
    figcaption.textContent = work.title;

    /* Ajoute l'élément img comme enfant de l'élément figure */
    figure.appendChild(img);

    /* Ajoute l'élément figcaption comme enfant de l'élément figure */
    figure.appendChild(figcaption);

    /* Ajoute l'élément figure comme enfant de l'élément avec la classe "gallery" */
    gallery.appendChild(figure);
}