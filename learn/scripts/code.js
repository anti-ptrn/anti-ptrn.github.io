$.fn.codefiy = function () {

    $(this).each(function () {
        var language = $(this).prop('class').split(' ')[0];

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
});