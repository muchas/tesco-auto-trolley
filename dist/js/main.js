webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const $ = __webpack_require__(4);
const token = 'e15b7d81a129c77ca1d2ccb0603109975b5de772';
const projectName = 'Dieta';
const aliases = {
    'pomidor malinowy': 2003120446730,
    'kakao': 2003012037017,
    'banan': 2003000092998,
    'dżem': 2003120110269,
    'dżemu': 2003120110269
};
function getIngredientsList(apiKey, projectName) {
    const response = $.ajax({
        type: "POST",
        url: 'https://todoist.com/api/v7/sync',
        data: {
            resource_types: '["projects", "items"]',
            sync_token: '*',
            token: apiKey,
        },
        async: false,
    }).responseJSON;
    const project = response['projects'].find(project => project.name === projectName);
    const items = response['items']
        .filter(item => item.indent === 2 &&
        item.project_id === project.id)
        .map(item => item.content);
    return items;
}
function findProduct(productName) {
    const csrfToken = $('html').data('csrf-token');
    const response = $.ajax({
        type: "POST",
        url: "https://ezakupy.tesco.pl/groceries/pl-PL/resources",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        headers: {
            'x-csrf-token': csrfToken,
        },
        data: JSON.stringify({
            resourceNames: ["search"],
            params: {
                query: {
                    "query-small": productName,
                }
            }
        }),
    }).responseJSON;
    const items = response['search']['results']['oproductItems'].filter(p => p['product'].isForSale);
    return items[0]['product'];
}
function parseIngredient(ingredient) {
    const patterns = [
        {
            regex: /(\d+) (łyżki|łyżka|łyżek) ([a-zA-Z\sąćęłóśźż]+)/g,
            unpack: result => {
                return {
                    quantity: result[1] * 10,
                    productName: result[3],
                    quantityType: 'g',
                };
            }
        },
        {
            regex: /pół łyżki ([a-zA-Z\sąćęłóśźż]+)/g,
            unpack: result => {
                return {
                    quantity: 5,
                    productName: result[1],
                    quantityType: 'g'
                };
            }
        },
        {
            regex: /(\d+) ([a-zA-Z\sąćęłóśźż]+)/g,
            unpack: result => {
                return {
                    quantity: result[1],
                    productName: result[2],
                    quantityType: 'pcs'
                };
            }
        },
        {
            regex: /(\d+)g ([a-zA-Z\sąćęłóśźż]+)/g,
            unpack: result => {
                return {
                    quantity: result[1],
                    productName: result[2],
                    quantityType: 'g',
                };
            }
        },
        {
            regex: /(\d+)ml ([a-zA-Z\sąćęłóśźż]+)/g,
            unpack: result => {
                return {
                    quantity: result[1],
                    productName: result[2],
                    quantityType: 'ml',
                };
            }
        },
        {
            regex: /([a-zA-Z\sąćęłóśźż]+)/g,
            unpack: result => {
                return {
                    quantity: 1,
                    productName: result[1],
                    quantityType: 'pcs',
                };
            }
        }
    ];
    for (let pattern of patterns) {
        const result = pattern.regex.exec(ingredient);
        if (result !== null) {
            return pattern.unpack(result);
        }
    }
    console.log('Ingredient did not match any pattern: ' + ingredient);
}
function getProductId(productName, aliases) {
    if (productName in aliases) {
        return aliases[productName];
    }
    const product = findProduct(productName);
    if (product === null)
        return null;
    return product.id;
}
function addToTrolley(productId, quantity, unitType) {
    const csrfToken = $('html').data('csrf-token');
    const response = $.ajax({
        type: "PUT",
        url: "https://ezakupy.tesco.pl/groceries/pl-PL/trolley/items?_method=PUT",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        headers: {
            'x-csrf-token': csrfToken,
        },
        data: JSON.stringify({
            items: [{
                    id: productId,
                    newValue: quantity,
                    oldValue: 0,
                    newUnitChoice: unitType,
                    oldUnitChoice: "pcs",
                }]
        })
    });
}
function importProducts(apiKey, projectName, aliases) {
    const rawIngredients = getIngredientsList(apiKey, projectName);
    const ingredients = {};
    for (let rawIngredient of rawIngredients) {
        const ingredient = parseIngredient(rawIngredient);
        if (ingredient === undefined)
            continue;
        // const productId = getProductId(ingredient.productName, aliases);
        if (!(ingredient.productName in ingredients)) {
            ingredients[ingredient.productName] = {};
        }
        if (!(ingredient.quantityType in ingredients[ingredient.productName])) {
            ingredients[ingredient.productName][ingredient.quantityType] = 0;
        }
        ingredients[ingredient.productName][ingredient.quantityType] += parseInt(ingredient.quantity, 10);
    }
    console.log(ingredients);
}
// const rawIngredients = getIngredientsList(token, projectName);
//
// console.log(rawIngredients);
//
// const product = findProduct('jajka');
//
// console.log(product);
//
// const niveaId = '2003009955058';
//
// addToTrolley(niveaId, '3', 'pcs');
importProducts(token, projectName, aliases);


/***/ })
],[0]);