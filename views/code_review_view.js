window.app.code_review_view = function(params){
    var id = params.id;
    var json_id = (id) ? {id:  id} : {};
    var read_only = (params.read_only) ? true : false;
    
    var html = '';
    html += '<h4 class="widgettitle">Code Review</h4>'
    html += '<div class="widgetcontent">';
    html += '<form class="stdform" action="forms.html" method="post" ></form>'
    html += '</div>';
    $(params.el_root).html( html );
    
    var user_list= [];
    for(var key in window.app.users.user_list){
        user_list.push(window.app.users.user_list[key].FormalName);
    }
    
    var client_list= [];
    for(var key in window.app.projects.client_list){
        client_list.push(window.app.projects.client_list[key].client_name);
    }
    
    if (params.action == 'clone'){}
    var clone = (params.action == 'clone') ? {flag: true, field: 'id'} : {flag: false, field: ''};
    
    var formULate = $('.stdform').formULate({
        label_style: 'input', 
        complete_url_redirect: 'code_review',
        error_style: 'color:red;',
        model_url: window.app.URL_PHP_MODELS,
        model_save_action: 'save_review',
        model_load_action: 'load_review',
        read_only: read_only,
        clone: clone,
        log_handler: function(action, params){
            if (action == 'save_review'){
                var msg = params.project_code + ' - ' + params.project_name;
                window.app.event('Code Review','save', msg);
            }
        }
    });
    
    formULate.add( {id: 'summary', label: 'Summary', type: 'header' })
    formULate.add( {id: 'id', type: 'hidden', default_value: id} ); 
    formULate.add( {id: 'client', type: 'text', label: 'Client',error_json: {required: 'true', required_msg: "This is a required field"}, default_value: '<no value>',auto_complete: client_list} );
    formULate.add( {id: 'project_name', type: 'text', label: 'Project Name', error_json: {required: 'true', required_msg: "This is a required field"}} ); 
    formULate.add( {id: 'project_code', type: 'text', label: 'Project Code', element_style: 'width:100px;'} ); 
    formULate.add( {id: 'project_overview', type: 'textarea', label: 'Project Overview', error_json: {required: 'true', required_msg: "This is a required field"}} ); 

    formULate.add( {id: 'project_team', label: 'Project Team', type: 'header'});
    formULate.add( {id: 'project_team_developer', type: 'text', label: 'Developer', error_json: {required: 'true', required_msg: "This is a required field"}, default_value: window.app.user_account.FormalName,auto_complete: user_list} ); 
    formULate.add( {id: 'project_team_pm', type: 'text', label: 'Project Manager',auto_complete: user_list} ); 
    formULate.add( {id: 'project_team_bsa', type: 'text', label: 'BSA',auto_complete: user_list} ); 
    formULate.add( {id: 'project_team_qa_lead', type: 'text', label: 'QA Lead',auto_complete: user_list} ); 
    
    formULate.add( {id: 'business_requirements_document', label: 'Business Requirements Document (BRD)', type: 'header'});
    formULate.add( {id: 'brd_flag', type: 'radio', label: 'BRD Used', option_list: {'true': 'True', 'false': 'False'}, default_value: 'true'} ); 
    formULate.add( {id: 'brd_sign_off', type: 'radio', label: 'Client BRD Signed Off', option_list: {'true': 'True', 'false': 'False'}, default_value: 'true'} ); 
    formULate.add( {id: 'brd_link', type: 'textarea', label: 'BRD Link', default_value: 'http://sharepoint', is_link: true} ); 
    formULate.add( {id: 'brd_quality', type: 'radio', label: 'BRD Quality Rating', option_list: {1: '1', 2: '2', 3: '3', 4: '4', 5: '5 Great'}, default_value: 5} ); 
    
    formULate.add( {id: 'unit_testing', label: 'Unit Testing', type: 'header'});
    formULate.add( {id: 'unit_tests_num', type: 'slider', label: 'Total # of Tests', max: '200'} ); 
    formULate.add( {id: 'unit_tests_num_passed', type: 'slider', label: '# of Tests Passed', max: '200'} );
    formULate.add( {id: 'unit_tests_num_failed', type: 'slider', label: '# of Tests Failed', max: '200'} ); 
    formULate.add( {id: 'unit_tests_num_failed_test_data', type: 'slider', label: '# Failed due to Test Data', max: '200'} ); 
    formULate.add( {id: 'test_data_quality', type: 'radio', label: 'Test Data Quality Rating', option_list: {1: '1', 2: '2', 3: '3', 4: '4', 5: '5 Great'}, default_value: 5} ); 
    formULate.add( {id: 'unit_test_quality', type: 'radio', label: 'Unit Testing Quality Rating', option_list: {1: '1', 2: '2', 3: '3', 4: '4', 5: '5 Great'}, default_value: 5} ); 

    formULate.add( {id: 'ssd', label: 'Systems Solution Document (SSD)', type: 'header'});
    formULate.add( {id: 'ssd_origional', type: 'radio', label: 'Did a starting SSD Exist', option_list: {'true': 'True', 'false': 'False'}, default_value: 'true'} ); 
    formULate.add( {id: 'ssd_origional_quality', type: 'radio', label: 'Quality Rating of SSD when starting the Project', option_list: {1: '1', 2: '2', 3: '3', 4: '4', 5: '5 Great'}, default_value: 5} ); 
    formULate.add( {id: 'ssd_hrs_create', type: 'slider', label: 'HRs spent on the SSD', max: '80', default_value: 1} ); 
    formULate.add( {id: 'ssd_quality', type: 'radio', label: 'Current SSD Quality Rating', option_list: {1: '1', 2: '2', 3: '3', 4: '4', 5: '5 Great'}, default_value: 5} ); 

    formULate.add( {id: 'issue_log', label: 'Issue Log', type: 'header'});
    formULate.add( {
        id: 'issue_list_form', 
        type: 'list', 
        label: 'Issue',
        form: [
            {id: 'issue_severity', type: 'radio', label: 'Severity', option_list: {1: 'Sev 1', 2: 'Sev 2', 3: 'Sev 3'}, default_value: 3},
            {id: 'issue_description', type: 'textarea', label: 'Issue Description'},
            {id: 'issue_remediation', type: 'textarea', label: 'Issue Remediation'}
        ]
    } );
    
    formULate.add( {id: 'sign_off', label: 'Sign Off', type: 'header'});
    formULate.add( {id: 'status', type: 'radio', label: 'Mark Review Complete', option_list: {'closed': 'True', 'open': 'False'}, default_value: 'open'} ); 
    formULate.add( {id: 'sign_off_reviewer', type: 'text', label: 'Reviewer', error_json: {required: 'true', required_msg: "This is a required field"},auto_complete: user_list} ); 

    formULate.add( {id: 'button_save', type: 'button', label: 'SAVE', action: 'save_review'} ); 
    formULate.render( json_id );
}