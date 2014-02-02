window.app.code_review_charts = function(params){
    var html = '';
    html += window.app.code_review_charts.render_charts ();
    $(params.el_root).html( html );
    window.app.code_review_charts.render_chart('chart_num_per_month');
    window.app.code_review_charts.render_chart('code_reviews_per_client');
    window.app.code_review_charts.render_chart('chart_unit_tests_per_month');
    window.app.code_review_charts.render_chart('brd_quality');
    window.app.code_review_charts.render_chart('ssd_quality');
}

window.app.code_review_charts.render_charts = function(){
    return '<div id="charts" style="width: 99%;"> \
                    <div id="chart_num_per_month" style="float:left;width:49%;"></div> \
                    <div id="code_reviews_per_client" style="float:left;width:49%;margin-left:10px;"></div> \
                    <div id="chart_unit_tests_per_month" style="float:left;width:49%;margin-left:10px;"></div> \
                    <div id="brd_quality" style="float:left;width:49%;margin-left:10px;"></div> \
                    <div id="ssd_quality" style="float:left;width:49%;margin-left:10px;"></div> \
                    <div style="clear:both;"></div>\
            </div>';
}

window.app.code_review_charts.render_chart = function(el_parent){
    if (!window.app.code_review_charts.setup_highcharts_done_flag){
        Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
            return {
                radialGradient: {cx: 0.5, cy: 0.3, r: 0.7},
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        });
    } window.app.code_review_charts.setup_highcharts_done_flag = true;
    
    // get data
    $().ajaxULate({
        url: window.app.URL_PHP_MODELS,
        action: 'load_reviews',
        json: JSON.stringify({}),
        success_handler: function(response){
            var code_review_totals = {};
            code_review_totals.unit_test_count = 0;
            code_review_totals.count = 0;
            code_review_totals.unit_tests_num_failed_test_data = 0;
            
            var code_review_per_client = [];
            var code_review_per_month = [];
            for(key in response){
                var review = response[key];
                review.json = JSON.parse(review.json);
                var modified_date = window.app.date.string_to_date(review.modified);
                
                var modified_date_month = window.app.date.get_named_month(modified_date.getMonth());
                var modified_date_year = modified_date.getFullYear();
                var index = (modified_date_year * 12) + modified_date.getMonth();
                if (!code_review_per_month[index]){
                    code_review_per_month[index] = {};
                    code_review_per_month[index].month = modified_date.getMonth();
                    code_review_per_month[index].month_text = modified_date_month;
                    code_review_per_month[index].year = modified_date_year;
                    code_review_per_month[index].count = 0;
                    code_review_per_month[index].brd_quality = 0;
                    code_review_per_month[index].ssd_quality = 0;
                    code_review_per_month[index].unit_test_count = 0;
                    code_review_per_month[index].unit_test_failed_count = 0;
                    code_review_per_month[index].unit_test_failed_test_data_count = 0;
                }
                code_review_per_month[index].count += 1;
                code_review_per_month[index].brd_quality += parseInt(review.json.brd_quality);
                code_review_per_month[index].ssd_quality += parseInt(review.json.ssd_quality);
                
                code_review_per_month[index].unit_test_count += parseInt(review.json.unit_tests_num);
                code_review_per_month[index].unit_test_failed_count += parseInt(review.json.unit_tests_num_failed);
                code_review_per_month[index].unit_test_failed_test_data_count += parseInt(review.json.unit_tests_num_failed_test_data);
                
                code_review_totals.unit_test_count += parseInt(review.json.unit_tests_num);
                code_review_totals.count += 1;
                code_review_totals.unit_tests_num_failed_test_data += parseInt(review.json.unit_tests_num_failed_test_data);
                
                if (!code_review_per_client[review.json.client])
                    code_review_per_client[review.json.client] = 0;
                code_review_per_client[review.json.client]++;
            }

            var code_review_per_month_temp = [];
            for(key in code_review_per_month){
                if (code_review_per_month[key].brd_quality > 0)
                    code_review_per_month[key].brd_quality = code_review_per_month[key].brd_quality / code_review_per_month[key].count;
                if (code_review_per_month[key].ssd_quality > 0)
                    code_review_per_month[key].ssd_quality = code_review_per_month[key].ssd_quality / code_review_per_month[key].count;
                code_review_per_month_temp.push(code_review_per_month[key]);
            }
            code_review_per_month = code_review_per_month_temp;
//            console.log('code_review_per_month',code_review_per_month_temp);
//            console.log('window.app.code_review_charts.build_data', response);
            if (el_parent == 'chart_num_per_month'){
                window.app.code_review_charts.chart_code_reviews_per_month(el_parent,code_review_per_month);
            } else if (el_parent == 'chart_unit_tests_per_month'){
                window.app.code_review_charts.chart_unit_tests_per_month(el_parent,code_review_per_month);
            } else if (el_parent == 'brd_quality'){
                window.app.code_review_charts.chart_quality_per_month(el_parent,code_review_per_month,'brd_quality','BRD Quality','BRD Quality','Quality');
            } else if (el_parent == 'ssd_quality'){
                window.app.code_review_charts.chart_quality_per_month(el_parent,code_review_per_month,'ssd_quality','SSD Quality','SSD Quality','Quality');
            } else if (el_parent == 'quick_total_unit_test_executed'){
                window.app.code_review_charts.render_quick_chart(el_parent,'All Time Total Executed Unit Tests','iconfa-dashboard',code_review_totals.unit_test_count,'grey');
            } else if (el_parent == 'quick_total_code_reviews_executed'){
                window.app.code_review_charts.render_quick_chart(el_parent,'All Time Total Code Reviews','iconfa-check',code_review_totals.count,'purple');
            } else if (el_parent == 'quick_unit_tests_num_failed_test_data'){
                window.app.code_review_charts.render_quick_chart(el_parent,'All Time # Unit Tests Failed - Test Data','iconfa-remove-circle',code_review_totals.unit_tests_num_failed_test_data,'green');
            } else if (el_parent == 'code_reviews_per_client'){
                window.app.code_review_charts.chart_code_reviews_per_client(el_parent,code_review_per_client);
            }
        }
    });
    
}
window.app.code_review_charts.chart_unit_tests_per_month = function(parent_el, code_review_per_month){
    var chart_data = [];
    
    var unit_test_count = {};
    unit_test_count.name = 'Unit Tests - Sucess';
    unit_test_count.data = [];
     
    var unit_test_failed_count = {};
    unit_test_failed_count.name = 'Unit Tests - Failed';
    unit_test_failed_count.data = [];
    
    var unit_test_failed_test_data_count = {};
    unit_test_failed_test_data_count.name = 'Unit Tests - Failed Due to Test Data';
    unit_test_failed_test_data_count.data = [];
    
    var x_axis = [];
    for(key in code_review_per_month){
        review = code_review_per_month[key];
        unit_test_count.data.push(review.unit_test_count);
        unit_test_failed_count.data.push(review.unit_test_failed_count);
        unit_test_failed_test_data_count.data.push(review.unit_test_failed_test_data_count);
        x_axis.push(review.month_text);
    }
    chart_data.push(unit_test_count);
    chart_data.push(unit_test_failed_count);
    chart_data.push(unit_test_failed_test_data_count);
    console.log(chart_data);
            
    var el_name = parent_el + "_chart_" + Math.floor((Math.random()*99999999)+10000000);
    var html = '';
    html += '<h4 class="widgettitle">Unit Tests Per Month</h4>';
    html += '<div class="widgetcontent">';
    html += '    <div id="' + el_name + '" style="height:400px;"></div>';
    html += '</div>';
    $('#' + parent_el).html( html );

    $("#" + el_name).highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: x_axis
            },
            yAxis: {
                title: {
                    text: 'Unit Tests Count'
                }
            },
            tooltip: {
                enabled: false,
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+this.x +': '+ this.y +'';
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: chart_data
        });
}

window.app.code_review_charts.chart_code_reviews_per_month = function(parent_el, code_review_per_month){
    var chart_data = [];
    var x_axis = [];
    for(key in code_review_per_month){
        review = code_review_per_month[key];
        chart_data.push(review.count);
        x_axis.push(review.month_text);
    }
            
    var el_name = parent_el + "_chart_" + Math.floor((Math.random()*99999999)+10000000);
    var html = '';
    html += '<h4 class="widgettitle">Code Reviews Per Month</h4>';
    html += '<div class="widgetcontent">';
    html += '    <div id="' + el_name + '" style="height:400px;"></div>';
    html += '</div>';
    $('#' + parent_el).html( html );

    $("#" + el_name).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: x_axis
            },
            yAxis: {
                title: {
                    text: 'Code Reviews'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' review(s)'
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Code Reviews',
                data: chart_data
            }]
        });
}

window.app.code_review_charts.chart_code_reviews_per_client = function(parent_el, code_review_per_client){
    var chart_data = [];
    var x_axis = [];
    for(var key in code_review_per_client){
        var client = [key, code_review_per_client[key]];
        chart_data.push(client);
    }

    var el_name = parent_el + "_chart_" + Math.floor((Math.random()*99999999)+10000000);
    var html = '';
    html += '<h4 class="widgettitle">Percentage of code reviews by client</h4>';
    html += '<div class="widgetcontent">';
    html += '    <div id="' + el_name + '" style="height:400px;"></div>';
    html += '</div>';
    $('#' + parent_el).html( html );

    $("#" + el_name).highcharts({
        chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Code Reviews by client',
                data: chart_data
            }]
        });
}

window.app.code_review_charts.chart_quality_per_month = function(parent_el, code_review_per_month, data_index, title, y_axis_title, units){
    var chart_data = [];
    var x_axis = [];
    for(var key in code_review_per_month){
        review = code_review_per_month[key];
        chart_data.push(review[data_index]);
        x_axis.push(review.month_text);
    }
  
    var el_name = parent_el + "_chart_" + Math.floor((Math.random()*99999999)+10000000);
    var html = '';
    html += '<h4 class="widgettitle">' + title + '</h4>';
    html += '<div class="widgetcontent">';
    html += '    <div id="' + el_name + '" style="height:400px;"></div>';
    html += '</div>';
    $('#' + parent_el).html( html );

    $("#" + el_name).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: x_axis
            },
            yAxis: {
                title: {
                    text: y_axis_title
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: units
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: y_axis_title,
                data: chart_data
            }]
        });
}

window.app.code_review_charts.render_quick_chart = function(el_parent,title,icon,value,color){
    var html = '';
    html += '<div class="metro-nav">';
    html += '   <div class="metro-nav-block nav-block-' + color + '">';
    html += '       <a data-original-title="" style="cursor:pointer;"  onclick="window.app.traffic(\'code_review_charts\');">';
    html += '           <i class="' + icon + '"></i>';
    html += '           <div class="info">' + value + '</div>';
    html += '           <div class="status">' + title + '</div>';
    html += '       </a>';
    html += '   </div>';
    html += '</div>';
    $('#' + el_parent).html( html );
}