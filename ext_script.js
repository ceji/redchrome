console.log("ext_script.js");

$(document).ready(function ()
{
    var token = '';

    function setHeader(xhr)
    {
        xhr.setRequestHeader('Authorization', token);
    }

    $.ajax({
        url        : "https://redmine.bovpg.net/projects.json",
        crossDomain: true,
        dataType   : 'jsonp',
        type       : 'GET',
        beforeSend : setHeader
    }).then(function (data)
    {
        html = "<select>";
        $.each(data.projects, function ()
        {
            html += ("<option value='" + this.id + "'>" + this.name + "</option>");
        });
        html += "</select>";
        $('#projects').append(html);

    });
});