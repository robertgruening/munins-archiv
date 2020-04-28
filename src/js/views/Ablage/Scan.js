var _viewModelFormAblage = null;

var _video = null;
var _canvasElement = null;
var _canvas = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormAblage = viewModelFactory.getViewModelFormAblage();

	_video = document.createElement("video");
	_canvasElement = document.getElementById("canvasVideoScrean");
	_canvas = _canvasElement.getContext("2d");

	InitStatusChanged();
	InitButtonOpen();
	startScanning();
});

function getPageName() {
	return "AblageScan";
}

function InitStatusChanged() {
	_viewModelFormAblage.register("load", new GuiClient(openAblageFormPage, showErrorMessages));
}

//#region form actions
//#region scan
function InitButtonOpen() {
	$("#buttonOpen").click(function() {
		loadByGuid($("#textBoxGuid").val());
	});
}
//#endregion
//#endregion

function loadByGuid(guid) {
	_viewModelFormAblage.loadByGuid(guid);
}

function openAblageFormPage(element) {
	window.open("/Munins Archiv/src/pages/Ablage/Form.html?Id=" + element.Id, "_self");
}

function startScanning() {
	// Use facingMode: environment to attemt to get the front camera on phones
	navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
		_video.srcObject = stream;
		_video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
		_video.play();
		requestAnimationFrame(tick);
	});
}

function drawLine(begin, end, color) {
	_canvas.beginPath();
	_canvas.moveTo(begin.x, begin.y);
	_canvas.lineTo(end.x, end.y);
	_canvas.lineWidth = 4;
	_canvas.strokeStyle = color;
	_canvas.stroke();
}

function tick() {
	$("#labelStatusConsole").text("Lade Videosignal ...");

	if (_video.readyState === _video.HAVE_ENOUGH_DATA) {
		_canvasElement.hidden = false;
		_canvasElement.height = _video.videoHeight;
		_canvasElement.width = _video.videoWidth;
		_canvas.drawImage(_video, 0, 0, _canvasElement.width, _canvasElement.height);
		var imageData = _canvas.getImageData(0, 0, _canvasElement.width, _canvasElement.height);
		var code = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "dontInvert",
		});

		if (code) {
			drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#b81900");
			drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#b81900");
			drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#b81900");
			drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#b81900");

			$("#labelStatusConsole").text("Gelesene Daten: " + code.data);

			if (isGuidFormat(code.data))
			{
				$("#textBoxGuid").val(code.data);
			}
		}
	}

	requestAnimationFrame(tick);
}

function isGuidFormat(data) {
	return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(data);
}
