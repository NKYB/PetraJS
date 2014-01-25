window.app.users = {
    group_list: [],
    user_list: [],
    get_user_list: function(){
        for(var id in this.group_list){
            var label = this.group_list[id].label;
            if(this.group_list[id].label)
                this.user_list = $().SPServices.utils.get_active_directory_users(label, this.user_list);
        }
    },
    get_group_list: function(){
        window.app.users.group_list = $().SPServices.utils.get_active_directory_groups('ISS Delivery');
    },
    init_lists: function(){
        window.app.users.get_group_list();
        window.app.users.get_user_list();
    }
}