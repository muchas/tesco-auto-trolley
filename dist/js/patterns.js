webpackJsonp([2],{

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        regex: /(\d+) (łyżki|łyżka|łyżek) ([a-zA-Z\sąćęńłóśźż]+)/g,
        unpack: result => {
            return {
                quantity: result[1] * 10,
                productName: result[3],
                quantityType: 'g',
            };
        }
    },
    {
        regex: /pół łyżki ([a-zA-Z\sąćęńłóśźż]+)/g,
        unpack: result => {
            return {
                quantity: 5,
                productName: result[1],
                quantityType: 'g'
            };
        }
    },
    {
        regex: /(\d+) ([a-zA-Z\sąćęńłóśźż]+)/g,
        unpack: result => {
            return {
                quantity: result[1],
                productName: result[2],
                quantityType: 'pcs'
            };
        }
    },
    {
        regex: /pół ([a-zA-Z\sąćęńłóśźż]+)/g,
        unpack: result => {
            return {
                quantity: 0.5,
                productName: result[1],
                quantityType: 'pcs',
            };
        }
    },
    {
        regex: /(\d+)g ([a-zA-Z\sąćęńłóśźż]+)/g,
        unpack: result => {
            return {
                quantity: result[1],
                productName: result[2],
                quantityType: 'g',
            };
        }
    },
    {
        regex: /(\d+)ml ([a-zA-Z\sąćęńłóśźż]+)/g,
        unpack: result => {
            return {
                quantity: result[1],
                productName: result[2],
                quantityType: 'ml',
            };
        }
    },
    {
        regex: /([a-zA-Z\sąćęńłóśźż]+)/g,
        unpack: result => {
            return {
                quantity: 1,
                productName: result[1],
                quantityType: 'pcs',
            };
        }
    }
];


/***/ })

},[3]);