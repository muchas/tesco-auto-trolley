import * as $ from 'jquery';
import patterns from './patterns';
import { findProduct, getProduct, addToTrolley, resetTrolley } from './tesco_api';

const aliases = {
  'borówki amerykańskie': 2003000323849,
  'maślanki': 2003009324991,
  'łosoś wędzony na gorąco': 2003120030450,
  'margaryny': 2003008546929,
  'margaryna': 2003008546929,
  'mleka': 2003011767861,
  'mleko': 2003011767861,
  'oleju kokosowego': 2003120731663,
  'olej kokosowy': 2003120731663,
  'pomidor malinowy': 2003120446730,
  'twaróg półtłusty': 2003008032767,
  'kakao': 2003012037017,
  'banan': 2003000092998,
  'dżem': 2003120110269,
  'dżemu': 2003120110269,
  'jogurt grecki': 2003120431563,
  'serek almette z chrzanem': 2003000022971,
  'Activia jogurt jagodowy': 2003011693597,
  'płatków owsianych błyskawicznych': 2003005726553,
  'płatki migdałowe': 2003009778855,
  'płatków migdałowych': 2003009778855,
  'wód mineralnych': 2003000004236,
  'woda mineralna': 2003000004236,
  'activia jagoda': 2003011693597,
};

function getIngredientsList(apiKey: string, projectName: string, callback) {
    return $.ajax({
        type: "POST",
        url: 'https://todoist.com/api/v7/sync',
        data: {
          resource_types: '["projects", "items", "labels"]',
          sync_token: '*',
          token: apiKey,
        },
    }).then((data) => {
      const label = data['labels'].find(label => label.name === "produkt");
      const project = data['projects'].find(project => project.name === projectName);
      const isIngredient = (item) => {
          return item.project_id === project.id &&
          (item.indent === 2 || item.labels.find(e => e === label.id) !== undefined);
      };
      const items = data['items']
                      .filter(isIngredient)
                      .map(item => item.content);

      return callback(items);
    });
}

function parseIngredient(ingredient: string, patterns) {
  for (let pattern of patterns) {
    pattern.regex.lastIndex = 0; // reset regex
    const result = pattern.regex.exec(ingredient);
    if (result !== null) {
      const unpacked = pattern.unpack(result);
      unpacked.quantity = parseFloat(unpacked.quantity);
      return unpacked;
    }
  }

  console.log('Ingredient did not match any pattern: ' + ingredient);
}


function getProductObject(productName, aliases, callback) {
    if (productName in aliases) {
        return getProduct(aliases[productName], callback);
    }

    return findProduct(productName, callback);
}


function unifyQuantity(product, quantity: number, quantityType) {
  if (quantityType === "pcs") return quantity;
  if (quantityType === "g" || quantityType === "ml") {
    const productAverageWeight = product.averageWeight * 1000;
    return quantity / productAverageWeight;
  } else {
    console.log(`Could not recognize quantityType: ${quantityType}`);
  }
}


function makeSaveProduct(products, ingredient) {
  return (product) => {
    if (product == null || product == undefined) {
      console.log('Product not found ' + ingredient.productName);
      return;
    }

    if (!(product.id in products)) products[product.id] = 0;
    products[product.id] += unifyQuantity(product, ingredient.quantity, ingredient.quantityType);
  }
}


function makeParseIngredients(callback) {
  return (rawIngredients) => {
    const promises = [];
    const products = {};

    for(let rawIngredient of rawIngredients) {
        const ingredient = parseIngredient(rawIngredient, patterns);

        if (ingredient === undefined) {
          console.log(`Could not parse ingredient ${rawIngredient}`);
          continue;
        }

        const promise = getProductObject(ingredient.productName,
                                         aliases,
                                         makeSaveProduct(products, ingredient));
        promises.push(promise);
    }

    return Promise.all(promises).then(() => {
      return callback(products);
    });
  }
}

function addProductsToTrolley(products) {
  const promises = [];
  for (let productId in products) {
      if (products.hasOwnProperty(productId)) {
        const pcsValue = Math.ceil(products[productId]);
        promises.push(addToTrolley(productId, pcsValue, 'pcs'));
      }
  }

  return Promise.all(promises);
}


function importProducts(apiKey: string, projectName: string) {

  const parseIngredients = makeParseIngredients(addProductsToTrolley)

  return getIngredientsList(apiKey, projectName, parseIngredients);
}

$(function() {
  console.log('[Tesco Auto Trolley]: started');
  const props = $('html').data('props');
  const user = props.user;

  if (!user.isAuthenticated) {
    console.log('[Tesco Auto Trolley]: Please log in to your Tesco account first');
    return false;
  }

  const $button = $('<a href="#" id="autoTrolleyImport" class="button button-primary "><span>Import products</span></a>');
  const $headerCheckout = $('div.mini-trolley--header-checkout');

  $headerCheckout.append($button);

  $button.on('click', (event) => {
      event.preventDefault();

      let token;
      let project;

      chrome.storage.sync.get(['todoist_token', 'todoist_project'], (item) => {
        const token = item.todoist_token;
        const project = item.todoist_project;

        console.log(token, project);

        if (token === undefined || project === undefined) {
          console.log('[Tesco Auto Trolley]: todoist token or project name missing')
          return false;
        }

        console.log('importing products...');
        importProducts(token, project).done((data) => location.reload());
      });

      return false;
  });
});
