;(function(window) {
    function AppExample(){
        this.EL_ROOT           = '#app_content';
        this.urlBackendModels  = 'ajax_model.php';
        
        function __construct(){} 
        __construct();
    }
    
    AppExample.prototype = new App();
    
    window.AppExample = AppExample;
}(window)); 

var App = new AppExample();

