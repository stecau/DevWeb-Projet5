/*--------------------------------------------------------------------------------------*/
/* Functions for page 'confirmation' and its dynamical modification */
/* Get ID from the URL */
const getIdFromURL = () => {
    let localUrl = new URL(window.location.href);
    const localUrlSearch = new URLSearchParams(localUrl.search);
    if (localUrlSearch.has("order")) {
        return localUrlSearch.get("order");
    } else {
        console.log(`Don't manage getting ID from URL : ${window.location.href}`);
        return 302;
    }
};

/* Function in order to modify the 'product' page */
const initiateConfirmationPage = (idKanapOrder) => {
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
    const setKanapOrderInformation = initiateConfirmationPage(idKanapOrder);
    // Empty cart in localStorage
    window.localStorage.removeItem("Kanap");
    console.log(setKanapOrderInformation);
};

/*--------------------------------------------------------------------------------------*/
/* Launch script with main function */
main()
/*--------------------------------------------------------------------------------------*/
