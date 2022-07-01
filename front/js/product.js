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
    // Récupération de l'ID du Kanap avec l'url de la page :
    const idKanap = recuperationIdFromURL();
    // Recupération de l'objet Kanap par l'API avec son ID :
    const kanapElement = await getAPIElementKanap(idKanap);
    // Stockage de l'objet canapé dans le Local Storage :
    const localStorageKanap = updateLocalStorage("article", kanapElement);
};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script final de la page product : ne doit pas contenir de message 'log' ou 'ERREUR'");
main()
/*--------------------------------------------------------------------------------------*/