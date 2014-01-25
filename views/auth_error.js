window.app.auth_error = function(params){
    var html = '';
    html += '<div style="font-size:14px;text-align:center;">Please <a href="http://sharepoint.symcor.com/departments/REQ-7VVLNN/development/_layouts/Authenticate.aspx?Source=%2Fdepartments%2FREQ%2D7VVLNN%2Fdevelopment%2FAdvisor%2FHome%2Easpx">sign in</a> to use the Symcor Advisor</div>';
    html += '<div style="padding-top:14px;font-size:14px;text-align:center;"><a href="http://sharepoint.symcor.com/departments/REQ-7VVLNN/development/_layouts/Authenticate.aspx?Source=%2Fdepartments%2FREQ%2D7VVLNN%2Fdevelopment%2FAdvisor%2FHome%2Easpx"><img border="0" src="http://is900.symprod.com:551/advisor/images/sign_in_example.png" /></a></div>';
    $(params.el_root).html( html );
}

