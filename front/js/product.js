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
/* Functions for page 'Product' and its dynamical modification */
/* Get ID from the URL */
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
    let texte = `<option value="">--SVP, choisissez une couleur --</option>`;
    for (index in listElements) {
        texte += `<option value="${listElements[index]}">${listElements[index]}</option>`;
    }
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
    // Get Kanap's ID with product page URL :
    const idKanap = getIdFromURL();
    // Get Kanap element from API with its ID :
    const kanapElement = await getAPIElementKanap(idKanap);
    // Update 'product' page
    const setKanapInformation = updateProductPage(kanapElement);
    // Add click event on button in order to User add article to cart
    const articleInLocalStorage = storeCartInLocalStorage();
    

};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script final de la page product : ne doit pas contenir de message 'log' ou 'ERREUR'");
main()
/*--------------------------------------------------------------------------------------*/