/** This file is part of cloudhw.info. See LICENSE for license infomation.
 * 
 * Used to filter a table based on search input.
 * */

"use strict";

var inputArray = [];

function _onInputSearch(e) {
    const search_input = e.target;
    const tables = document.getElementsByClassName(search_input.getAttribute('data-table'));
    inputArray.forEach.call(tables, function(table) {
        inputArray.forEach.call(table.tBodies, function(tbody) {
            inputArray.forEach.call(tbody.rows, function(row) {
                const text_content = row.textContent.toLowerCase();
                const search_val = search_input.value.toLowerCase();
                row.style.display = text_content.indexOf(search_val) > -1 ? '' : 'none';
            });
        });
    });
}

document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
        const inputs = document.getElementsByClassName('search-input');
        inputArray.forEach.call(inputs, function(input) {
            input.oninput = _onInputSearch;
        });
    }
});
