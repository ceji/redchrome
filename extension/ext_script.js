console.log("ext_script.js");

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
        url        : "https://redmine.bovpg.net/projects.json",
        crossDomain: true,
        dataType   : 'jsonp',
        type       : 'GET',
        beforeSend : setHeader
    }).then(function (projectData) {
        displayProjectData(projectData);
    });
    
    // Submiting bug
    $('#submit').on('click', function() {

        var dataJson = {
            'issue' : {
                'project_id'    : $('#project_id').val(),
                'tracker_id'    : $('#tracker_id').val(),
                'subject'       : $('#subject').val(),
                'description'   : "User Agent : " + navigator.userAgent + "\n" + $('#description').val(),
                'priority_id'   : $('#priority_id').val()
            }
        };
        console.log('issue creation sent');
        $.ajax({
            type        : 'POST',
            url         : "https://redmine.bovpg.net/issues.json?key=f0262b7a46ceaa96f8a46f0485219b094d6ee3de",
            data        : dataJson,
            crossDomain : true,
            username    : 'cjimenez',
            password    : '%C3dr1c%',
            dataType    : 'json',
            success: function(msg) {
                alert("success");
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
    console.log($('select.dropdown'));

});
