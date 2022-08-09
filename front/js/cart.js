/*--------------------------------------------------------------------------------------*/
/* Functions for getting information from API directly */
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
        // An error occured
        console.log("ERREUR return data from 'getAPIElementKanap(productID)': ");
        console.log(err);
        return 102;
    });
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions in order to POST request and get response from API directly for user order */
/* Function to post order to API and get reponse from API*/
const postAPIOrder = (jsonRequest) => fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(jsonRequest)})
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        return value;
    })
    .catch(function(err) {
        // An error occured
        console.log("ERREUR return data from 'postAPIOrder(jsonRequest)': ");
        console.log(err);
        return 103;
    });
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for page 'Cart' and its dynamical modification */
/* Get list of article from LocalStorage */
const initiateCartPage = async () => {
    const localStorage = window.localStorage;
    let listOfArticleObjectFromAPI = [];
    if (localStorage.getItem("Kanap")) {
        // Set list of artciles
        listOfArticleObjectFromAPI = await setListOfArticles(JSON.parse(localStorage.getItem("Kanap")));
    };
    // Update Cart page
    const displayArticle = cartDisplay(listOfArticleObjectFromAPI);
    return listOfArticleObjectFromAPI;
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
const cartDisplay = (listOfArticle, initial = true) => {
    let innerHtmlText = '<div class="cart__item__content__description"><h2>Votre Panier est vide.</h2><p>Sélectionner nos articles exclusifs pour passer commande.</p></div>';
    let price = 0;
    let quantity = 0;
    if (!listOfArticle.length == 0) {
        if (initial) {
            innerHtmlText = ecritureInnerHTML(listOfArticle);
        };
        const total = calculTotalArticleAndPrice(listOfArticle)
        price = total.totalArticle;
        quantity = total.totalPrice;
    };
    // Modifiy innertHTML of the 'cart__items' section
    if (initial || listOfArticle.length == 0) {
        document.getElementById("cart__items").innerHTML = innerHtmlText;
    };
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
const initiateCartPageWhenQuantityChange = (listOfArticleObjectFromAPI) => {
    const listInputQuantity = document.getElementsByClassName("itemQuantity");
    for (let indexInputQuantity = 0; indexInputQuantity < listInputQuantity.length; indexInputQuantity++) {
        const inputQuantity = listInputQuantity[indexInputQuantity];
        inputQuantity.addEventListener('change', (event) => {listOfArticleObjectFromAPI = updateQuantityInLocalStorage(event, listOfArticleObjectFromAPI)});
    }
    return listOfArticleObjectFromAPI;
};

/* Function in order to suppress event article */
const initiateCartPageWhenSuppress = (listOfArticleObjectFromAPI) => {
    const listSuppress = document.getElementsByClassName("deleteItem");
    for (let indexSuppress = 0; indexSuppress < listSuppress.length; indexSuppress++) {
        const inputSuppress = listSuppress[indexSuppress];
        inputSuppress.addEventListener('click', (event) => {listOfArticleObjectFromAPI = updateQuantityInLocalStorage(event, listOfArticleObjectFromAPI)});
    }
    return listOfArticleObjectFromAPI;
};

/* Sub function in order to update LocalStorage after change in cart page and update cart page */
const updateQuantityInLocalStorage = (event, listOfArticleObjectFromAPI) => {
    // Get variable for localStorage modification
    const articleId = event.target.closest('article').dataset.id;
    const articleColor = event.target.closest('article').dataset.color;
    const localStorageKanap = JSON.parse(window.localStorage.getItem("Kanap"));
    // Modification of the localStorage quantity
    if (event.target.tagName === "INPUT") {
        const localStorageKanapObject = localStorageKanap[articleId + "_" + articleColor];
        if (parseInt(event.target.value) > 0 && parseInt(event.target.value) <= 100) {
            localStorageKanapObject.quantity = parseInt(event.target.value);
            listOfArticleObjectFromAPI = updateListOfArticle(listOfArticleObjectFromAPI, articleId, articleColor, "INPUT", localStorageKanapObject.quantity);
        } else {
            event.target.value = localStorageKanapObject.quantity;
            alert("Quantité non modifiée, la quantité doit être entre 1 et 100 article(s).");
        };
    } else if (event.target.tagName === "P") {
        delete localStorageKanap[articleId + "_" + articleColor];
        listOfArticleObjectFromAPI = updateListOfArticle(listOfArticleObjectFromAPI, articleId, articleColor, "P");
        event.target.closest('article').remove(); // DOM modification (suppress node)
    };
    window.localStorage.setItem("Kanap", JSON.stringify(localStorageKanap));
    // Call of the function to update page (price and total)
    const updateArticle = cartDisplay(listOfArticleObjectFromAPI, false); // DOM Update
    return listOfArticleObjectFromAPI;
};

/* Sub function in order to update listOfArticleObjectFromAPI after change in cart page for DOM modification */
const updateListOfArticle = (listOfArticleObjectFromAPI, articleId, articleColor, changeType, quantity = 0) => {
    for (const [articleIndex, articleValue] of Object.entries(listOfArticleObjectFromAPI)) {
        if (articleValue.article._id === articleId && articleValue.color === articleColor) {
            if (changeType === "INPUT") {
                articleValue.quantite = quantity;
            };
            if (changeType === "P") {
                listOfArticleObjectFromAPI.splice(articleIndex, 1);
            };
        };
    };
    return listOfArticleObjectFromAPI;
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for getting contact information */
/* Function in order to intialize list of alert messages */
const initiateAlertMessages = () => {
    const alertListMessages = [];
    alertListMessages.push(alertMessage(document.getElementById("firstNameErrorMsg"), "text", "Prénom"));
    alertListMessages.push(alertMessage(document.getElementById("lastNameErrorMsg"), "text", "Nom"));
    alertListMessages.push(alertMessage(document.getElementById("addressErrorMsg"), "text", "Adresse"));
    alertListMessages.push(alertMessage(document.getElementById("cityErrorMsg"), "text", "Ville"));
    alertListMessages.push(alertMessage(document.getElementById("emailErrorMsg"), "email", "Email"));
    return alertListMessages;
};

/* sub function in order to write alert message */
const alertMessage = (objet, type, texte) => {
    if (type === "text") {
        objet.textContent = `Veuillez renseigner correctement le champs '${texte}'`
    } else {
        objet.textContent = `Veuillez renseigner correctement votre '${texte}'`
    }
    return objet;
};

/* Sub function in order to manage the alert message element display */
const initiateEventForAlertMessages = (listObjets) => {
    let listInputs = [];
    for (let indexObjet = 0; indexObjet < listObjets.length; indexObjet++) {
        const objectAlertMessage = listObjets[indexObjet];
        const inputAlertMessage = objectAlertMessage.closest('div').getElementsByTagName('input')[0];
        inputAlertMessage.addEventListener('change', manageAlertMessages);
        listInputs.push(inputAlertMessage);
    }
    return {"listAlertMessages": listObjets, "listInputContact": listInputs};
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
/* Functions for getting command information */
/* Function in order to intialize command event */
const initiateEventCommand = (objectListMessagesAndInputs) => {
    const commandButton = document.getElementById("order");
    commandButton.addEventListener('click', (event) => {checkCommand(event, objectListMessagesAndInputs)});
};

/* Sub function in order to check contact and panier before command */
const checkCommand = async (event, objectListMessagesAndInputs) => {
    event.preventDefault();
    if (inputContactValid(objectListMessagesAndInputs)) {
        const dataCommande = setDataCommand(objectListMessagesAndInputs.listInputContact);
        if (dataCommande.products.length > 0 && dataCommande.products.constructor === Array) {
            const dataCommandeResponse = await postAPIOrder(dataCommande);
            if (dataCommandeResponse.orderId) {
                document.location.assign(`./confirmation.html?order=${dataCommandeResponse.orderId}#orderId`)
            } else {
                alert("Erreur lors de la commande, veuillez la renouveller.");
            }
        } else {
            alert("Votre panier est vide, veuillez sélectioner au moins un article pour réaliser une commande.");
        };
    } else {
        alert("Veuillez renseigner correctement tous les champs du formulaire.\nLes champs non valides sont identiqués par un texte orange.");
    };
}

/* Sub function to check if input are ok when command event */
const inputContactValid = (objectListMessagesAndInputs) => {
    let booleanValue = true;
    const listAlertMessages = objectListMessagesAndInputs.listAlertMessages;
    for (let indexAlertMessage = 0; indexAlertMessage < listAlertMessages.length; indexAlertMessage++) {
        if (listAlertMessages[indexAlertMessage].style.display === "block" ||
        listAlertMessages[indexAlertMessage].style.display === "") {
            booleanValue = false;
        }
    };
    return booleanValue;
};

/* Sub function in order to generate the 'contact object' and the 'article array' */
const setDataCommand = (listInputContact) => {
    const contactObject = setContactObject(listInputContact);
    const articleArray = setArticleArray();
    return {"contact": contactObject, "products": articleArray};
};

/* Sub function that generate the 'contact object' */
const setContactObject = (listInputContact) => {
    let contactObject = {};
    for (inputObject of listInputContact) {
        contactObject[inputObject.id] = inputObject.value;
    };
    return contactObject;
};

/* Sub function that generate the 'article array' */
const setArticleArray = () => {
    let articleArray = [];
    if (window.localStorage.getItem("Kanap") != null) {
        const articleInLocalStorage = JSON.parse(window.localStorage.getItem("Kanap"))
        for (const [articleKey, articleValues] of Object.entries(articleInLocalStorage)) {
            if (!articleArray.includes(articleValues.id)) {
                articleArray.push(articleValues.id);
            };
        };
    };
    return articleArray;
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Update 'cart' page with LocalStorage articles
    let setKanapCartInformation = await initiateCartPage();
    // Update 'cart' page and LocalStorage when quantity of article change
    setKanapCartInformation = initiateCartPageWhenQuantityChange(setKanapCartInformation);
    // Update 'cart' page and LocalStorage when quantity of article change
    setKanapCartInformation = initiateCartPageWhenSuppress(setKanapCartInformation);
    // Add alert messages for formulary
    const alertListMessages = initiateAlertMessages();
    const objectListMessagesAndInputs = initiateEventForAlertMessages(alertListMessages);
    // Add clic event in order to command with the creation of the object for the API POST request
    const initiateCommandEvent = initiateEventCommand(objectListMessagesAndInputs);
};

/*--------------------------------------------------------------------------------------*/
/* Launch script with main function */
main()
/*--------------------------------------------------------------------------------------*/