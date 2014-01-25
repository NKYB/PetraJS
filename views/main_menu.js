window.app.main_menu = function(params){
    var html = '';
    html += window.app.standard_box('Symcor ADVISOR','Welcome to the Symcor ADVISOR','An organization`s ability to learn, and translate that learning into action rapidly, is the ultimate competitive advantage. - Jack Welch');
    
    
    html += '<ul class="shortcuts">';
    html += window.app.render_tile('Code Review','iconfa-check icon-white','window.app.traffic(\'code_review\');');
    html += window.app.render_tile('Application Inventory','iconfa-th-list icon-white','window.app.traffic(\'application_inventory\');');
    html += window.app.render_tile('Innovation Tracker','iconfa-retweet icon-white','window.app.traffic(\'innovation_tracker\');');
    html += window.app.render_tile('Overtime Reporting','iconfa-align-left icon-white','window.app.traffic(\'overtime_reporting\');');
    html += '</ul>'
    $(params.el_root).html( html );
}

window.app.render_tile = function(title,icon,link){
    var html = '';
    html += '<li class="events"  style="text-align:center;cursor:pointer;">';
    html += '    <a onclick="' + link + '">';
    html += '        <br /><span style="font-size:64px;" class="' + icon + '"></span>';
    html += '        <span class="shortcuts-label">' + title + '</span>';
    html += '    </a>';
    html += '</li>';
    return html;
}

window.app.standard_box = function(header, title, content){
    var html = '';
    html += '<div class="row-fluid">';
    html += '   <div class="span6">';
    html += '       <h4 class="widgettitle">' + header + '</h4>';
    html += '       <div class="widgetcontent">';
    html += '       <h2>' + title + '</h2>';
    html += '       <p>' + content + '</p>';
    html += '   </div>';
    html += '</div>';
    return html;
}

window.app.float_clear = function(){
    return '<div style="clear:both;"></div>';
}