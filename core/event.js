window.app.event = function(category,action,msg){
    $().ajaxULate({
        url: window.app.URL_PHP_MODELS,
        action: 'save_event',
        json: JSON.stringify({
            user: window.app.user_account.FormalName, 
            category: category,
            action: action, 
            msg: msg
        })
    });
}