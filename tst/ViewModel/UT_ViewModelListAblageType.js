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
            var elements = new Array();
            elements.push(new AblageType());
            elements[0].Bezeichnung = "Raum";
            elements.push(new AblageType());
            elements[1].Bezeichnung = "Regal";
            elements.push(new AblageType());
            elements[2].Bezeichnung = "Karton";

            this.Update("loadAll", elements, sender);
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
            assert.ok(elements[1].Bezeichnung == "Regal", "Second element is 'Regal'.");
            assert.ok(elements[2].Bezeichnung == "Karton", "Third element is 'Karton'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at loading!");
        })
    );

    viewModelListAblageType.loadAll();
});

QUnit.test("SUCCESS_RemoveOneAblageType", function (assert) {
    function MockWebServiceClientAblageType() {
        this._listeners = {
            loadAll: new Array(),
            delete: new Array()
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

        this.Delete = function (element, sender) {
            this.Update("delete", "Ablagetyp (" + element.Id + ") ist gelöscht.", sender);
        };

        this.LoadAll = function (sender) {
            var elements = new Array();
            elements.push(new AblageType());
            elements[0].Id = 0;
            elements[0].Bezeichnung = "Raum";
            elements.push(new AblageType());
            elements[1].Id = 2;
            elements[1].Bezeichnung = "Karton";

            this.Update("loadAll", elements, sender);
        };
    }

    var viewModelListAblageType = new ViewModelListAblageType(new MockWebServiceClientAblageType());
    viewModelListAblageType.init();
    viewModelListAblageType.register("delete", new GuiClient(
        function (message) {
            assert.ok(message != undefined, "There is a message.");
            assert.ok(message == "Ablagetyp (1) ist gelöscht.", "The message text is as expected.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at deleting!");
        })
    );
    viewModelListAblageType.register("loadAll", new GuiClient(
        function (elements) {
            assert.ok(elements != undefined, "There are elements.");
            assert.ok(Array.isArray(elements), "Elements are a list.");
            assert.ok(elements.length == 2, "There are two elements.");
            assert.ok(elements[0].Bezeichnung == "Raum", "First element is 'Raum'.");
            assert.ok(elements[1].Bezeichnung == "Karton", "Second element is 'Karton'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at loading!");
        })
    );

    var ablageType = new AblageType();
    ablageType.Id = 1;
    viewModelListAblageType.delete(ablageType);
});

QUnit.test("SUCCESS_AddOneAblageType", function (assert) {
    function MockWebServiceClientAblageType() {
        this._listeners = {
            loadAll: new Array(),
            create: new Array()
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

        this.Create = function (element, sender) {
            this.Update("create", element, sender);
        };

        this.LoadAll = function (sender) {
            var elements = new Array();
            elements.push(new AblageType());
            elements[0].Bezeichnung = "Raum";
            elements.push(new AblageType());
            elements[1].Bezeichnung = "Regal";
            elements.push(new AblageType());
            elements[2].Bezeichnung = "Karton";

            this.Update("loadAll", elements, sender);
        };
    }

    var viewModelListAblageType = new ViewModelListAblageType(new MockWebServiceClientAblageType());
    viewModelListAblageType.init();
    viewModelListAblageType.register("create", new GuiClient(
        function (element) {
            assert.ok(element != undefined, "There is an element.");
            assert.ok(element.Bezeichnung != undefined, "The element has an attribute 'Bezeichnung'.");
            assert.ok(element.Bezeichnung == "Regal", "The element's Bezeichnung is 'Regal'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at deleting!");
        })
    );
    viewModelListAblageType.register("loadAll", new GuiClient(
        function (elements) {
            assert.ok(elements != undefined, "There are elements.");
            assert.ok(Array.isArray(elements), "Elements are a list.");
            assert.ok(elements.length == 3, "There are three elements.");
            assert.ok(elements[0].Bezeichnung == "Raum", "First element is 'Raum'.");
            assert.ok(elements[1].Bezeichnung == "Regal", "Second element is 'Regal'.");
            assert.ok(elements[2].Bezeichnung == "Karton", "Third element is 'Karton'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at loading!");
        })
    );

    var ablageType = new AblageType();
    ablageType.Bezeichnung = "Regal";
    viewModelListAblageType.create(ablageType);
});

QUnit.test("SUCCESS_SaveOneAblageType", function (assert) {
    function MockWebServiceClientAblageType() {
        this._listeners = {
            loadAll: new Array(),
            save: new Array()
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

        this.Save = function (element, sender) {
            this.Update("save", element, sender);
        };

        this.LoadAll = function (sender) {
            var elements = new Array();
            elements.push(new AblageType());
            elements[0].Bezeichnung = "Raum";
            elements.push(new AblageType());
            elements[1].Bezeichnung = "Regal";
            elements.push(new AblageType());
            elements[2].Bezeichnung = "Karton M";

            this.Update("loadAll", elements, sender);
        };
    }

    var viewModelListAblageType = new ViewModelListAblageType(new MockWebServiceClientAblageType());
    viewModelListAblageType.init();
    viewModelListAblageType.register("save", new GuiClient(
        function (element) {
            assert.ok(element != undefined, "There is an element.");
            assert.ok(element.Bezeichnung != undefined, "The element has an attribute 'Bezeichnung'.");
            assert.ok(element.Bezeichnung == "Karton M", "The element's Bezeichnung is 'Karton M'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at deleting!");
        })
    );
    viewModelListAblageType.register("loadAll", new GuiClient(
        function (elements) {
            assert.ok(elements != undefined, "There are elements.");
            assert.ok(Array.isArray(elements), "Elements are a list.");
            assert.ok(elements.length == 3, "There are three elements.");
            assert.ok(elements[0].Bezeichnung == "Raum", "First element is 'Raum'.");
            assert.ok(elements[1].Bezeichnung == "Regal", "Second element is 'Regal'.");
            assert.ok(elements[2].Bezeichnung == "Karton M", "Third element is 'Karton M'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at loading!");
        })
    );

    var ablageType = new AblageType();
    ablageType.Bezeichnung = "Karton M";
    viewModelListAblageType.save(ablageType);
});