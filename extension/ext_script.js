$(document).ready(function () {
    var token = '';

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
        url        : "https://redmine.bovpg.net/projects.json?key=" + apiKey,
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
//                'custom_fields' : [
//                    {'value' : 'test', 'id': 28}
//                ]
            }
        };
        console.log('issue creation sent');
        $.ajax({
            type        : 'POST',
            url         : "https://redmine.bovpg.net/issues.json?key=" + apiKey,
            data        : dataJson,
            crossDomain : true,
            beforeSend : setHeader,
            dataType    : 'json',
            success: function(data) {
                window.document.href = "http://redmine.bovpg.net/issues/" + data.issue.id;
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

});
