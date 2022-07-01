/*--------------------------------------------------------------------------------------*/
/* Functions for testing */

/* Function to get the reference for comparison' */
const getRefObjets = () => fetch("../../test/refListObjets.json")
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(value => {
        // console.log("Return data from 'getAPIListKanap()': ");
        // console.log(value);
        return value;
    })
    .catch(function(err) {
        // Une erreur est survenue
        console.log("ERREUR return data from 'getAPIListKanap()': ");
        console.log(err);
        return 001;
    });

/* Création d’une fonction de test de l’objet retourné avec comparaison avec un object du fichier JSON de référence */
const validationRefVsRetourObjet = (ref, objet) =>{
    // console.log(JSON.stringify(ref));
    // console.log(JSON.stringify(objet));
    if (JSON.stringify(ref) === JSON.stringify(objet)) {
        return [true, "OK"];
    }
    return [false, "NotOK"];
}

/* Création d’une fonction de test des URLs renvoyées par les clics event et l'ID de l'article */
const validationUrlEtID = async (objetURL, objetID) =>{
    // console.log(objetURL);
    // console.log(objetID);
    // console.log(objetURL.split("?id="));
    const refListObjets = await getRefObjets();
    // console.log(refListObjets.refListObjets);
    for (index in refListObjets.refListObjets) {
        // console.log(refListObjets.refListObjets[index]._id);
        // console.log(objetID);
        // console.log(objetURL.split("?id=")[1]);
        // console.log(refListObjets.refListObjets[index]._id);
        if (refListObjets.refListObjets[index]._id === objetID &&
            objetURL.split("?id=")[1] === refListObjets.refListObjets[index]._id) {
                return [true, "OK"];
        }
    }
    return [false, "NotOK"];
}

/*--------------------------------------------------------------------------------------*/
/* Functions for getting information from API directly or from 'archived' API responses */

/* Function to get 'Product ID' by the 'Index' in the list of product directly from API */
const getAPIProductIdFromIndex = async (indexKanap) => {
    let elementKanap = await getAPIListKanaps()
    // console.log(elementKanap[indexKanap]._id);
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
        // console.log("Return data from 'getAPIListKanap()': ");
        // console.log(value);
        return value;
    })
    .catch(function(err) {
        // Une erreur est survenue
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
        // console.log("Return data from 'getAPIElementKanap(productID)': ");
        // console.log(value);
        return value;
    })
    .catch(function(err) {
        // Une erreur est survenue
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
    // console.log("Local Storage :");
    // console.log(localStorage);
    let returnObject = 0;
    switch (cle) {
        case "listArticle":
            // console.log("Stockage dans le local storage de la liste des articles disponibles à la vente :")
            let texte = JSON.stringify(object);
            if (localStorage) {
                // console.log("Local Storage - texte:");
                // console.log(texte);
                localStorage.setItem("listArticles", texte);
            } else {
                returnObject = 202; // Erreur l'objet n'est pas correct
            }
            returnObject = JSON.parse(localStorage.getItem("listArticles"));
            break;

        default:
            if (!returnObject === 0) {
                returnObject = 201;
            };
    };
    // console.log("Local Storage - objet retourné :");
    // console.log(JSON.parse(returnObject));
    return returnObject
};

/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for page 'Accueil' and its dynamical modification */

/* Function in order to modify the 'accueil' page */
const updateAccueilPage = (listElements) => {
    const parentContainer = document.getElementById("items");
    // console.log("Update page Acceuil - parentContainer :");
    // console.log(parentContainer);
    parentContainer.innerHTML = ecritureInnerHTML(listElements);

    return parentContainer;
};

/* Sub Function in order to write the innerHTML text */
const ecritureInnerHTML = (listElements) => {
    // console.log("Update page Acceuil - liste des objets :");
    // console.log(listElements);
    let texte = "";
    for (index in listElements) {
        // console.log("Element ${i} :");
        // console.log(listElements[index]._id);
        // console.log(listElements[index].imageUrl);
        // console.log(listElements[index].altTxt);
        // console.log(listElements[index].name);
        // console.log(listElements[index].description);
        texte += '<a href="./product.html?id=' + listElements[index]._id + '">';
        texte += '<article><img src="' + listElements[index].imageUrl + '" alt="' + listElements[index].altTxt + '">';
        texte += '<h3 class="productName">' + listElements[index].name + '</h3>';
        texte += '<p class="productDescription">' + listElements[index].description + '</p>';
        texte += '</article>';
        texte += '</a>';
        // console.log(texte);
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
    console.log("CLIC!!!");
    console.log(event.currentTarget.href);
    const urlClicked = new URL(event.currentTarget.href)
    const urlClickedSearch = new URLSearchParams(urlClicked.search);
    if (urlClickedSearch.has("id")) {
        const urlId = urlClickedSearch.get("id");
        // console.log(urlId);
        // Verification :
        const verifUrlEtId = await validationUrlEtID(event.currentTarget.href, urlId);
        console.log("    Validation de l'URL et de l'ID' : " + verifUrlEtId);
        // window.open(urlClicked, "_self");
    } else {
        console.log("Aie");
        return 302;
    }
}


/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Recupération de la référence :
    const refListObjets = await getRefObjets();
        // console.log(refListObjets)

    // Recupération de la liste des canapés de Kanap :
    const listKanapElements = await getAPIListKanaps();
    console.log("API - objet retourné : listKanapElements");
        // console.log(listKanapElements);
    console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(refListObjets.refListObjets, listKanapElements));

    // Stockage de la liste dans le Local Storage :
    const localStorageListKanaps = updateLocalStorage("listArticle", listKanapElements);
    console.log("Local Storage - objet retourné : localStorageListKanaps");
        // console.log(localStorageListKanaps);
    console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(refListObjets.refListObjets, localStorageListKanaps));

    // Modification de la page d'Accueil :
    const affichageListKanaps = updateAccueilPage(localStorageListKanaps);
    console.log("Update page Acceuil - objet parent mis à jour :");
        // console.log(affichageListKanaps.innerHTML);
    console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(refListObjets.innerHTML, affichageListKanaps.innerHTML));

    // Définition des évènements de clic sur les articles
    const parentContainer = document.getElementById("items")
    console.log("Definition of the event clic for all items in #items block :");
        // console.log(parentContainer);
    const returnAddEventListenerToItems = addEventListenerToItems(parentContainer);
        // console.log(returnAddEventListenerToItems);







    let indexKanap = 0;
    console.log("====");
    console.log("Le 1er Kanap de la liste est (en interrogeant l'API directement):");
    let idKanap = await getAPIProductIdFromIndex(indexKanap);
    let KanapElement2 = await getAPIElementKanap(idKanap);
    console.log(KanapElement2);
    console.log("====");

    console.log("====");
    console.log("Le 1er Kanap de la liste est (sans interroger l'API):");
    let idKanapSansAPI = getProductIdFromIndex(listKanapElements, indexKanap);
    let KanapElement2SansAPI = await getAPIElementKanap(idKanapSansAPI);
    console.log(KanapElement2SansAPI);
    console.log("====");

};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script Test du site :");
console.log("----    LANCEMENT du MAIN    ----");
main()
setTimeout(() => {
    console.log("----      FIN du Script      ----");
  }, "1000")
/*--------------------------------------------------------------------------------------*/
