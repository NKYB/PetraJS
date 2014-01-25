window.app.code_review_process = function(params){
    var html = '';
    html += '<div id="code_review_process"></div>'
    $(params.el_root).html( html );
    $().ajaxULate({
        url: window.app.URL_PHP_TEMPLATES,
        action: 'code_review_process',
        success_handler: function(response){
            $('#code_review_process').html( response );
        }
    });
    
}

