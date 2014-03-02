;(function(window) {
    function AppExample(){
        this.EL_ROOT           = '#app_content';
        this.urlBackendModels  = 'http://example.com/core/ajax_model.php';
        
        function __construct(){} 
        __construct();
    }
    
    AppExample.prototype = new App();
    
    window.AppExample = AppExample;
}(window)); 

var appExample = new AppExample();
