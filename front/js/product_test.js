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
const validationId = (refObjet, objetURL, objetID) => {
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

const validationPageProduitRefVsRetourObjet = (objetID, refObjets, objetList) => {
    // console.log(objetID);
    // console.log(refObjets[objetID]);
    // console.log(objetList);
    let listKeys = ["image", "name", "price", "description", "colors"];
    let listBoolean = [];
    for (index in objetList) {
        // console.log(objetList[index]);
        // console.log(objetList[index].outerHTML);
        // console.log(refObjets[objetID][listKeys[index]]);
        // console.log(refObjets[objetID][listKeys[index]] === objetList[index].outerHTML);
        listBoolean.push(refObjets[objetID][listKeys[index]] === objetList[index].outerHTML);
        // console.log(listBoolean);
    }
    if (!listBoolean.includes(false)) {
        return [true, "OK"];
    }
    return [false, "NotOK"];
}

/* Création d’une fonction de test du Local Storage avec comparaison avec un object du fichier JSON de référence */
const validationRefVsLocalStorage = (ref, objet, inc) => {
    for (key in ref[inc]) {
        // console.log(key);
        // console.log(ref[inc][key]);
        // console.log(JSON.parse(objet.getItem(key)));
        const objetLocalStorage = JSON.parse(objet.getItem(key))
        if (ref[inc][key].id !== objetLocalStorage.id || ref[inc][key].color !== objetLocalStorage.color
            || ref[inc][key].quantity !== objetLocalStorage.quantity) {
                return [false, "NotOK"];
        }
    }
    return [true, "OK"];
}

/* Création de la fonction de test du local storage : */
const testLocalStorage = async (inc) => {
    const refListObjets = await getRefObjets();
    // 1er test avec le premier canapé en blue et quantité à 1 :
    console.log(`Local Storage - objet retourné : localStorage pour incrément ${inc}`);
    // console.log(refListObjets.refListLocalStorage[inc]);
    console.log("    Validation de l'objet retourné : " + validationRefVsLocalStorage(refListObjets.refListLocalStorage, window.localStorage, inc));
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
const getIdFromURL = () => {
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

/* Function in order to modify the 'product' page */
const updateProductPage = (elementKanap) => {
    // item__img, <!-- <img src="../images/logo.png" alt="Photographie d'un canapé"> -->
    const containerImgSrc = document.getElementsByClassName("item__img")[0];
    const childImg = createImg(containerImgSrc, elementKanap.imageUrl, elementKanap.altTxt)
    // title, <!-- Nom du produit -->
    const titleData = document.getElementById("title");
    titleData.textContent = elementKanap.name;
    // price, <!-- 42 -->
    const priceData = document.getElementById("price")
    priceData.textContent = elementKanap.price;
    // description, <!-- Dis enim malesuada risus sapien gravida nulla nisl arcu. -->
    const descriptionData = document.getElementById("description");
    descriptionData.textContent = elementKanap.description;
    // colors, children of (boucle car plusieurs couleurs) = <!-- <option value="vert">vert</option> -->
    const colorData = document.getElementById("colors");
    colorData.innerHTML = ecritureInnerHTML(elementKanap.colors);

    return [childImg, titleData, priceData, descriptionData, colorData];
};

/* Sub Function in order to write the innerHTML text for img */
const ecritureInnerHTMLForImg = (src, alt) => {
    let texte = '<img src="' + src + '" alt="' + alt + '">';
    return texte;
};

/* Sub Function in order to create img */
const createImg = (parent, src, alt) => {
    const newImg = document.createElement("img");
    newImg.src = src;
    newImg.alt = alt;
    parent.appendChild(newImg);
    return newImg;
};

/* Sub Function in order to write the innerHTML text for colors */
const ecritureInnerHTML = (listElements) => {
    // console.log(listElements);
    let texte = `<option value="">--SVP, choisissez une couleur --</option>`;
    for (index in listElements) {
        texte += `<option value="${listElements[index]}">${listElements[index]}</option>`;
    }
    // console.log(texte);
    return texte;
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for Local Storage and store article in the cart */
/* Function to add click event and define the behaviour */
const storeCartInLocalStorage = () => {
    const addToCartButton = document.getElementById("addToCart");
    addToCartButton.addEventListener("click", getSelectedParameter);
};

/* Function to get the article options from the page */
const getSelectedParameter = async (event) => {
    const colorSelector = document.getElementById("colors");
    const quantitySelector = document.getElementById("quantity");
    if (!colorSelector.value == "" && parseInt(quantitySelector.value, 10) > 0) {
        storeSelectedParameterInLocalStorage(colorSelector.value, parseInt(quantitySelector.value, 10));
    } else {
        // Affichage message pour choisir une color et une quantité
        console.log("pb");
    }
};

/* Sub function to store article in Local Storage */
const storeSelectedParameterInLocalStorage = (color, quantity) => {
    let localStorage = window.localStorage;
    let id = getIdFromURL();
    if (localStorage.getItem(id + "_" + color)) {
        // L'article est dans le panier avec l'option de couleur choisie => on augmente la quantité
        quantity = JSON.parse(localStorage.getItem(id + "_" + color)).quantity + quantity;
    };
    let item = {"id": id, "quantity": quantity, "color": color};
    localStorage.setItem(id + "_" + color, JSON.stringify(item));
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Recupération de la référence :
    const refListObjets = await getRefObjets();
        // console.log(refListObjets)

    // Récupération de l'ID du Kanap avec l'url de la page :
    const idKanap = getIdFromURL();
    console.log("Local URL - article ID : idKanap");
        // console.log(idKanap);
    console.log("    Validation de l'objet retourné : " + validationId(refListObjets.refListIDvsURL, window.location.href, idKanap));

    // Recupération de l'objet Kanap par l'API avec son ID :
    const kanapElement = await getAPIElementKanap(idKanap);
    console.log("API - objet retourné : kanapElement");
        // console.log(kanapElement);
    console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(getRefObjectFromID(refListObjets.refListObjets, idKanap), kanapElement));

    // Modification de la page produit :
    const setKanapInformation = updateProductPage(kanapElement);
    console.log("Update page Produit - plusieurs objets mis à jour :");
        // console.log(setKanapInformation);
    console.log("    Validation de l'objet retourné : " + validationPageProduitRefVsRetourObjet(idKanap, refListObjets.innerHTML.produit, setKanapInformation));

    // Stockage de l'objet canapé dans le Local Storage lors d'un click :
    const articleInLocalStorage = storeCartInLocalStorage();
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