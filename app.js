// ****** SÉLECTIONNE LES ÉLÉMENTS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".shopping-form");
const shopping = document.getElementById("shopping");
const submitBtn = document.querySelector(".submit-btn");
const listContainer = document.querySelector(".list-container");
const list = document.querySelector(".shoppingList");
const clearBtn = document.querySelector(".clear-btn");

// option d'édition
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
// soumettre le formulaire
form.addEventListener("submit", addItem);

// vider la liste
clearBtn.addEventListener("click", clearItems);

// charger les éléments
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FONCTIONS **********
// ajoute un élément
function addItem(e) {
  e.preventDefault();
  const value = shopping.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    // display alert
    displayAlert("Article ajouté", "success");
    // show shoppingList
    listContainer.classList.add("show-listContainer");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("article modifié", "success");
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Veuillez entrer une valeur", "danger");
  }
}

// affiche une alerte
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // Cache une alerte
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
//  reset les paramètres
function setBackToDefault() {
  shopping.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "ajouter";
  shopping.focus();
}

// vide la liste
function clearItems() {
  const items = document.querySelectorAll(".shopping-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  listContainer.classList.remove("show-listContainer");
  displayAlert("Liste vide", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}
// supprime un élément
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    listContainer.classList.remove("show-listContainer");
  }
  displayAlert("Article supprimé", "danger");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

// setup le mode édition
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  shopping.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "éditer";
  shopping.focus();
}

// ****** LOCAL STORAGE **********
// ajoute dans le local storage
function addToLocalStorage(id, value) {
  const shopping = { id, value };
  let items = getLocalStorage();

  items.push(shopping);
  localStorage.setItem("list", JSON.stringify(items));
}

// supprime dans le local storage
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id != id) {
      return item;
    }
  });
}

// édite dans le local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// récupère dans le local storage
function getLocalStorage() {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// ****** SETUP ITEMS **********
// affiche les éléments récupéré du local  storage
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    listContainer.classList.add("show-listContainer");
  }
}

// crée et insère un élément dans le DOM
function createListItem(id, value) {
  const element = document.createElement("article");
  // add class
  element.classList.add("shoppingItem");
  // add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="text">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");

  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}
