window.app.date = {};
window.app.date.get_named_month = function(month_integer){
    var month=new Array();
    month[0]="January";
    month[1]="February";
    month[2]="March";
    month[3]="April";
    month[4]="May";
    month[5]="June";
    month[6]="July";
    month[7]="August";
    month[8]="September";
    month[9]="October";
    month[10]="November";
    month[11]="December";
    return month[month_integer];
}
window.app.date.string_to_date = function(date_string){
    var t = date_string.split(/[- :]/);
    var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    return new Date(d);
}
window.app.date.date_to_string = function(date){
    var curr_date = date.getDate();
    if (curr_date  < 10)
        curr_date  = '0' + curr_date;
    var curr_month = date.getMonth() + 1; //Months are zero based
    if (curr_month < 10)
        curr_month = '0' + curr_month;
    var curr_year = date.getFullYear();
    return curr_year + "-" + curr_month + "-" + curr_date;
}