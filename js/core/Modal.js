;(function(window) {
    function Modal (){
        this.handle = 'modalhelper';
        this.handleError = 'modalhelper-error';
        this.handleTitle = 'modalhelper-title';
        this.handleBody = 'modalhelper-body';
        this.handleSubmit = 'modalhelper-save';
        
        this.parent_el = 'body';

        this.bodyHtml = '';
        
        this.errorHtml = '';
        
        this.titleHtml = '';
        
        this.submitButtonHtml = 'Submit';
        
        this.closeHandler = function(error){};
        
        this.submitHandler = function(error){};
    }
    var p = Modal.prototype;
    
    Modal.prototype.setHandle = function(handle){
        this.handle       = handle;
        this.handleError  = handle + '-error';
        this.handleTitle  = handle + '-title';
        this.handleBody   = handle + '-body';
        this.handleSubmit = handle + '-save';
    };
    
    Modal.prototype.setParentEl = function(parent_el){
        this.parent_el = parent_el;
    };
    
    Modal.prototype.closeHandler = function(error){};
    
    Modal.prototype.submitHandler = function(error){};
    
    Modal.prototype.setErrorHtml = function(html){
        this.errorHtml = html;
    };
    
    Modal.prototype.setTitleHtml = function(html){
        this.titleHtml = html;
    };
    
    Modal.prototype.setBodyHtml = function(html){
        this.bodyHtml = html;
    };
    
    Modal.prototype.setSubmitButtonHtml = function(html){
        this.submitButtonHtml = html;
    };
    
    Modal.prototype.setSubmitHandler = function(handler){
        this.submitHandler = handler;
    };
    
    Modal.prototype.setCloseHandler = function(handler){
        this.closeHandler = handler;
    };
    
    Modal.prototype.show = function(){
        $('#' + this.handle).modal('show');
    };
    
    Modal.prototype.hide = function(){
        $('#' + this.handle).modal('hide');
    };
    
    Modal.prototype.renderHtml = function(){
        var self = this;
        
        var buttonSubmit = new Button();
        buttonSubmit.setId('BtnSubmitModal');
        buttonSubmit.setLabel(this.submitButtonHtml);
        buttonSubmit.setClickHandler(self.submitHandler);
        
        var buttonClose = new Button();
        buttonClose.setId('BtnCloseModal');
        buttonClose.setLabel('Close');
        buttonClose.setClickHandler(this.closeHandler);
        
        var html = '';
        html += '<div id="' + this.handle + '" class="modal fade">';
        html += '  <div class="modal-dialog">';
        html += '    <div class="modal-content">';
        html += '      <div class="modal-header">';
        html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
        html += '        <h4 id="' + this.handleTitle + '" class="modal-title">';
        html +=             this.titleHtml
        html += '        </h4>';
        html += '      </div>';
        html += '      <div id="' + this.handleBody + '" class="modal-body">';
        html +=             this.bodyHtml;
        html += '      </div>';
        html += '      <div class="modal-footer">';
        html += '        <span id="' + this.handleError + '" style="font-size: 18px;color: red;"></span>';
        html +=             this.errorHtml;
        html += '        </span>';
        html +=          buttonClose.render(); 
        html +=          buttonSubmit.render(); 
        html += '      </div>';
        html += '    </div><!-- /.modal-content -->';
        html += '  </div><!-- /.modal-dialog -->';
        html += '</div><!-- /.modal -->';
        $('#' + this.parent_el).html( html );
    }
    
    window.Modal = Modal;
}(window));
