/*--------------------------------------------------------------------------------------*/
/* Functions for page 'confirmation' and its dynamical modification */
/* Get ID from the URL */
const getIdFromURL = () => {
    let localUrl = new URL(window.location.href);
    const localUrlSearch = new URLSearchParams(localUrl.search);
    if (localUrlSearch.has("order")) {
        return localUrlSearch.get("order");
    } else {
        console.log("Aie");
        return 302;
    }
}

/* Function in order to modify the 'product' page */
const updateConfirmationPage = (idKanapOrder) => {
    // title, <!-- Nom du produit -->
    const orderSpan = document.getElementById("orderId");
    orderSpan.textContent = idKanapOrder;
    return "!!!!! Fin du Projet Kanap !!!!!";
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the 'confirmation page' */
const main = async () => {
    // Get Order number with 'confirmation' page URL :
    const idKanapOrder = getIdFromURL();
    // Update 'product' page
    const setKanapOrderInformation = updateConfirmationPage(idKanapOrder);
    // Empty cart in localStorage
    window.localStorage.removeItem("Kanap");
    console.log(setKanapOrderInformation);
};

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script final de la page confirmation : ne doit pas contenir de message 'log' ou 'ERREUR'");
main()
/*--------------------------------------------------------------------------------------*/
