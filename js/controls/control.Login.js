function signIn(userName) {
    var data = {
        'signIn': null,
        'userName': userName
    };

    $.post('../../api/Services/Session', data, function(data, status) {

        if (status == "success") {
            user = JSON.parse(data);
            $("#navigation-item-user span").text(user.UserName);
            $("#navigation-item-sign-off").removeClass("disabled");
            $("#navigation-item-sign-off").attr("href", "javascript:void(0)");
            $("#navigation-item-sign-off").attr("onclick", "signOff();");
        }
    });
}

function signOff() {
    var data = {
        'signOff': null
    };

    $.post('../../api/Services/Session', data, function(data, status) {
        $("#navigation-item-user span").text("Benutzer");
        $("#navigation-item-sign-off").addClass("disabled");
        $("#navigation-item-sign-off").removeAttr("href");
        $("#navigation-item-sign-off").removeAttr("onclick");
    });
}

function setSignInState() {
    $.get('../../api/Services/Session', function(data, status){
        if (status == "success") {
            user = JSON.parse(data);
            $("#navigation-item-user span").text(user.UserName);
            $("#navigation-item-sign-off").removeClass("disabled");
            $("#navigation-item-sign-off").attr("href", "javascript:void(0)");
            $("#navigation-item-sign-off").attr("onclick", "signOff();");
        }
        else {
            $("#navigation-item-user span").text("Benutzer");
            $("#navigation-item-sign-off").addClass("disabled");
            $("#navigation-item-sign-off").removeAttr("href");
            $("#navigation-item-sign-off").removeAttr("onclick");
        }
    });
}