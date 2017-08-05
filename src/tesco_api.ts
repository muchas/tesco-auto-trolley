import * as $ from 'jquery';

const BASE_URL = 'https://ezakupy.tesco.pl/groceries/pl-PL';


function getCsrfToken() {
  return $('html').data('csrf-token');
}

function findProduct(productName, callback) {
  return $.ajax({
    type: "POST",
    url: `${BASE_URL}/resources`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      'x-csrf-token': getCsrfToken(),
    },
    data: JSON.stringify({
      resourceNames: ["search"],
      params: {
        query: {
          "query-small": productName,
        }
      }
    }),
  }).done((data) => {
    const items = data['search']['results']['productItems'].filter(p => p['product'].isForSale)

    let product;
    if(items.length > 0) product = items[0]['product'];

    callback(product);
  });
}


function getProduct(productId, callback) {
  return $.ajax({
    type: "GET",
    url: `${BASE_URL}/products/${productId}`,
    dataType: 'html',
    headers: {
      'upgrade-insecure-requests': '1',
    },
    xhr: function() {
         // Get new xhr object using default factory
         var xhr = (<any>$).ajaxSettings.xhr();
         // Copy the browser's native setRequestHeader method
         var setRequestHeader = xhr.setRequestHeader;
         // Replace with a wrapper
         xhr.setRequestHeader = function(name, value) {
             // Ignore the X-Requested-With header
             if (name == 'X-Requested-With') return;
             // Otherwise call the native setRequestHeader method
             // Note: setRequestHeader requires its 'this' to be the xhr object,
             // which is what 'this' is here when executed.
             setRequestHeader.call(this, name, value);
         }
         // pass it on to jQuery
         return xhr;
     },
  }).done((data) => {
    const decodeHtml = (html) => {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    const props = JSON.parse(
      decodeHtml(data.match(/data-props="(\{.*\})" /)[1]));

    callback(props.product);
  });
}


function addToTrolley(productId: String, quantity: number, unitType: String) {
  const response = $.ajax({
    type: "PUT",
    url: `${BASE_URL}/trolley/items?_method=PUT`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      'x-csrf-token': getCsrfToken(),
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
  })
}


function resetTrolley() {

}


export {
  addToTrolley,
  findProduct,
  getProduct,
  resetTrolley,
}
