var _viewModelListAblageType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelListAblageType = viewModelFactory.getViewModelListAblageType();

    InitStatusChanged();
    InitBreadcrumb();
    InitGrid();

    _viewModelListAblageType.loadAll();
});

function InitBreadcrumb()
{
    $("#breadcrumb").Breadcrumb({
        PageName : "AblageTypeManagement"
	});
}

function InitStatusChanged() {
	_viewModelListAblageType.register("loadAll", new GuiClient(ShowAblageTypes, null));
	_viewModelListAblageType.register("loadAll", new GuiClient(showActionBannerAllLoaded, showMessages));
	_viewModelListAblageType.register("create", new GuiClient(showActionBannerCreated, showMessages));
	_viewModelListAblageType.register("save", new GuiClient(showActionBannerSaved, showMessages));
	_viewModelListAblageType.register("delete", new GuiClient(showActionBannerDeleted, showMessages));
}

function InitGrid()
{
    jsGrid.locale("de");
}

function ShowAblageTypes(ablageTypes)
{
    $("#gridContainer").jsGrid({
        width: "100%",

        inserting: true,
        editing: true,
        sorting: false,
        paging: false,
        autoload: false,

        controller: {
            insertItem: function(item) {
                _viewModelListAblageType.create(item);
            },
            updateItem: function(item) {
                _viewModelListAblageType.save(item);
            },
            deleteItem: function(item) {
                _viewModelListAblageType.delete(item);
            }
        },

        data: ablageTypes,

        fields: [
            { 
                name: "Bezeichnung", 
                type: "text", 
                validate: "required"
            },
            { 
                title: "Anzahl von Ablagen",
                name: "CountOfAblagen", 
                type: "number",
                inserting: false,
                editing: false
            },
            { 
                type: "control" 
            }
        ]
    });
}

//#region actionBanner
function showActionBannerAllLoaded() {
	$("#actionBanner").empty();
	$("#actionBanner").click(function () {
		$("#actionBanner").attr("clicked", "true");
		$("#actionBanner").stop().hide();
	});
	$("#actionBanner").mouseenter(function () {
		$("#actionBanner").stop();
		$("#actionBanner").fadeTo(0, 1);
	});
	$("#actionBanner").mouseleave(function () {
		if ($("#actionBanner").attr("clicked") == undefined ||
			$("#actionBanner").attr("clicked") == "false") {
			$("#actionBanner").stop();
			$("#actionBanner").fadeTo(3000, 0, function () {
				$("#actionBanner").stop().hide();
			});
		}
	});
	$("#actionBanner").append("<p>Alle Ablagetypen geladen</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}

function showActionBannerCreated() {
	$("#actionBanner").empty();
	$("#actionBanner").click(function () {
		$("#actionBanner").attr("clicked", "true");
		$("#actionBanner").stop().hide();
	});
	$("#actionBanner").mouseenter(function () {
		$("#actionBanner").stop();
		$("#actionBanner").fadeTo(0, 1);
	});
	$("#actionBanner").mouseleave(function () {
		if ($("#actionBanner").attr("clicked") == undefined ||
			$("#actionBanner").attr("clicked") == "false") {
			$("#actionBanner").stop();
			$("#actionBanner").fadeTo(3000, 0, function () {
				$("#actionBanner").stop().hide();
			});
		}
	});
	$("#actionBanner").append("<p>Ablagetyp erzeugt</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}

function showActionBannerSaved() {
	$("#actionBanner").empty();
	$("#actionBanner").click(function () {
		$("#actionBanner").attr("clicked", "true");
		$("#actionBanner").stop().hide();
	});
	$("#actionBanner").mouseenter(function () {
		$("#actionBanner").stop();
		$("#actionBanner").fadeTo(0, 1);
	});
	$("#actionBanner").mouseleave(function () {
		if ($("#actionBanner").attr("clicked") == undefined ||
			$("#actionBanner").attr("clicked") == "false") {
			$("#actionBanner").stop();
			$("#actionBanner").fadeTo(3000, 0, function () {
				$("#actionBanner").stop().hide();
			});
		}
	});
	$("#actionBanner").append("<p>Ablagetyp gespeichert</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}

function showActionBannerDeleted() {
	$("#actionBanner").empty();
	$("#actionBanner").click(function () {
		$("#actionBanner").attr("clicked", "true");
		$("#actionBanner").stop().hide();
	});
	$("#actionBanner").mouseenter(function () {
		$("#actionBanner").stop();
		$("#actionBanner").fadeTo(0, 1);
	});
	$("#actionBanner").mouseleave(function () {
		if ($("#actionBanner").attr("clicked") == undefined ||
			$("#actionBanner").attr("clicked") == "false") {
			$("#actionBanner").stop();
			$("#actionBanner").fadeTo(3000, 0, function () {
				$("#actionBanner").stop().hide();
			});
		}
	});
	$("#actionBanner").append("<p>Ablagetyp gelöscht</p>");
	$("#actionBanner").show("fade", {}, 500);
	$("#actionBanner").hide("fade", {}, 3000);
}
//#endregion