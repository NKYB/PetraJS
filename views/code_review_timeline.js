window.app.code_review_timeline = function(params){
    $(params.el_root).html( '<div id="timeline"></div>' );
    window.app.code_review.get_timeline({test:'yoyo'});
    
    $("#search_input").keyup(function(event){
        var params = {};
        params.search_keyword = $("#search_input").val();
        window.app.code_review.get_timeline(params);
    }).keydown(function(event){
        if(event.keyCode == 13){
            event.preventDefault();
        }
    });
}

window.app.code_review.get_timeline = function(params){
    $().ajaxULate({
        url: window.app.URL_PHP_MODELS,
        action: 'load_events',
        json: JSON.stringify({link_table: 'code_reviews',search_keyword: params.search_keyword}),
        success_handler: function(response){
            if (params.render_type == 'digest'){
                window.app.code_review.render_timeline_digest(response); 
            } else {
                window.app.code_review.render_timeline(response); 
            }
        }
    });
};

window.app.code_review.render_timeline = function(response){
    var html = '';
    html += '<h4 class="widgettitle">Code Reviews</h4>';
    html += '<table id="dyn_timeline_table" class="table table-bordered">';
    html += '   <thead>';
    html += '       <tr>';
    html += '           <th></th>';
    html += '           <th style="cursor:pointer;">User<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Action<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Category<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Message<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Timestamp<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '       </tr>';
    html += '   </thead>';
    html += '   <tbody>';
    for(key in response){
        var timeline = response[key];

        html += '       <tr>';
        html += '           <td></td>';
        html += '           <td>' + timeline.user + '</td>';
        html += '           <td>' + timeline.action + '</td>';
        html += '           <td>' + timeline.category + '</td>';
        html += '           <td>' + timeline.msg + '</td>';
        html += '           <td>' + timeline.timestamp + '</td>';
        html += '       </tr>';
    }
    html += '   </tbody>';
    html += '</table>';
    $('#timeline').html( html );

    $('#dyn_timeline_table').dataTable({
        "sPaginationType": "full_numbers",
        "aaSortingFixed": [[0,'asc']],
        "fnDrawCallback": function(oSettings) {
            $.uniform.update();
        }
    });
}

window.app.code_review.render_timeline_digest = function(response,max){
    var html = '';
    html += '<h4 class="widgettitle">Activity</h4>';
    html += '<ul class="userlist">';
    html += '<div class="widgetcontent nopadding">';
    if (!max > 0)
        max = 10;
    var counter = 0;
    for(key in response){
        var timeline = response[key];
        var icon = 'iconfa-info-sign'
        if (timeline.action == 'save')
            icon = 'iconfa-save';
        if (timeline.action == 'delete')
            icon = 'iconfa-trash';

        html += '<li  onclick="window.app.traffic(\'code_review_timeline\');">';
        html += '   <div class="' + icon + ' pull-left" style="font-size:40px;"></div>'
        html += '   <div class="uinfo">';
        html += '       <h5>' + timeline.user + '</h5>';
        html += '       <span class="pos">' + timeline.action + ': ' + timeline.msg + '</span>';
        html += '       <span>Last Updated On: ' + timeline.timestamp + '</span>';
        html += '   </div>';
        html += '</li>';
        counter++;
        if (counter >= max)
            break;
    }
    html += '</ul>';
    html += '</div>';
    $('#timeline').html( html );
}