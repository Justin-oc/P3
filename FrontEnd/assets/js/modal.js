//Fonction ouverture modale 1 et ajout de l'overlay
const overlay = document.querySelector('.overlay')
const modalContainer = document.querySelector('.modal-container')

const openModal = function () {
    overlay.classList.remove('hidden')
    modalContainer.classList.remove('hidden')
    modalContainer.setAttribute('display', 'flex')
}

//Fonction fermeture modale
const closeModal = function () {
    overlay.classList.add('hidden')
    modalContainer.classList.add('hidden')
    modalContainer.removeAttribute('display', 'flex')
}

//Création fonction affichage des works dans la modale Ajout photo à destination du fichier script
function generateWork() {
    getWorks().then(data => {
        
      data.forEach(work => {
            const worksId = work.id
                const modalGallery = document.querySelector('.modalGallery')
                const figure = document.createElement('figure');
                figure.classList.add(`figure-${worksId}`);
                //Création des balises <img> et <figcaption>
                const imageWork = document.createElement('img');
                imageWork.src = work.imageUrl;
                imageWork.alt = work.title
                const trashIcon = document.createElement("div")
                trashIcon.classList.add("trash-icon")
                trashIcon.innerHTML= `<i class="fa-solid fa-trash-can" id="${work.id}"></i>`
                // Affichage des "work" séléctionné en les rattachant à la balise <div> du HTML
                modalGallery.appendChild(figure);
                figure.appendChild(imageWork);
                figure.appendChild(trashIcon); 

                trashIcon.addEventListener('click', (event) => {
                    deleteWorks(event, worksId)
                });
            });
        });
    }
                
              



//Fonction ouverture modale 2 sur click 'Ajouter une photo'
const addContentModal = document.querySelector('.addContentModal')

const openModal2 = function () {
    modalContainer.classList.remove('display','flex')
    modalContainer.classList.add('hidden')
    addContentModal.classList.remove('hidden')
    addContentModal.classList.add('display','flex')
    resetModal2();
} 

//Fonction fermeture modale 2
const closeModal2 = function () {
    overlay.classList.add('hidden')
    addContentModal.classList.add('hidden')
    addContentModal.removeAttribute('display', 'flex')
    resetModal2();
}

//Fonction retour sur la modale 1
const returnModal1 = function () {
    resetModal2();
    closeModal2();
    openModal();
}


//Fonction suppression travaux
async function deleteWorks(event, worksId) {
   let monToken = sessionStorage.getItem('token');
    const deleteConfirmation = confirm("Souhaitez-vous vraiment supprimer ce projet ?")
    // Si confirmation :
    if (deleteConfirmation) {
      try {
        const deleteFetch = await fetch(`http://localhost:5678/api/works/${worksId}`,
          {
            method: "DELETE",
            headers: {Authorization: `Bearer ${monToken}`,
            },
          }
        );
        // Si suppresion ok
        if (deleteFetch.ok) {
          const figure = document.querySelector(`#work-${worksId}`);
          if (figure) {
             figure.remove();
          }
          refreshGallery()
          event.preventDefault();
          alert("Projet supprimé !");
          console.log("Travail supprimé");
       } else {
          console.error("Erreur lors de la suppression.");
       }
    } catch (error) {
       alert('Suppression impossible, une erreur est survenue');
    }
 }
}

// Fonction pour rafraîchir la galerie après suppression
function refreshGallery() {
  const modalGallery = document.querySelector('.modalGallery');
  if (modalGallery) {
     modalGallery.innerHTML = ""; // Réinitialise la galerie
     generateWork(); // Recharge les travaux depuis le serveur
  }
}



//Ajout de photo par la modale 
function choosePhoto () {
    document.getElementById('fileInput').addEventListener('change', () => {
      let file = fileInput.files[0];

      //Vérfication si fichier sélectionné est conforme
      let maxSize = 4 * 1024 * 1024;
      let allowedFormats = ['image/jpg','image/jpeg','image/png'];
      if(file.size <= maxSize && allowedFormats.includes(file.type)) {
        //Création du FileReader pour lire le nouveau ficher
        const fileReader = new FileReader();
        //Lecture et traitement du nouveau fichier
        fileReader.onload = () => { 
          const imagePreview = document.querySelector('.imagePreview')
          const iconAddPic = document.querySelector('.fa-image')
          const labelInputFile = document.querySelector('.labelFileInput')
          const textInputFile = document.querySelector('.addPicContainer p')
          //Affichage du nouveau fichier
          iconAddPic.style.display = 'none';
          labelInputFile.style.display = 'none';
          textInputFile.style.display = 'none';
          
          imagePreview.src = fileReader.result
          imagePreview.style.display = 'flex';
        }
        fileReader.readAsDataURL(file)

        //Message d'erreur si le taille de la photo ne correspond pas 
      } else if (file.size > maxSize){
        alert("L'image est trop volumineuse")
        //Message d'erreur si le format de la photo ne correspond pas
      } else {
        alert("Le format du projet ne correspond pas !")
        console("Le format du projet ne correspond pas !")
      };
    });
}



function postNewFile() {
  const btnValidatePic = document.querySelector('.btnValidatePic');
  const fileInput = document.getElementById('fileInput');
  const titleInput = document.getElementById('title');
  const categoryInput = document.getElementById('category');
  let monToken = sessionStorage.getItem('token');

  btnValidatePic.addEventListener('click', async (event) => {
      event.preventDefault();

      if (fileInput.value === "" || titleInput.value.trim() === "" || categoryInput.value === "") {
          alert("Il semblerait que certaines informations soient manquantes");
      } else {
          const postConfirmation = confirm("Voulez-vous importer votre projet ?");
          if (postConfirmation) {
              // Création et remplissage de FormData pour envoyer les données du formulaire
              const formData = new FormData();
              formData.append('category', categoryInput.value); // Ajout de la catégorie
              formData.append('image', fileInput.files[0]); // Ajout du fichier
              formData.append('title', titleInput.value.trim()); // Ajout du titre avec un trim pour éliminer les espaces inutiles

              try {
                  const response = await fetch("http://localhost:5678/api/works", {
                      method: "POST",
                      headers: {
                          accept: "application/json", // Pas besoin d'utiliser 'Content-Type' pour FormData, car il est géré automatiquement
                          Authorization: `Bearer ${monToken}`,
                      },
                      body: formData,
                  });

                  if (response.ok) {
                      alert("Projet ajouté !");
                      const newWork = await response.json();

                      // Remise à zéro des champs et retour à l'affichage
                      resetModal2(); // Réinitialisation de la modale
                      returnModal1(); // Retour à la première modale
                      addNewWorkToModal(newWork); // Ajout à la galerie de la modale
                      addNeworkToIndex(newWork); // Ajout à la galerie principale du site
                  } else {
                      console.error("Erreur lors de l'ajout du projet.");
                  }
              } catch (error) {
                  alert("Une erreur est survenue lors de l'ajout du projet.");
                  console.error(error);
              }
          }
      }
  });
}

//Fonction permettant de vider la modale N°2 pour l'ajout de photo à la fermeture de la modale ou au retour de la modale gallery
function resetModal2() {
  const imagePreview = document.querySelector('.imagePreview')
  const iconAddPic = document.querySelector('.fa-image')
  const labelInputFile = document.querySelector('.labelFileInput')
  const textInputFile = document.querySelector('.addPicContainer p')
  const titleForm = document.getElementById('title');
  const categoryForm = document.getElementById('category');

  imagePreview.style.display = 'none'
  titleForm.value = ""
  categoryForm.value = ""

  iconAddPic.style.display = 'flex';
  labelInputFile.style.display = 'flex';
  textInputFile.style.display = 'flex';

  const validateBtn = document.querySelector('.btnValidatePic');
  validateBtn.disabled = true 
  validateBtn.style.background = "#A7A7A7";
  validateBtn.style.cursor = "default"
  
}


//Fonction d'ajout du nouveau fichier a la gallery modale
async function addNewWorkToModal (newWork) {
        // @SUGGESTION : Il est possible d'utiliser la logique de la fonction generateWork pour éviter la répétition de code.
      const newWorkId = newWork.id
      const modalGallery = document.querySelector('.modalGallery')
      //Création balise <figure>
      const figure = document.createElement ('figure')
      figure.classList.add (`figure-${newWork.id}`);
      //Création balise <img>
      const imageNewWork = document.createElement('img');
      imageNewWork.src = newWork.imageUrl;
      imageNewWork.alt = newWork.title;
      //Création balise <i>
      const trashIcon = document.createElement("div");
      trashIcon.classList.add("trash-icon");
      trashIcon.innerHTML= `<i class="fa-solid fa-trash-can" id="${newWork.id}"></i>`;
      // Affichage des "work" séléctionné en les rattachant à la balise <div> du HTML
      modalGallery.appendChild(figure);
      figure.appendChild(imageNewWork);
      figure.appendChild(trashIcon);

      trashIcon.addEventListener('click', async (event) => {
        deleteWorks(event, newWorkId)
  });
}

async function addNeworkToIndex(newWork) {
      const gallery = document.querySelector('.gallery')
      //Création balise <figure>
      const figure = document.createElement ('figure')
      figure.classList.add (`figure-${newWork.id}`);
      //Création balise <img> et <figcaption>
      const imageNewWork = document.createElement('img');
      imageNewWork.src = newWork.imageUrl;
      imageNewWork.alt = newWork.title;
      const figCaption = document.createElement('figcaption');
      figCaption.innerText = newWork.title;
      // Affichage des "work" séléctionné en les rattachant à la balise <div> du HTML
      gallery.appendChild(figure);
      figure.appendChild(imageNewWork);
      figure.appendChild(figCaption);
}


// Fonction appel

const btnOpen = document.querySelector('.btnOpen')
const btnClose = document.querySelector('.btnClose')
const btnAddmodale = document.querySelector('.btnAddmodale')
// const overlay = document.querySelector('.overlay')
const btnClose2 = document.querySelector('.btnClose2')
const arrowReturn = document.querySelector('.arrowReturn')


//Gestion des évènements pour ouverture modale 1
btnOpen.addEventListener ('click', openModal);

//Ajout des works dans modale
generateWork();

//Gestion des évènements pour fermeture modale 1
btnClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//Ouverture modale 2 au click sur bouton "Ajouter une photo"
btnAddmodale.addEventListener('click', openModal2)

//Gestion des évènements pour fermeture modale 2
btnClose2.addEventListener('click', closeModal2)
overlay.addEventListener('click', closeModal2);

//Gestion des évènements pour retour modale 1
arrowReturn.addEventListener('click', returnModal1)


// Ajout de la partie catégorie de la modale en JS
async function createOptionCategory () {

    const categories = await getCategories();
    //Récupération des categories
    const optionCategory = document.getElementById('category')
    optionCategory.innerHTML ='';
    //Création de la catégorie vide avant choix
    const emptyOption = document.createElement ('option');
    emptyOption.value = '';
    emptyOption.textContent = '';
    optionCategory.appendChild(emptyOption);
    // Création de cahque categorie dans le formulaire de la modale d'ajout
    categories.forEach (function(category){
        const option = document.createElement ('option');
        option.value = category.id;
        option.textContent = category.name
        optionCategory.appendChild(option);
    })
}

createOptionCategory();

//Création dela fonction pour fonctionnement du bouton de validation d'ajout de photo
const disabledValidateBtn = function () {
    const photoForm = document.getElementById('fileInput');
    const titleForm = document.getElementById('title');
    const categoryForm = document.getElementById('category');
    const validateBtn = document.querySelector('.btnValidatePic');
  
    // Vérification des champs, s'ils sont vides ou non
    if (photoForm.value.trim() === "" || titleForm.value.trim() === "" || categoryForm.value.trim() === "") {
      validateBtn.disabled = true 
      validateBtn.style.background = "#A7A7A7";
      validateBtn.style.cursor = "default"
    } else {
      validateBtn.disabled = false; 
      validateBtn.style.background = "#1D6154";
      validateBtn.style.cursor = "pointer"
    }
  };
  
  // Ajout des écouteurs d'événements pour chaque champ de formulaire
  document.getElementById('fileInput').addEventListener('change', disabledValidateBtn);
  document.getElementById('title').addEventListener('change', disabledValidateBtn);
  document.getElementById('category').addEventListener('change', disabledValidateBtn);
  
  // Appel initial pour vérifier l'état des champs du formulaire lors du chargement de la page
  disabledValidateBtn();

  //Import du nouveau fichier avant de le poster
  choosePhoto();

  //Post du nouveau fichier
  postNewFile();