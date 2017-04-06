$.fn.codefiy = function () {

    $(this).each(function () {
        var classes = $(this).prop('class').split(' ');
        var language = classes.length > 1 ? classes[1] : classes[0];

        var codeHeader = $('<div class="codeHeader lang-csharp">\
    <div class="copyBtn" style="display: block;">Copy</div>\
    <div class="labelHolder">C#</div>\
</div>');

        var label = $('.labelHolder', codeHeader);

        if (language == 'language-html')
            label.text('HTML');
        else if (language == 'language-javascript')
            label.text('JavaScript');
        else
            label.text('Code');

        codeHeader.insertBefore($(this).parent());
    });
};

$(document).ready(function () {
    $('.code').codefiy();

    var hash = window.location.hash;
    if(hash != '' && hash != null && typeof hash !== 'undefined')
        $(hash)[0].scrollIntoView();
});