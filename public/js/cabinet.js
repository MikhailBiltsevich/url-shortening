$('#createUrlForm').submit(function (e) {
    e.preventDefault();
    var longUrl = this.elements['longUrl'].value;
    var description = this.elements['description'].value;
    var tags = (this.elements['tags'].value).match(/[\wа-я]+/gi);
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
    var tags = (this.elements['tags'].value).match(/[\wа-я]+/gi);
    this.reset();
    changeUrl(id, description, tags);
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

function getUrl(id) {
    $.ajax({
        url: '/url/' + id,
        contentType: 'application/json',
        method: 'GET',
        success: function(url){
            var a = $('li>a[href = "#changeUrl"]');
            $('li>a[href = "#changeUrl"]').trigger('click');
            $('#changeUrlForm input#id').attr('value', url._id);
            $('#changeUrlForm textarea#description').text(url.description);
            $('#changeUrlForm input#tags').attr('value', url.tags);
        }
    });
}

$('button[data-id]').click(function (e) {
    e.preventDefault();
    var id = $(this).attr('data-id');
    getUrl(id);
});