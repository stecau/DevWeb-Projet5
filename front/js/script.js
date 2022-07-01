/*--------------------------------------------------------------------------------------*/
/* Functions for getting information from API directly or from 'archived' API responses */

/* Function to get 'Product ID' by the 'Index' in the list of product directly from API */
const getAPIProductIdFromIndex = async (indexKanap) => {
    let elementKanap = await getAPIListKanaps()
    return elementKanap[indexKanap]._id;
};

/* Function to get 'Product ID' by the 'Index' in the list of product */
const getProductIdFromIndex = (listKanaps, indexKanap) => {
    return listKanaps[indexKanap]._id;
};

/* Function to get from the API the list of products */
const getAPIListKanaps = () => fetch("http://localhost:3000/api/products")
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(value => {
        return value;
    })
    .catch(function(err) {
        console.log("ERREUR return data from 'getAPIListKanap()': ");
        console.log(err);
        return 101;
    });

/* Function to get the products object based on its 'id' from API */
const getAPIElementKanap = (productID) => fetch("http://localhost:3000/api/products/" + productID)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        return value;
    })
    .catch(function(err) {
        console.log("ERREUR return data from 'getAPIElementKanap(productID)': ");
        console.log(err);
        return 102;
    });

/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for posting order and getting information from API directly */


/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for Local Storage */

/* functions in order to stock articles list or other object depending of the key */
const updateLocalStorage = (cle, object) => {
    let localStorage = window.localStorage;
    let returnObject = 0;
    switch (cle) {
        case "listArticle":
            let texte = JSON.stringify(object);
            if (localStorage) {
                localStorage.setItem("listArticles", texte);
            } else {
                returnObject = 202; // Erreur le local storage n'est pas accessible
            }
            returnObject = JSON.parse(localStorage.getItem("listArticles"));
            break;

        default:
            if (!returnObject === 0) {
                returnObject = 201;
            };
    };
    return returnObject
};

/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for page 'Accueil' and its dynamical modification */

/* Function in order to modify the 'accueil' page */
const updateAccueilPage = (listElements) => {
    const parentContainer = document.getElementById("items");
    parentContainer.innerHTML = ecritureInnerHTML(listElements);

    return parentContainer;
};

/* Sub Function in order to write the innerHTML text */
const ecritureInnerHTML = (listElements) => {
    let texte = "";
    for (index in listElements) {
        texte += '<a href="./product.html?id=' + listElements[index]._id + '">';
        texte += '<article><img src="' + listElements[index].imageUrl + '" alt="' + listElements[index].altTxt + '">';
        texte += '<h3 class="productName">' + listElements[index].name + '</h3>';
        texte += '<p class="productDescription">' + listElements[index].description + '</p>';
        texte += '</article>';
        texte += '</a>';
    }
    return texte;
};

/* Function in order to add event listener to articles */
const addEventListenerToItems = (object) => {
    if (object.hasChildNodes()) {
        for (element of object.childNodes) {
            element.addEventListener("click", clicOnItems);
        }
        return 0
    } else {
        return 301;
    }
}

/* Function in order to store article ID from URL */
const clicOnItems = async (event) => {
    event.preventDefault();
    const urlClicked = new URL(event.currentTarget.href)
    const urlClickedSearch = new URLSearchParams(urlClicked.search);
    if (urlClickedSearch.has("id")) {
        const urlId = urlClickedSearch.get("id");
        window.open(urlClicked, "_self");
    } else {
        console.log("Aie");
        return 302;
    }
}
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Get API response for object list
    const listKanapElements = await getAPIListKanaps();
    // Store API response in Local Strorage
    const localStorageListKanaps = updateLocalStorage("listArticle", listKanapElements);
    // Update 'accueil' page
    const affichageListKanaps = updateAccueilPage(localStorageListKanaps);
    // Add event 'click' on articles
    const parentContainer = document.getElementById("items")
    const returnAddEventListenerToItems = addEventListenerToItems(parentContainer);

};

/*--------------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script final du site : ne doit pas contenir de message 'log' ou 'ERREUR'");
main()
/*--------------------------------------------------------------------------------------*/