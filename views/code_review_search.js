window.app.code_review_search = function(params){
    var html = '';
    $(params.el_root).html( html );
    $(params.el_root).append( '<div id="code_reviews_table"></div>' );
    window.app.code_review.get_code_reviews({});
    
    $("#search_input").keyup(function(event){
        var params = {};
        params.search_keyword = $("#search_input").val();
        window.app.code_review.get_code_reviews(params);
    }).keydown(function(event){
        if(event.keyCode == 13){
            event.preventDefault();
        }
    });
}
