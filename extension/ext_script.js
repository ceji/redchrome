$(document).ready(function () {
    var token = '';
    var apiKey = '';
    var redmineUrl = '';

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
    $.ajax({
        url        : redmineUrl + "/projects.json?key=" + apiKey,
        crossDomain: true,
        dataType   : 'jsonp',
        type       : 'GET',
        beforeSend : setHeader
    }).then(function (projectData) {
        displayProjectData(projectData);
    });
    
    // Submiting bug
    $('#submit').on('click', function() {

        var description = "";
        description = description + "\nUser Agent : " + navigator.userAgent;
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
        $.ajax({
            type        : 'POST',
            url         : redmineUrl + "/issues.json?key=" + apiKey,
            data        : dataJson,
            crossDomain : true,
            beforeSend : setHeader,
            dataType    : 'json',
            success: function(data) {
                window.document.href = redmineUrl + "/issues/" + data.issue.id;
                console.log(data);
                alert("success " + data);
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
        initSettings();
        $('#form').fadeToggle();
        $('#form_settings').slideToggle();

    });

    // Init settings from chrome storage
    function initSettings() {
        chrome.storage.sync.get('apiKey', function(result) {
            $('#api_key').val(result.apiKey);
            apiKey = result.apiKey;
        });
        chrome.storage.sync.get('redmineUrl', function(result) {
            $('#redmine_url').val(result.redmineUrl);
            redmineUrl = result.redmineUrl;
        });
    }

    // Display the homepage
    function displayHomePage() {
        $('#form').fadeIn();
        $('#form_settings').fadeOut();
    }
    // Record Settings
    function saveSettings() {
        var apiKey = $('#api_key').val();
        var redmineUrl = $('#redmine_url').val();
        chrome.storage.sync.set({'apiKey': apiKey});
        chrome.storage.sync.set({'redmineUrl': redmineUrl});
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
