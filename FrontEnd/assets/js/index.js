if (!window.fetch) {
    alert("Your browser does not support fetch API");
}

/* Objet data pour stocker les works et les catégories de manière globale */
const data = {
    works: [],
    categories: []
};

/* Éléments du DOM pour la galerie et les boutons de catégories */
const filters = document.querySelector(".container-filters");

window.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    data.works = await getWorks();
    /* Appel de la fonction pour afficher les images */
    displayWorks();

    data.categories = await getCategories();

    if (!token) {
        // Appel de la fonction pour ajouter les categories
        displayCategories();
    } else {
        //Changement text login en logout
        const logOutLink = document.querySelector(".logout");
        logOutLink.innerText ="logout";
        logOutLink.href = ""
        //Ajout bouton modifier
        const btnOpen = document.querySelector('.btnOpen')
        btnOpen.classList.remove("hidden")
    }

});
//Création de la fonction Logout
const logOutLink = document.querySelector('.logout')

logOutLink.addEventListener('click', logout);
//Lancement de la fonction logout avec redirection sur l'index.HTML et suppresion du Token
function logout (){
    window.sessionStorage.removeItem('token')
    location.reload("index.html");
}

function getToken() {
    return window.sessionStorage.getItem("token");
}


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
async function displayWorks(works = data.works) {
    const gallery = document.querySelector(".gallery");

    /* Suppression du block gallery */
    gallery.innerHTML = "";

    /* Pour chaque work dans le tableau, j'appel la fonction qui correspond */
    works.forEach((work) => {
        const figure = createWork(work);
        gallery.appendChild(figure);
    });
}

/* Fonction pour créer les différents works */
function createWork(work) {
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
    return figure;
}

async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error("Erreur de récupération des catégories via l'API.");
        }
        return await response.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

function displayCategories(categories = data.categories) {
    const filtersContainer = document.querySelector(".container-filters");
    const all = { id: 0, name: "Tous" };
    const button = createFilter(all);
    filtersContainer.appendChild(button);

    // Ajouter un bouton pour chaque catégorie
    categories.forEach((category) => {
        const button = createFilter(category);
        filtersContainer.appendChild(button);
    });
}

function createFilter(category) {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.dataset.categoryId = category.id;
    button.classList.add("filter-button");

    // Associe un événement click sur chaque bouton pour filtrer les works
    button.addEventListener("click", () => {
        filterWorksByCategory(category.id);
    });

    return button;
}



// fonction pour afficher les oeuvres en fonction des catégories
function filterWorksByCategory(categoryId) {
    // Filtre les œuvres en fonction de l'ID de la catégorie
    const filteredWorks = categoryId ? data.works.filter(work => work.categoryId === categoryId) : data.works;
    displayWorks(filteredWorks);  // Affiche uniquement les œuvres filtrées
}
