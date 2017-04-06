"use strict";



var code1 = $("code:first");

var el = document.getElementById('editor');
el.style.height = '400px';
el.style.width = '500px';
el.style.direction = 'ltr';
el.style.textAlign = 'right';


var editor = null, diffEditor = null;


$(document).ready(function () {
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('editor'), {
            model: monaco.editor.createModel(un_escape(code1.html()), "javascript")
        });
        editor.layout();
    });

    ;
});


