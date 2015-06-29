$(document).ready(function () {
    var token = '';

    // Get curren turl
    var tablink;
    chrome.tabs.getSelected(null,function(tab) {
        tablink = tab.url;
    });

    // Init settings from chrome storage
    function initSettings() {
        var config = chrome.storage.sync.get('config', function(result) {
            console.log(result);
            $('#api_key').val(result.config.apiKey);
            $('#redmine_url').val(result.config.redmineUrl);
            getProjects(result.config.apiKey, result.config.redmineUrl);

            return result.config;
        });
        return config;
    }
    var config = initSettings();

    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', token);
    }
    
    function displayProjectData(projectData) {
        html = "<select id='project_id' class='ui search dropdown'>";
        $.each(projectData.projects, function ()
        {
            html += ("<option value='" + this.id + "'>" + this.name + "</option>");
        });
        html += "</select>";
        $('#projectsField').append(html);
        $('#project_id').dropdown();
    }

    // Filling redmine projects
    function getProjects(apiKey, redmineUrl) {
        $.ajax({
            url        : redmineUrl + "/projects.json?key=" + apiKey,
            crossDomain: true,
            dataType   : 'jsonp',
            type       : 'GET',
            beforeSend : setHeader
        }).then(function (projectData) {
            displayProjectData(projectData);
        });
    }
    
    // Submiting bug
    $('#submit').on('click', function() {

        var description = "";
        description = description + "\nUser Agent : " + navigator.userAgent;
        description = description + "\nUrl : " + tablink;
        description = description + "\n" + $('#description').val();

        var dataJson = {
            'issue' : {
                'project_id'    : $('#project_id').val(),
                'tracker_id'    : $('#tracker_id').val(),
                'subject'       : $('#subject').val(),
                'description'   : description,
                'priority_id'   : $('#priority_id').val(),
            }
        };
        console.log('issue creation sent');
        config = {
            'apiKey' : $('#api_key').val(),
            'redmineUrl' : $('#redmine_url').val()
        };
        console.log(config);
        $.ajax({
            type        : 'POST',
            url         : config.redmineUrl + "/issues.json?key=" + config.apiKey,
            data        : dataJson,
            crossDomain : true,
            beforeSend : setHeader,
            dataType    : 'json',
            success: function(data) {
                issueUrl = config.redmineUrl + "issues/" + data.issue.id;
                alert("Issue created : " + issueUrl);
            },
            error: function(xhr, msg, error) {
                alert('error');
                alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
                alert("responseText: "+xhr.responseText);
            }
        });
    });

    // Init semantic
    $('select.dropdown').dropdown();

    // Display Settings
    $('#settings_btn').on('click', function() {
        $('#form').fadeToggle();
        $('#form_settings').slideToggle();

    });

    // Display the homepage
    function displayHomePage() {
        $('#form').fadeIn();
        $('#form_settings').fadeOut();
    }
    // Record Settings
    function saveSettings() {
        var apiKey = $('#api_key').val();
        var redmineUrl = $('#redmine_url').val();
        var config = {
            'config' : {
                'apiKey' : apiKey,
                'redmineUrl' : redmineUrl
            }
        };
        chrome.storage.sync.set(config);
        $('div.ui.success.message').show();
    }

    $('i.close').on('click', function () {
        $(this).parent().hide();
    });
    $('#settings_cancel').on('click', function() {
        displayHomePage();
    });
    $('#settings_save').on('click', function() {
        saveSettings();
    });


});
