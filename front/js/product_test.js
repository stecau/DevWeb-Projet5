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

/* Function to get the index in the list of article from ID' */
const getRefObjectFromID = (articleList, articleID) => {
    for (index in articleList) {
        if (articleList[index]._id === articleID) {
            return articleList[index];
        }
    }
    return 002;
}

/* Création d’une fonction de test de l’objet retourné avec comparaison avec un object du fichier JSON de référence */
const validationRefVsRetourObjet = (ref, objet) =>{
    // console.log(JSON.stringify(ref));
    // console.log(JSON.stringify(objet));
    if (JSON.stringify(ref) === JSON.stringify(objet)) {
        return [true, "OK"];
    }
    return [false, "NotOK"];
}

/* Création d’une fonction de test de l'ID récupéré avec l'URL */
const validationId = (refObjet, objetURL, objetID) =>{
    const url = new URL(objetURL)
    // console.log(refObjet);
    // console.log(url);
    // console.log(objetID);
    if (objetID in refObjet) {
        // console.log(url.href);
        // console.log(url.origin + url.pathname + refObjet[objetID]);
        if (url.href === url.origin + url.pathname + refObjet[objetID]) {
            return [true, "OK"];
        } else {
            return [false, "NotOK"];
        }
    }
    return [false, "NotOK"];
}
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for getting information from API directly or from 'archived' API responses */

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
/* Functions for Local Storage */

/* functions in order to stock articles list or other object depending of the key */
const updateLocalStorage = (cle, object) => {
    let localStorage = window.localStorage;
    // console.log("Local Storage :");
    // console.log(localStorage);
    let returnObject = 0;
    // console.log("Stockage dans le local storage de la liste des articles disponibles à la vente :")
    let texte = JSON.stringify(object);
    switch (cle) {
        case "listArticle":
            if (localStorage) {
                // console.log("Local Storage - texte:");
                // console.log(texte);
                localStorage.setItem("listArticles", texte);
            } else {
                returnObject = 202; // Erreur l'objet n'est pas correct
            }
            returnObject = JSON.parse(localStorage.getItem("listArticles"));
            break;
        
        case "article":
            if (localStorage) {
                // console.log("Local Storage - texte:");
                // console.log(texte);
                localStorage.setItem("article", texte);
            } else {
                returnObject = 202; // Erreur l'objet n'est pas correct
            }
            returnObject = JSON.parse(localStorage.getItem("article"));
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
/* Functions for page 'Product' and its dynamical modification */
/* Récupération of the ID from the URL */
const recuperationIdFromURL = () => {
    let localUrl = new URL(window.location.href);
    // console.log(localUrl);
    const localUrlSearch = new URLSearchParams(localUrl.search);
    // console.log(localUrlSearch);
    if (localUrlSearch.has("id")) {
        // console.log(localUrlSearch.get("id"));
        return localUrlSearch.get("id");
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

    // Récupération de l'ID du Kanap avec l'url de la page :
    const idKanap = recuperationIdFromURL();
    console.log("Local URL - article ID : idKanap");
        // console.log(idKanap);
    console.log("    Validation de l'objet retourné : " + validationId(refListObjets.refListIDvsURL, window.location.href, idKanap));

    // Recupération de l'objet Kanap par l'API avec son ID :
    const kanapElement = await getAPIElementKanap(idKanap);
    console.log("API - objet retourné : kanapElement");
        // console.log(kanapElement);
    console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(getRefObjectFromID(refListObjets.refListObjets, idKanap), kanapElement));

    // Stockage de l'objet canapé dans le Local Storage :
    const localStorageKanap = updateLocalStorage("article", kanapElement);
    console.log("Local Storage - objet retourné : localStorageKanap");
        // console.log(localStorageKanap);
    console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(getRefObjectFromID(refListObjets.refListObjets, idKanap), localStorageKanap));

    // Modification de la page produit :
    // const affichageListKanaps = updateAccueilPage(localStorageKanap);
    // console.log("Update page Acceuil - objet parent mis à jour :");
        // console.log(affichageListKanaps.innerHTML);
    // console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(refListObjets.innerHTML, affichageListKanaps.innerHTML));

    // Définition des évènements de clic sur les articles
    // ...









};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script Test de la page produit :");
console.log("----    LANCEMENT du MAIN    ----");
main()
setTimeout(() => {
    console.log("----      FIN du Script      ----");
  }, "1000")
/*--------------------------------------------------------------------------------------*/