$('#registrationForm').submit(function (e) {
    e.preventDefault();
    var login = this.elements['login'].value;
    var password = this.elements['password'].value;
    var repeatedPassword = this.elements['repeatedPassword'].value;
    registration(login, password, repeatedPassword);                
    this.reset();
});

function registration(login, password, repeatedPassword) {
    $.ajax({
        url: '/register',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            login: login,
            password: password,
            repeatedPassword: repeatedPassword
        }),
        success: function(){
            window.location.reload();
        },
        error: function (data) {
            var errorElement = $('div#registration>.alert');
            errorElement.removeClass('hidden');
            errorElement.text(data.responseText);
        }
    });
}