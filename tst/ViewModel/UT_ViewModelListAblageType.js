QUnit.module("ViewModelListAblageType");
QUnit.test("SUCCESS_LoadAll", function (assert) {
    function MockWebServiceClientAblageType() {
        this._listeners = {
            loadAll: new Array()
        };

        //#region observable methods
        this.Register = function (eventName, listener) {
            if (listener == undefined ||
                listener == null ||
                this._listeners[eventName] == undefined) {
                return;
            }

            this._listeners[eventName].push(listener);
        };

        this.Update = function (eventName, data, sender) {
            if (this._listeners[eventName] == undefined) {
                return;
            }

            this._listeners[eventName].forEach(function (item) {
                item.Update(data, sender);
            });
        };

        this.Fail = function (eventName, messages, sender) {
            if (this._listeners[eventName] == undefined) {
                return;
            }

            this._listeners[eventName].forEach(function (item) {
                item.Fail(messages, sender);
            });
        };
        //#endregion

        this.LoadAll = function (sender) {
            var controller = this;
            var elements = new Array();            
            elements.push(new AblageType());
            elements[0].Bezeichnung = "Raum";
            elements.push(new AblageType());
            elements[1].Bezeichnung = "Regal";
            elements.push(new AblageType());
            elements[2].Bezeichnung = "Karton";

            controller.Update("loadAll", elements, sender);
        };
    }

    var viewModelListAblageType = new ViewModelListAblageType(new MockWebServiceClientAblageType());
    viewModelListAblageType.init();
    viewModelListAblageType.register("loadAll", new GuiClient(
        function (elements) {
            assert.ok(elements != undefined, "There are elements.");
            assert.ok(Array.isArray(elements), "Elements are a list.");
            assert.ok(elements.length == 3, "There are three elements.");
            assert.ok(elements[0].Bezeichnung == "Raum", "First element is 'Raum'.");
            assert.ok(elements[1].Bezeichnung == "Regal", "First element is 'Regal'.");
            assert.ok(elements[2].Bezeichnung == "Karton", "First element is 'Karton'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at loading!");
        })
    );

    viewModelListAblageType.loadAll();
});