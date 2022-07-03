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
    let returnObject = 0;
    let texte = JSON.stringify(object);
    switch (cle) {
        case "listArticle":
            if (localStorage) {
                localStorage.setItem("listArticles", texte);
            } else {
                returnObject = 202; // Erreur l'objet n'est pas correct
            }
            returnObject = JSON.parse(localStorage.getItem("listArticles"));
            break;
        
        case "article":
            if (localStorage) {
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
    return returnObject
};

/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for page 'Product' and its dynamical modification */
/* Récupération of the ID from the URL */
const getIdFromURL = () => {
    let localUrl = new URL(window.location.href);
    const localUrlSearch = new URLSearchParams(localUrl.search);
    if (localUrlSearch.has("id")) {
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
    let texte = '<option value="">--SVP, choisissez une couleur --</option>';
    for (index in listElements) {
        texte += '<option value="' + listElements[index] + '">' + listElements[index] + '</option>';
    }
    return texte;
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Get Kanap's ID with product page URL :
    const idKanap = getIdFromURL();
    // Get Kanap element from API with its ID :
    const kanapElement = await getAPIElementKanap(idKanap);
    // Store Kanap element in the Local Storage :
    const localStorageKanap = updateLocalStorage("article", kanapElement);
    // Update 'product' page
    const setKanapInformation = updateProductPage(localStorageKanap);
};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script final de la page product : ne doit pas contenir de message 'log' ou 'ERREUR'");
main()
/*--------------------------------------------------------------------------------------*/