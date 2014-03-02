;(function(window) {
    function ModalDeleteUrl(){
        this.setHandle('modal_deleteNewUrl');
        this.setParentEl('modal_deleteNewUrl_parent');
        this.setTitleHtml('Url');
        this.setBodyHtml(this.renderBody());
        
        var proxy = this;
        var handleSubmit = function(){
//            var modelUrl = new ModelUrl();
//            modelUrl.setHref(proxy.getHref())
//            
//            var model = appUserMetrics.getModel('ModelUrlGroup');
//            model.addUrl(modelUrl);
//            appUserMetrics.saveModel('ModelUrlGroup');
//            
//            proxy.hide();
//            
//            appUserMetrics.trigger(ViewUrlManager.EVENT_TABLE_DATA_UPDATED);
            console.log('Delete URL');
        }

        this.setSubmitHandler(handleSubmit);
        this.renderHtml();
        this.show();

        function __construct(){} 
        __construct();
    }
    
    ModalCreateUrl.prototype = new Modal();
    
    ModalCreateUrl.prototype.getHref = function(){
        return $('#modal_deleteNewUrl_href').val();
    }
    
    ModalCreateUrl.prototype.renderBody = function(){
        var html = '';
        html += '<div>Url:</div>';
        html += '<div>';
        html += '   <input style="width:100%;" class="form-control" id="modal_createNewUrl_href" placeholder="http://" value="">';
        html += '</div>';
        return html;
    }

    window.ModalCreateUrl = ModalCreateUrl;
}(window));