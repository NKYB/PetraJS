$.fn.SPServices.utils = {
    get_current_user: function(){
        var user_account = $().SPServices.SPGetCurrentUser({
            fieldNames: ["Title","EMail","Firstname","LastName","Department","JobTitle","Name","UserName"],
            debug: false
        });
        user_account.authenticated = false;
        if (user_account.UserName){
            var tempName = user_account.Title.split(', ');
            user_account.FormalName = tempName[1] + ' ' + tempName[0];
            user_account.authenticated = true;
        }
        return user_account;
    },
    get_active_directory_users: function(group_name,users){
        $().SPServices({
            operation: "GetUserCollectionFromGroup",
            groupName: group_name, //'ISS Delivery Members'
            async: true,
            completefunc: function (xData) {
                
                $(xData.responseXML).find('User').each(function () {
                    var item = {}, o = $(this);
                    item.ID = o.attr('ID');
                    item.Name = o.attr('Name');
                    item.LoginName = o.attr('LoginName');
                    item.Email = o.attr('Email');
                    if (item.Name.indexOf(', ') > 0){
                        var tempName = item.Name.split(', ');
                        item.FormalName = tempName[1] + ' ' + tempName[0];
                    } else {
                        item.FormalName = item.Name;
                    }
                    var b_add_flag = true;
                    for(var i=0; i < users.length; i++) { 
                        if (users[i].Name == item.Name)
                            b_add_flag = false;
                    }
                    if (b_add_flag)
                        users.push(item);
                    
                });
            }
        });
        return users;
    },
    get_active_directory_users_cache: function(group_name,users){
        
    },
    get_active_directory_groups: function(){
        var groups = [];
        $().SPServices({
            operation: "GetGroupCollectionFromSite",
            async: true,
            completefunc: function (xData) {
                $(xData.responseXML).find('Group').each(function () {
                    var item = {},
                        o = $(this);
                    item.value = o.attr('ID');
                    item.label = o.attr('Name');
                    if (
                        (item.label.indexOf('ISS Delivery')  > -1) || 
                        //(item.label.indexOf('ISS Change')  > -1) || 
                        //(item.label.indexOf('ISS - Core')  > -1) || 
                        //(item.label.indexOf('ISS Social')  > -1) || 
                        //(item.label.indexOf('ISS Solution Delivery')  > -1) || 
                        //(item.label.indexOf('ISS Technology')  > -1) || 
                        //(item.label.indexOf('ISS Visitors')  > -1) || 
                        (item.label.indexOf('ISS-QA')  > -1)
                        //(item.label.indexOf('ISS-Quality Assurance')  > -1) ||
                        //(item.label.indexOf('ISS Owners')  > -1)
                        //(item.label.indexOf('ISS')  > -1) 
                       ){
                        groups.push(item);
                        //console.log(item.label);
                       }
                });
            }
        });
        return groups;
    }
};