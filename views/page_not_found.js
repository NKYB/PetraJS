window.app.page_not_found = function(){
    var html = '\
            <div class="errortitle" style="margin-top:10px;"> \
                <h4 class="animate0 fadeInUp">The page you are looking for has not been found.</h4> \
                <span class="animate1 bounceIn">4</span> \
                <span class="animate2 bounceIn">0</span> \
                <span class="animate3 bounceIn">4</span> \
                <div class="errorbtns animate4 fadeInUp"> \
                    <a style="cursor:pointer;" onclick="window.app.traffic(\'main_menu\',\'{}\');" class="btn btn-large">Go to Home</a> \
                </div> \
            </div>';
    $(window.app.EL_ROOT).html( html );
};