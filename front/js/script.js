/*--------------------------------------------------------------------------------------*/
/* Functions for getting information from API directly or from 'archived' API responses */

/* Function to get from the API the list of products */
const getAPIListKanaps = () => fetch("http://localhost:3000/api/products")
    .then(res => {
        if (res.ok) {
            return res.json();
        }
    })
    .then(value => {
        return value;
    })
    .catch(function(err) {
        console.log("ERREUR return data from 'getAPIListKanap()': ");
        console.log(err);
        return 101;
    });
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Functions for page 'Accueil' and its dynamical modification */

/* Function in order to modify the 'accueil' page */
const updateAccueilPage = (listElements) => {
    const parentContainer = document.getElementById("items");
    parentContainer.innerHTML = ecritureInnerHTML(listElements);

    return parentContainer;
};

/* Sub Function in order to write the innerHTML text */
const ecritureInnerHTML = (listElements) => {
    let texte = ``;
    for (index in listElements) {
        texte += 
`<a href="./product.html?id=${listElements[index]._id}">
    <article>
        <img src="${listElements[index].imageUrl}" alt="${listElements[index].altTxt}">
        <h3 class="productName">${listElements[index].name}</h3>
        <p class="productDescription">${listElements[index].description}</p>
    </article>
</a>`;
    }
    return texte;
};
/*--------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------*/
/* Function MAIN of the web site */
const main = async () => {
    // Get API response for object list
    const listKanapElements = await getAPIListKanaps();
    // Update 'accueil' page
    const affichageListKanaps = updateAccueilPage(listKanapElements);
};

/*--------------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------------*/
/* Lancement script with main function */
console.log("Script final du site : ne doit pas contenir de message 'log' ou 'ERREUR'");
main()
/*--------------------------------------------------------------------------------------*/