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
/* Function in order to intialize alert messages */
const initializationAlertMessages = () => {
    const alertListMessages = [];
    alertListMessages.push(alertMessage(document.getElementById("firstNameErrorMsg"), "text", "Prénom"));
    alertListMessages.push(alertMessage(document.getElementById("lastNameErrorMsg"), "text", "Nom"));
    alertListMessages.push(alertMessage(document.getElementById("addressErrorMsg"), "text", "Adresse"));
    alertListMessages.push(alertMessage(document.getElementById("cityErrorMsg"), "text", "Ville"));
    alertListMessages.push(alertMessage(document.getElementById("emailErrorMsg"), "email", "Email"));
    return alertListMessages;
};


/* sub function in order to be able to show alert message */
const alertMessage = (objet, type, texte) => {
    if (type === "text") {
        objet.textContent = `Veuillez renseigner correctement le champs '${texte}'`
    } else {
        objet.textContent = `Veuillez renseigner correctement votre '${texte}'`
    }
    return objet;
};

/* Sub function in order to manage the alert message element display */
const initializationEventForAlertMessages = async (listObjets) => {
    for (let indexObjet = 0; indexObjet < listObjets.length; indexObjet++) {
        const objectAlertMessage = listObjets[indexObjet];
        const inputAlertMessage = objectAlertMessage.closest('div').getElementsByTagName('input')[0];
        inputAlertMessage.addEventListener('change', manageAlertMessages);
    }
};

/* Sub function managing the display of the message alert with regex */
const manageAlertMessages = (event) => {
    const inputAlert = event.target;
    const objectAlert = inputAlert.closest('div').getElementsByTagName('p')[0];
    if (inputAlert.type == "text") {
        if (inputAlert.id == "address") {
            objectAlert.style.display = isInputValidated(inputAlert, "Address");
        } else {
            objectAlert.style.display = isInputValidated(inputAlert, "Text");
        };
    } else if (inputAlert.type == "email") {
        objectAlert.style.display = isInputValidated(inputAlert, "Email");
    };
};

/* Sub function for testing regex format of input */
const isInputValidated = (inputObject, inputFormatExpected) => {
    if (inputObject.value !== "") {
        const regexpText = new RegExp('[0123456789]+');
        const regexpAddress = new RegExp('^[0123456789]+[, ]+');
        const regexpEmail = /[a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~.]+@[a-zA-Z0-9]+\.[a-z]+/g;
        if ((inputFormatExpected === "Text" && !regexpText.test(inputObject.value)) ||
        (inputFormatExpected === "Address" && regexpAddress.test(inputObject.value)) ||
        (inputFormatExpected === "Email" && isEmailValid(inputObject.value, regexpEmail))) {
            return "none";
        };
    };
    return "block";
};

/* Sub function for length of Email with return value of regexpEmail */
const isEmailValid = (inputEmail, regexpEmail) => {
    if (regexpEmail.test(inputEmail)) {
        const emailLength = inputEmail.length;
        if (regexpEmail[Symbol.match](inputEmail) != null) {
            const regexpEmailLength = regexpEmail[Symbol.match](inputEmail)[0].length;
            return emailLength === regexpEmailLength;
        };
    };
    return false;
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Update 'cart' page with LocalStorage articles
    const setKanapCartInformation = await updateCartPage(window.localStorage);
    // Update 'cart' page and LocalStorage when quantity of article change
    const setKanapWhenQuantityChange = updateCartPageWhenQuantityChange();
    // Update 'cart' page and LocalStorage when quantity of article change
    const setKanapWhenSuppress = updateCartPageWhenSuppress();
    // Add alert messages for formulary
    let alertListMessages = initializationAlertMessages();
    alertListMessages = initializationEventForAlertMessages(alertListMessages);
    // Add clic event in order to command with the creation of the object for the API POST request

    

};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script final de la page product : ne doit pas contenir de message 'log' ou 'ERREUR'");
main()
/*--------------------------------------------------------------------------------------*/