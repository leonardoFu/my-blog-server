(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function init(){articleList.fetchData(1)}var SERVER=require("../constants/server"),articleList={fetchData:function(t,e){var n={pageNum:t,clsId:e};return $.get(SERVER+"articles",n).then(function(t){console.log(t)},function(t){console.error(t)}),this}};
},{"../constants/server":2}],2:[function(require,module,exports){
var SERVER = 'http://127.0.0.1:3000'
module.exports = SERVER;

},{}]},{},[1])