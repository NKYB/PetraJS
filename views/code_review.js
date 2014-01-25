window.app.code_review = function(params){
    $(params.el_root).html( window.app.code_review.table() );
    window.app.code_review.get_code_reviews({});
    window.app.code_review.get_timeline({render_type: 'digest'});
    window.app.code_review_charts.render_chart('chart_num_per_month','chart_num_per_month');
    window.app.code_review.render_quick_stat('quick_stats');
}
window.app.code_review.table = function(){
    return '<div class="row-fluid"> \
                <div id="dashboard-left" class="span8"> \
                    <div id="quick_stats"></div> \
                    <div id="code_reviews_table"></div> \
                    <div id="chart_num_per_month" style="margin-top:10px;"></div> \
                </div> \
                <div id="timeline" class="span4"> \
            </div>';
}
window.app.code_review.get_code_reviews = function(params){
    $().ajaxULate({
        url: window.app.URL_PHP_MODELS,
        action: 'load_reviews',
        json: JSON.stringify(params),
        success_handler: function(response){
            window.app.code_review.render_code_reviews(response);
        }
    });
}

window.app.code_review.delete_code_review = function(params){
    window.app.event('Code Review','delete',params.msg);
    $.ajax({
        url: window.app.URL_PHP_MODELS,
        dataType: 'jsonp',
        jsonpCallback: 'jsonpCallback',
        contentType: 'application/json',
        data: {
            action:   'delete_review', 
            json:     JSON.stringify(params)
        },
        success: function(json){
            window.app.code_review.get_code_reviews({});
            window.app.code_review.get_timeline({render_type: 'digest'});
        },
        error:function(){
            console.log("Error delete_code_review");
        }
    });
}

window.app.code_review.render_code_reviews = function(response){
    var html = '';
    html += '<h4 class="widgettitle">Code Reviews</h4>';
    html += '<table id="dyn_code_reviews_table" class="table table-bordered">';
    html += '   <thead>';
    html += '       <tr>';
    html += '           <th style="cursor:pointer;">Status<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Project Name<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Project Code<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Client<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="cursor:pointer;">Last Modified<b class="caret" style="margin-top:7px;margin-left:4px;border-top: 4px solid #fff;"></b></th>';
    html += '           <th style="min-width:152px;">Actions</th>';
    html += '       </tr>';
    html += '   </thead>';
    html += '   <tbody>';
    for(key in response){
        var review = response[key];
        review.formatted_date = window.app.date.string_to_date(review.modified);
        review.formatted_date = window.app.date.date_to_string(review.formatted_date);
        review.json = JSON.parse(review.json);
        review.button_text = (review.status == 'open') ? 'EDIT': 'VIEW';

        html += '       <tr>';
        if (review.status == 'open')
            html += '           <td style="text-transform:uppercase;"><span class="label label-success">' + review.status + '</span></td>';
        if (review.status == 'closed')
            html += '           <td style="text-transform:uppercase;"><span class="label label-default">' + review.status + '</span></td>';

        html += '           <td>' + review.project_name + '</td>';
        html += '           <td>' + review.project_code + '</td>';
        html += '           <td>' + review.json.client + '</td>';
        html += '           <td>' + review.formatted_date + '</td>';
        html += '           <td>';
        html += '               <button id="button_' + review.id + '" read_only="' + review.status + '" class="btn" style="margin-bottom:0px;font-size:10px;padding:2px 8px 0px 8px;">' + review.button_text + '</button>';
        html += '               <button id="button_clone_' + review.id + '" read_only="false"  class="btn" style="margin-bottom:0px;font-size:10px;padding:2px 8px 0px 8px;">CLONE</button>';
        html += '               <button id="button_delete_' + review.id + '" read_only="false" class="btn" style="margin-bottom:0px;font-size:10px;padding:2px 8px 0px 8px;">DELETE</button>';
        html += '           </td>';
        html += '       </tr>';
    }
    html += '   </tbody>';
    html += '</table>';
    $('#code_reviews_table').html( html );
    
    var html = '';
    for(key in response){
        var review = response[key];
        html += '<div id="button_delete_dialog_confirm_' + review.id + '" title="Delete this Code Review?" style="display:none;">';
        html += '<p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>This audit artifact will be permanently deleted and cannot be recovered. Are you sure?</p>';
        html += '</div>';
    }
    $('#code_reviews_table').append( html );
    
    for(key in response){
        var review = response[key];
        $('#button_' + review.id).click(function(event){
            var id = $(this).attr('id').replace('button_','');
            var read_only_flag = ($(this).attr('read_only') == 'open' ? false : true);
            window.app.traffic('code_review_view',{id: id, read_only: read_only_flag, action: 'nop'});
        });
        $('#button_delete_' + review.id).click({review:review},function(event){
            var id = $(this).attr('id').replace('button_delete_','');
            $.proxy(jConfirm('This code review will be deleted permanently?', 'Delete Code Review', function(result) {
                if (result){
                    var review = event.data.review;
                    var msg = review.project_code + ' - ' + review.project_name;
                    window.app.code_review.delete_code_review({id:id,msg:msg});
                }
            }),event.data.review);
        });
        $('#button_clone_' + review.id).click(function(event){
            var id = $(this).attr('id').replace('button_clone_','');
            window.app.traffic('code_review_view',{id: id, read_only: false, action: 'clone'});
        });
    }
    
    $('#dyn_code_reviews_table').dataTable({
        "sPaginationType": "full_numbers",
        "aaSortingFixed": [[0,'asc']],
        "fnDrawCallback": function(oSettings) {
            $.uniform.update();
        }
    });
}

window.app.code_review.render_quick_stat = function(el_parent){
    var html ='';
    html += '<div id="quick_total_unit_test_executed" style="float:left;width: 32.6%;margin-bottom:10px;"></div>';
    html += '<div id="quick_total_code_reviews_executed" style="float:left;width: 32.6%;margin-left:3px;"></div>';
    html += '<div id="quick_unit_tests_num_failed_test_data" style="float:left;width: 32.6%;margin-left:3px;"></div>';
    html += '<div  style="clear:both;"></div>';
    $('#' + el_parent).html( html );
    
    window.app.code_review_charts.render_chart('quick_total_unit_test_executed');
    window.app.code_review_charts.render_chart('quick_total_code_reviews_executed')
    window.app.code_review_charts.render_chart('quick_unit_tests_num_failed_test_data');
}
