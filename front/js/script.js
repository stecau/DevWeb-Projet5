console.log("Script final du site : ne doit pas contenir de message 'log' ou 'ERREUR'");

/*--------------------------------------------------------------------------------------*/
/* Functions for getting information from API directly or from 'archived' API responses */

/* Function to get 'Product ID' by the 'Index' in the list of product directly from API */
const getAPIProductIdFromIndex = async (indexKanap) => {
    let elementKanap = await getAPIListKanaps()
    // console.log(elementKanap[indexKanap]._id);
    return elementKanap[indexKanap]._id;
};

/* Function to get 'Product ID' by the 'Index' in the list of product */
const getProductIdFromIndex = (listKanaps, indexKanap) => {
    return listKanaps[indexKanap]._id;
};

/* Function to get from the API the list of products */
const getAPIListKanaps = () => fetch("http://localhost:3000/api/products")
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
        return 101;
    });

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
/* Functions for posting order and getting information from API directly */

/*--------------------------------------------------------------------------------------*/