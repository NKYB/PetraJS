window.app.projects = {
    client_list: {},
    get_clients_list: function(){
        $().ajaxULate({
            url: window.app.URL_PHP_MODELS,
            action: 'load_clients',
            success_handler: function(response){
                window.app.projects.client_list = response;
            }
        });
    }
}

