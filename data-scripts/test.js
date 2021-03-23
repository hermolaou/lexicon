/*
 * Название: test.js
 * Описание: Тестирование файла meanings.js
 * Запуск:   node test.js
 */


// загружаем массив из файла
const meanings = require('./meanings.js');

// отображаем длину массива
console.log("Merged dictionary contains " + meanings.length + " items");
