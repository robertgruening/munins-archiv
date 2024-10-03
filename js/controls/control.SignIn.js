function signIn(userName) {
    var data = {
        'signIn': null,
        'userName': userName
    };

    $.post('../../api/Services/Session', data, function(data, status) {

        if (status == "success") {
            setUserSignedInState(JSON.parse(data));
        }
    });
}

function signOff() {
    var data = {
        'signOff': null
    };

    $.post('../../api/Services/Session', data, function(data, status) {
        setUserSignedOffState();
    });
}

function setSignInState() {
    $.get('../../api/Services/Session', function(data, status){
        if (status == "success") {
            setUserSignedInState(JSON.parse(data));
        }
        else {
            setUserSignedOffState();
        }
    });
}

function setUserSignedInState(user) {
    $("#navigation-item-user span").text(user.UserName);
    $("#navigation-item-sign-off").removeClass("disabled");
    $("#navigation-item-sign-off").attr("href", "javascript:void(0)");
    $("#navigation-item-sign-off").attr("onclick", "signOff();");
}

function setUserSignedOffState() {
    $("#navigation-item-user span").text("Benutzer");
    $("#navigation-item-sign-off").addClass("disabled");
    $("#navigation-item-sign-off").removeAttr("href");
    $("#navigation-item-sign-off").removeAttr("onclick");
}