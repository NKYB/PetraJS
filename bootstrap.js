if(typeof(console) === 'undefined') {
    var console = {}
    console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = function() {};
}
console.log('App Console Activated!');

window.app = {
    URL_ROOT: 'http://127.0.0.1/advisor/',
    URL_PHP: 'http://127.0.0.1/advisor/php/',
    URL_PHP_MODELS: 'http://127.0.0.1/advisor/php/models/ajax_model.php',
    URL_PHP_TEMPLATES: 'http://127.0.0.1/advisor/php/html/ajax_template.php',
    EL_ROOT: '#sharepoint_content',
    EL_HEADER: '.pageheader',
    EL_BREADCRUMB: '#breadcrumbs',
    EL_SIGN_ON: '#login_msg',
    EL_NAVIGATION_TREE: '.leftmenu',
    NAVIGATION_TREE: [
        {id: 'home', action: 'main_menu', label: 'Home', icon: 'iconfa-home',slogan: 'ADVISOR'},
        {id: 'code_review', action: 'code_review', label: 'Code Reviews', icon: 'iconfa-check',
            children: [
                {action: 'code_review_view',        parent: 'code_review', label: 'Create New', icon: 'iconfa-leaf'},
                {action: 'code_review_search',      parent: 'code_review', label: 'Search',     icon: 'iconfa-search'},
                {action: 'code_review_charts',      parent: 'code_review', label: 'Charts',     icon: 'iconfa-signal'},
                {action: 'code_review_timeline',    parent: 'code_review', label: 'Timeline',   icon: 'iconfa-calendar'},
                {action: 'code_review_process',     parent: 'code_review', label: 'Process',    icon: 'iconfa-cogs'}
            ]
        },
        {action: 'application_inventory', label: 'Application Inventory', icon: 'iconfa-th-list'},
        {action: 'innovation_tracker', label: 'Innovation Tracker', icon: 'iconfa-retweet'},
        {action: 'overtime_reporting', label: 'Overtime Reporting', icon: 'iconfa-align-left'}
    ],
    start: function(action){
        window.app.projects.get_clients_list();
        window.app.user_account = $().SPServices.utils.get_current_user();
        window.app.navigation(action);
        window.app.traffic(action);
        window.app.users.init_lists();
    },
    traffic: function(action, params){
        console.log('bootstrap.traffic',action);
        var defaults = {
            el_root: window.app.EL_ROOT,
            action_error_authentication: 'auth_error'
        };
        params = $.extend( {}, defaults, params );
        if (!window.app.user_account.authenticated){
            action = defaults.action_error_authentication;
        }
        window.app.navigation.render_breadcrumb(action);
        window.app.navigation.render_header(action);
        window.app.navigation.update_highlight(action);
        
        if (!window.app[action]){
            action = 'page_not_found';
        }
        window.app[action](params);
        
    }
};