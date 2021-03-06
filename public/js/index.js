$('#searchForm').submit(function (e) {
    e.preventDefault();
    var url = this.elements['url'].value;
    var idString = url.match(/(?:localhost:8080\/){1}([(^_)\w\d]+)$/);
    if (idString) {
        search(idString[1]);
    }
    else {
        var errorBlock = $('div#searchResult>.alert');
        errorBlock.text('Ссылка задана некорректно');
        errorBlock.removeClass('hidden');    
        $('#findedUrl').addClass('hidden');
    }
    this.reset();
});

function search(url) {
    $.ajax({
        url: '/about/' + url,
        method: 'GET',
        success: function (data) {             
            $('#findedUrl>#tags>*').remove();       
            $('#findedUrl').removeClass('hidden');
            $('div#searchResult>.alert').addClass('hidden');

            $('#findedUrl>#author').text(data.url.author);
            $('#findedUrl>#longUrl>*').remove();
            $('#findedUrl>#longUrl').append('<a href="' + data.url.longUrl + '">' + data.url.longUrl + '</a>');

            var shortUrl = data.webhost + data.url._id.toString(36);
            $('#findedUrl>#shortUrl>*').remove();
            $('#findedUrl>#shortUrl').append('<a href="' + shortUrl + '">' + shortUrl + '</a>');
            $('#findedUrl>#description').text(data.url.description);
            if (data.url.tags) {
                data.url.tags.forEach(function (tag) {
                $('#findedUrl>#tags').append('<a href="/urls/' + tag + '" class="label label-primary">' + tag + '</a> ');
            });
            }
        },
        error: function (error) {
            var errorBlock = $('div#searchResult>.alert');
            errorBlock.text(error.responseText);
            errorBlock.removeClass('hidden');    
            $('#findedUrl').addClass('hidden');
        }
    });
}