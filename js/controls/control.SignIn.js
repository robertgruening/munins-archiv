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
    $("#navigation-item-user i").addClass("fa-user");
    $("#navigation-item-user i").removeClass("fa-right-to-bracket");
    $("#navigation-item-sign-off").removeClass("disabled");
    $("#navigation-item-sign-off").attr("href", "javascript:void(0)");
    $("#navigation-item-sign-off").attr("onclick", "signOff();");

    $("#navigation-item-set-bookmark").removeClass("disabled");
    $("#navigation-item-set-bookmark").attr("href", "javascript:void(0)");
    $("#navigation-item-set-bookmark").attr("onclick", "setBookmark();");

    if (user.Bookmark != null &&
        user.Bookmark.length >= 1) {

        $("#navigation-item-open-bookmark").removeClass("disabled");
        $("#navigation-item-open-bookmark").attr("href", user.Bookmark);
    }
}

function setUserSignedOffState() {
    $("#navigation-item-user span").text("Benutzer");
    $("#navigation-item-user i").addClass("fa-right-to-bracket");
    $("#navigation-item-user i").removeClass("fa-user");
    $("#navigation-item-sign-off").addClass("disabled");
    $("#navigation-item-sign-off").removeAttr("href");
    $("#navigation-item-sign-off").removeAttr("onclick");

    $("#navigation-item-set-bookmark").addClass("disabled");
    $("#navigation-item-set-bookmark").removeAttr("href");
    $("#navigation-item-set-bookmark").removeAttr("onclick");

    $("#navigation-item-open-bookmark").addClass("disabled");
    $("#navigation-item-open-bookmark").removeAttr("href");
}

function setBookmark() {
    $.get('../../api/Services/Session', function(data, status){
        if (status == "success") {
            let user = JSON.parse(data);
            user.Bookmark = window.location.href;

            $.ajax(
                {
                    type: "PUT",
                    url: "../../api/Services/User/" + user.Id,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(user),
                    success: function (data2, textStatus2, jqXHR2) {
                        let user2 = data2;
    
                        $("#navigation-item-open-bookmark").removeClass("disabled");
                        $("#navigation-item-open-bookmark").attr("href", user.Bookmark);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
        }
    });
}