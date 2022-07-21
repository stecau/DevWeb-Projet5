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
    const listOfArticleObjectFromAPI = [];
    for (let index = 0; index < localStorage.length; index++) {
        const localStorageObject = JSON.parse(localStorage.getItem(localStorage.key(index)));
        // Get article information from API with its ID and store data in list
        listOfArticleObjectFromAPI.push({
            "article": await getAPIElementKanap(localStorageObject.id),
            "color": localStorageObject.color,
            "quantite": localStorageObject.quantity
        });
    }
    // Modifiy innertHTML of the 'cart__items' section
    const parentContainer = document.getElementById("cart__items");
    parentContainer.innerHTML = ecritureInnerHTML(listOfArticleObjectFromAPI);
    // Modifiy textcontent of the 'cart__price' div
    const total = calculTotalArticleAndPrice(listOfArticleObjectFromAPI)
    document.getElementById("totalQuantity").textContent = total.totalArticle;
    document.getElementById("totalPrice").textContent = total.totalPrice;
}

/* Sub Function in order to write the innerHTML text */
const ecritureInnerHTML = (listElements) => {
    let texte = ``;
    for (index in listElements) {
        texte += 
`<article class="cart__item" data-id="${listElements[index].article._id}" data-color="${listElements[index].color}">
    <div class="cart__item__img">
        <img src="${listElements[index].article.imageUrl}" alt="${listElements[index].article.altTxt}">
    </div>
    <div class="cart__item__content">
        <div class="cart__item__content__description">
            <h2>${listElements[index].article.name}</h2>
            <p>${listElements[index].color}</p>
            <p>${listElements[index].article.price} €</p>
        </div>
        <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${listElements[index].quantite}">
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
    for (index in listElements) {
        totalArticle += listElements[index].quantite;
        totalPrice += listElements[index].quantite * listElements[index].article.price;
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