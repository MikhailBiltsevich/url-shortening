$('#createUrlForm').submit(function (e) {
    e.preventDefault();
    var longUrl = this.elements['longUrl'].value;
    var description = this.elements['description'].value;
    var tags = (this.elements['tags'].value).split(/\s+/);
    createUrl(longUrl, description, tags);
    this.reset();
});

function createUrl(longUrl, description, tags) {
    $.ajax({
        url: '/url',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            longUrl: longUrl,
            description: description,
            tags: tags
        }),
        success: function(url){
            window.location.reload();
        },
        error: function (error) {
            var errorBlock = $('#createUrl>.alert-danger');
            errorBlock.text(error.responseText);
            errorBlock.removeClass('hidden');
        }
    });
}

$('#changeUrlForm').submit(function (e) {
    e.preventDefault();
    var id = parseInt(this.elements['id'].value);
    var description = this.elements['description'].value;
    var tags = (this.elements['tags'].value).split(/\s+/);
    changeUrl(id, description, tags);
    this.reset();
});

function changeUrl(id, description, tags) {
    $.ajax({
        url: '/url',
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
            id: id,
            description: description,
            tags: tags
        }),
        success: function(url){
            window.location.reload();
        },
        error: function (error) {
            var errorBlock = $('#changeUrl>.alert-danger');
            errorBlock.text(error.responseText);
            errorBlock.removeClass('hidden');
        }
    });
}