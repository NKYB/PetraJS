window.app.overtime_reporting = function(params){
    var html = '<div id="charts" style="width: 99%;"> \
                    <div id="sample" style="float:left;width:99%;"></div> \
                </div>';
    $(params.el_root).html( html );
	window.app.code_review_charts.sample('sample');
}

window.app.code_review_charts.sample = function (parent_el) {
        $('#' + parent_el).highcharts({
            chart: {
            },
            title: {
                text: 'OT Reports'
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
            },
            tooltip: {
                formatter: function() {
                    var s;
                    if (this.point.name) { // the pie chart
                        s = ''+
                            this.point.name +': '+ this.y +' fruits';
                    } else {
                        s = ''+
                            this.x  +': '+ this.y;
                    }
                    return s;
                }
            },
            labels: {
                items: [{
                    html: 'Total fruit consumption',
                    style: {
                        left: '40px',
                        top: '8px',
                        color: 'black'
                    }
                }]
            },
            series: [{
                type: 'column',
                name: 'Jane',
                data: [3, 2, 1, 3, 4]
            }, {
                type: 'column',
                name: 'John',
                data: [2, 3, 5, 7, 6]
            }, {
                type: 'column',
                name: 'Joe',
                data: [4, 3, 3, 9, 0]
            }, {
                type: 'spline',
                name: 'Average',
                data: [3, 2.67, 3, 6.33, 3.33],
                marker: {
                	lineWidth: 2,
                	lineColor: Highcharts.getOptions().colors[3],
                	fillColor: 'white'
                }
            }, {
                type: 'spline',
                name: 'Total',
                data: [10, 12, 9, 13, 6],
                marker: {
                	lineWidth: 2,
                	lineColor: Highcharts.getOptions().colors[2],
                	fillColor: 'white'
                }
            }]
        });
    }