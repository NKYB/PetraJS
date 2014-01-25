window.app.navigation = function(action){
    window.app.navigation.render_sign_in();
    window.app.navigation.render_side_menu(action);
}

window.app.navigation.render_side_menu = function(action){
    // render side menu
    var nav_html = '<ul class="nav nav-tabs nav-stacked"><li class="nav-header">Navigation</li>';
    for (var key in window.app.NAVIGATION_TREE){
        var nav_element = window.app.NAVIGATION_TREE[key];
        var li_class = '';
        li_class = (nav_element.children) ? li_class + 'dropdown' : li_class + '';
        li_class = (nav_element.action == action) ? li_class + ' active' : li_class + '';
        if (nav_element.children){
            for (var id in window.app.NAVIGATION_TREE[key].children){
                var nav_element_child = window.app.NAVIGATION_TREE[key].children[id];
                if (nav_element_child.action == action){
                    li_class = li_class + ' active';
                }
            }
        }
        nav_html += '<li id="nav_' + nav_element.action + '" class="' + li_class + '">';
        nav_html += '<a style="cursor:pointer;" onclick="window.app.traffic(\'' + nav_element.action + '\',\'{}\');">';
        nav_html += '<span class="' + nav_element.icon + '"></span>';
        nav_html += ' ' + nav_element.label + '</a>';
        if (nav_element.children){
            nav_html += '<ul>';
            for (var id in window.app.NAVIGATION_TREE[key].children){
                var nav_element_child = window.app.NAVIGATION_TREE[key].children[id];
                var li_class_child = '';
                nav_html += '<li id="nav_' + nav_element_child.action + '" parent="nav_' + nav_element.action + '" class="' + li_class_child + '">';
                nav_html += '<a style="cursor:pointer;" onclick="window.app.traffic(\'' + nav_element_child.action + '\',\'{}\');">';
                nav_html += '<span class="' + nav_element_child.icon + '"></span>';
                nav_html += ' ' + nav_element_child.label + '</a>';
                nav_html += '</li>';
            }
            nav_html += '</ul>';
        }
        nav_html += '</li>';
    }
    nav_html += '</ul>';
    $(window.app.EL_NAVIGATION_TREE).html( nav_html );
    
//    $(window.app.EL_NAVIGATION_TREE + ' .dropdown > a').click(function(){
//        if(!$(this).next().is(':visible'))
//            $(this).next().slideDown('fast');
//        else
//            $(this).next().slideUp('fast');	
//        return false;
//    });

}

window.app.navigation.update_highlight = function(action){
    $(window.app.EL_NAVIGATION_TREE + ' li').each(function(){
        $(this).removeClass('active');
    });
    var el_target = '#nav_' + action;
    var el_parent = $(el_target).attr('parent');
    $(el_target).addClass('active');
    $('#' + el_parent).addClass('active');
    
    if ($(el_target).hasClass('dropdown')){
        if(!$(el_target).children('ul').is(':visible'))
            $(el_target).children('ul').slideDown('fast');
        else
            $(el_target).children('ul').slideUp('fast');	
    }
}

window.app.navigation.render_sign_in = function(){
    if (!window.app.user_account.authenticated){
        $(window.app.EL_SIGN_ON).html('<a href="">Sign In</a>');
    } else {
        $(window.app.EL_SIGN_ON).html('Welcome ' + window.app.user_account.Title);
    }
}

window.app.navigation.render_breadcrumb = function(action){
    var breadcrumb_html = '<ul class="breadcrumbs">';
    breadcrumb_html += '<li><a style="cursor:pointer;" onclick="window.app.traffic(\'main_menu\',\'{}\');"><i class="iconfa-home"></i></a> <span class="separator"></span></li>';
    for (var key in window.app.NAVIGATION_TREE){
        var nav_element = window.app.NAVIGATION_TREE[key];
        if (action == nav_element.action){
            breadcrumb_html += '<li><a style="cursor:pointer;" onclick="window.app.traffic(\'' + nav_element.action + '\',\'{}\');">' + nav_element.label + '</a> <span class="separator"></span></li>';
        } else {
            for (var id in window.app.NAVIGATION_TREE[key].children){
                var nav_element_child = window.app.NAVIGATION_TREE[key].children[id];
                if (action == nav_element_child.action){
                    breadcrumb_html += '<li><a style="cursor:pointer;" onclick="window.app.traffic(\'' + nav_element.action + '\',\'{}\');">' + nav_element.label + '</a> <span class="separator"></span></li>';
                    breadcrumb_html += '<li><a style="cursor:pointer;" onclick="window.app.traffic(\'' + nav_element_child.action + '\',\'{}\');">' + nav_element_child.label + '</a> <span class="separator"></span></li>';
                
                }
            }
        }
    }
    breadcrumb_html += '</ul>';

    $(window.app.EL_BREADCRUMB).html( breadcrumb_html );
}

window.app.navigation.render_header = function(action){
    var header_html = '';
    for (var key in window.app.NAVIGATION_TREE){
        var nav_element = window.app.NAVIGATION_TREE[key];
        if (!nav_element.slogan)
            nav_element.slogan = '';
        if (action == nav_element.action){
            header_html += '<div class="pageicon"><span class="' + nav_element.icon + '"></span></div>';
            header_html += '<div class="pagetitle">';
            header_html += '<h5>' + nav_element.slogan + '&nbsp;</h5>';
            header_html += '<h1>' + nav_element.label + '</h1>';
            header_html += '</div>';
        } else {
            for (var id in window.app.NAVIGATION_TREE[key].children){
                var nav_element_child = window.app.NAVIGATION_TREE[key].children[id];
                if (action == nav_element_child.action){
                    header_html += '<div class="pageicon"><span class="' + nav_element_child.icon + '"></span></div>';
                    header_html += '<div class="pagetitle">';
                    header_html += '<h5>' + nav_element.label + '</h5>';
                    header_html += '<h1>' + nav_element_child.label + '</h1>';
                    header_html += '</div>';
                }
            }
        }
    }
    $(window.app.EL_HEADER).html( header_html );
}