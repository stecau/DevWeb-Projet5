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
};

/* Création d’une fonction de test du Local Storage avec comparaison avec un object du fichier JSON de référence */
const validationRefVsLocalStorage = (ref, objet, inc) => {
    localStorageKanap = objet.getItem("Kanap");
    for (key in ref[inc]) {
        // console.log(key);
        // console.log(ref[inc][key]);
        // console.log(JSON.parse(objet.getItem(key)));
        const objetLocalStorage = JSON.parse(localStorageKanap)
        if (ref[inc][key].id !== objetLocalStorage[key].id || ref[inc][key].color !== objetLocalStorage[key].color
            || ref[inc][key].quantity !== objetLocalStorage[key].quantity) {
                return [false, "NotOK"];
        }
    }
    return [true, "OK"];
}

/* Création de la fonction de test du local storage avec changement quantité puis supression : */
const testChangeQuantityOrSuppress = async (inc, type) => {
    const refListObjets = await getRefObjets();
    if (type === "change") {
        console.log(`Local Storage - objet retourné : localStorage pour incrément ${inc} pour le changement de quantité`);
            // console.log(refListObjets.refListLocalStorage[inc]);
        console.log("    Validation de l'objet retourné : " + validationRefVsLocalStorage(refListObjets.refListLocalStorageChangeQuantity, window.localStorage, inc));
        console.log("    Validation du contenu de la page (liste des articles) : " + validationRefVsRetourObjet(refListObjets.innerHTML["cartChangeQuantity" + (inc + 1).toString(10)], document.getElementById("cart__items").innerHTML));
        console.log("    Validation du contenu de la page (total) : " + validationRefVsRetourObjet(refListObjets.innerHTML["totalChange" + (inc + 1).toString(10)], document.getElementsByClassName("cart__price")[0].innerHTML));
    }
    if (type === "suppress") {
        console.log(`Local Storage - objet retourné : localStorage pour incrément ${inc} pour la suppression`);
            // console.log(refListObjets.refListLocalStorage[inc]);
        console.log("    Validation de l'objet retourné : " + validationRefVsLocalStorage(refListObjets.refListLocalStorageSupress, window.localStorage, inc));
        console.log("    Validation du contenu de la page (liste des articles) : " + validationRefVsRetourObjet(refListObjets.innerHTML["cartSuppress" + (inc + 1).toString(10)], document.getElementById("cart__items").innerHTML));
        console.log("    Validation du contenu de la page (total) : " + validationRefVsRetourObjet(refListObjets.innerHTML["totalSuppress" + (inc + 1).toString(10)], document.getElementsByClassName("cart__price")[0].innerHTML));
    }
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
/* Functions for page 'Cart' and its dynamical modification */
/* Get list of article from LocalStorage */
const updateCartPage = async (localStorage) => {
    let listOfArticleObjectFromAPI = [];
    if (localStorage.getItem("Kanap")) {
        // Set list of artciles
        listOfArticleObjectFromAPI = await setListOfArticles(JSON.parse(localStorage.getItem("Kanap")));
    };
    // Update Cart page
    const displayArticle = cartDisplay(listOfArticleObjectFromAPI);
};

/* Sub function in order to set the list of article to show in cart page */
const setListOfArticles = async (localStorageKanap) => {
    const listOfArticle = [];
    for (const localStorageObject of Object.values(localStorageKanap)) {
        // Get article information from API with its ID and store data in list
        listOfArticle.push({
            "article": await getAPIElementKanap(localStorageObject.id),
            "color": localStorageObject.color,
            "quantite": localStorageObject.quantity
        });
    };
    return listOfArticle;
};

/* Sub Function in order to write the innerHTML text and text content */
const cartDisplay = (listOfArticle) => {
    let innerHtmlText = '<div class="cart__item__content__description"><h2>Votre Panier est vide.</h2><p>Sélectionner nos articles exclusifs pour passer commande.</p></div>';
    let price = 0;
    let quantity = 0;
    if (!listOfArticle.length == 0) {
        innerHtmlText = ecritureInnerHTML(listOfArticle);
        const total = calculTotalArticleAndPrice(listOfArticle)
        price = total.totalArticle;
        quantity = total.totalPrice;
    };
    // Modifiy innertHTML of the 'cart__items' section
    document.getElementById("cart__items").innerHTML = innerHtmlText;
    // Modifiy textcontent of the 'cart__price' div
    document.getElementById("totalQuantity").textContent = price;
    document.getElementById("totalPrice").textContent = quantity;
};

/* Sub Function in order to write the innerHTML text */
const ecritureInnerHTML = (listElements) => {
    let texte = ``;
    for (const element of Object.values(listElements)) {
        texte += 
`<article class="cart__item" data-id="${element.article._id}" data-color="${element.color}">
    <div class="cart__item__img">
        <img src="${element.article.imageUrl}" alt="${element.article.altTxt}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${element.article.name}</h2>
            <p>${element.color}</p>
            <p>${element.article.price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantite}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
        </div>
    </div>
</article>`;
    }
    return texte;
};

/* Sub Function in order to get the total of articles and the total price */
const calculTotalArticleAndPrice = (listElements) => {
    let totalArticle = 0;
    let totalPrice = 0;
    for (const element of Object.values(listElements)) {
        totalArticle += element.quantite;
        totalPrice += element.quantite * element.article.price;
    }
    return {"totalArticle": totalArticle, "totalPrice": totalPrice};
};

/* sub function in order to be able to show alert message */
const alertMessage = (objet, type, texte) => {
    if (type === "text") {
        objet.textContent = `Veuillez renseigner correctement le champs '${texte}'`
    } else {
        objet.textContent = `Veuillez renseigner correctement votre '${texte}'`
    }
}


/*--------------------------------------------------------------------------------------*/
/* Function when changement occurs in cart page */
/* Function in order to get quantity event change in article */
const updateCartPageWhenQuantityChange = () => {
    const listInputQuantity = document.getElementsByClassName("itemQuantity");
    for (let indexInputQuantity = 0; indexInputQuantity < listInputQuantity.length; indexInputQuantity++) {
        const inputQuantity = listInputQuantity[indexInputQuantity];
        inputQuantity.addEventListener('change', updateQuantityInLocalStorage);
    }
};

/* Function in order to suppress event article */
const updateCartPageWhenSuppress = () => {
    const listSuppress = document.getElementsByClassName("deleteItem");
    for (let indexSuppress = 0; indexSuppress < listSuppress.length; indexSuppress++) {
        const inputSuppress = listSuppress[indexSuppress];
        inputSuppress.addEventListener('click', updateQuantityInLocalStorage);
    }
};

/* Sub function in order to update LocalStorage after change in cart page and update cart page */
const updateQuantityInLocalStorage = (event) => {
    // Get variable for localStorage modification
    const articleId = event.target.closest('article').dataset.id;
    const articleColor = event.target.closest('article').dataset.color;
    const localStorageKanap = JSON.parse(window.localStorage.getItem("Kanap"));
    // Modification of the localStorage quantity
    if (event.target.tagName === "INPUT") {
        const localStorageKanapObject = localStorageKanap[articleId + "_" + articleColor];
        localStorageKanapObject.quantity = parseInt(event.target.value);
    } else if (event.target.tagName === "P") {
        delete localStorageKanap[articleId + "_" + articleColor];
    };
    window.localStorage.setItem("Kanap", JSON.stringify(localStorageKanap));
    // Call of the function to update page (price and total)
    main();
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Recupération de la référence :
    const refListObjets = await getRefObjets();
        // console.log(refListObjets)

    // Update 'cart' page with LocalStorage articles
    const setKanapCartInformation = await updateCartPage(window.localStorage);
    console.log("Update cart page with LocalStorage");
        // console.log(window.localStorage);
    console.log("    Validation de l'objet retourné : " + validationRefVsRetourObjet(refListObjets.innerHTML.cart, document.getElementById("cart__items").innerHTML));
    console.log("    Validation du contenu de la page (liste des articles) : " + validationRefVsRetourObjet(refListObjets.innerHTML["cart"], document.getElementById("cart__items").innerHTML));
    console.log("    Validation du contenu de la page (total) : " + validationRefVsRetourObjet(refListObjets.innerHTML["total"], document.getElementsByClassName("cart__price")[0].innerHTML));
    // Update 'cart' page and LocalStorage when quantity of article change
    const setKanapWhenQuantityChange = updateCartPageWhenQuantityChange();
    // Update 'cart' page and LocalStorage when quantity of article change
    const setKanapWhenSuppress = updateCartPageWhenSuppress();

    // Add alert messages for formulary
    let alertListMessages = [];
    alertListMessages.push(alertMessage(document.getElementById("firstNameErrorMsg"), "text", "Prénom"));
    alertListMessages.push(alertMessage(document.getElementById("lastNameErrorMsg"), "text", "Nom"));
    alertListMessages.push(alertMessage(document.getElementById("addressErrorMsg"), "text", "Adresse"));
    alertListMessages.push(alertMessage(document.getElementById("cityErrorMsg"), "text", "Ville"));
    alertListMessages.push(alertMessage(document.getElementById("emailErrorMsg"), "email", "Email"));

    

};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script Test de la page Cart :");
console.log("----    LANCEMENT du MAIN    ----");
main()
setTimeout(() => {
    console.log("----      FIN du Script      ----");
  }, "1000")
/*--------------------------------------------------------------------------------------*/