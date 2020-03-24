QUnit.module("ViewModelExplorerAblage");
QUnit.test("SUCCESS_LoadRootElements", function (assert) {
    function MockWebServiceClientAblage() {
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
            elements.push(new Ablage());
            elements.push(new Ablage());
            elements.push(new Ablage());

            controller.Update("loadAll", elements, sender);
        };
    }

    var viewModelExplorerAblage = new ViewModelExplorerAblage(new MockWebServiceClientAblage());
    viewModelExplorerAblage.init();
    viewModelExplorerAblage.register("id", new GuiClient(
        function (id) {
            assert.ok(id === undefined, "'ID' must be undefined.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'ID'!");
        })
    );
    viewModelExplorerAblage.register("bezeichnung", new GuiClient(
        function (bezeichnung) {
            assert.ok(bezeichnung === "Ablage", "'Bezeichnung' must be 'Ablage'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Bezeichnung'!");
        })
    );
    viewModelExplorerAblage.register("parent", new GuiClient(
        function (parent) {
            assert.ok(parent === undefined, "'Parent' must be undefined.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Parent'!");
        })
    );
    viewModelExplorerAblage.register("path", new GuiClient(
        function (path) {
            assert.ok(path === "/", "'Path' must be root '/'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Path'!");
        })
    );
    viewModelExplorerAblage.register("funde", new GuiClient(
        function (funde) {
            assert.ok(funde === undefined, "'Funde' must be undefined.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Funde'!");
        })
    );
    viewModelExplorerAblage.register("children", new GuiClient(
        function (elements) {
            assert.ok(Array.isArray(elements), "Children are an array.");
            assert.ok(elements.length === 3, "There are three children.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at loading property 'Children'!");
        })
    );

    viewModelExplorerAblage.load();
});

QUnit.test("SUCCESS_LoadElementById", function (assert) {
    function MockWebServiceClientAblage() {
        this._listeners = {
            load: new Array()
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

        this.Load = function (elementToBeLoaded, sender) {
            var controller = this;
            var element = new Ablage();
            element.Id = 1;
            element.Bezeichnung = "Archiv";
            element.Type = new AblageType();
            element.Type.Bezeichnung = "Raum";
            element.Parent = null;
            element.Path = "/Archiv/";
            element.Children.push(new Ablage());
            element.Children.push(new Ablage());
            element.Funde.push(new Fund());

            controller.Update("load", element, sender);
        };
    }

    var viewModelExplorerAblage = new ViewModelExplorerAblage(new MockWebServiceClientAblage());
    viewModelExplorerAblage.init();
    viewModelExplorerAblage.register("id", new GuiClient(
        function (id) {
            assert.ok(id === 1, "'ID' must be 1.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'ID'!");
        })
    );
    viewModelExplorerAblage.register("bezeichnung", new GuiClient(
        function (bezeichnung) {
            assert.ok(bezeichnung === "Archiv", "'Bezeichnung' must be 'Archiv'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Bezeichnung'!");
        })
    );
    viewModelExplorerAblage.register("parent", new GuiClient(
        function (parent) {
            assert.ok(parent !== null, "'Parent' must be an object.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Parent'!");
        })
    );
    viewModelExplorerAblage.register("path", new GuiClient(
        function (path) {
            assert.ok(path === "/Archiv/", "'Path' must be root '/Archiv/'.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Path'!");
        })
    );
    viewModelExplorerAblage.register("funde", new GuiClient(
        function (funde) {
            assert.ok(Array.isArray(funde), "'Funde' must be an array.");
            assert.ok(funde.length === 1, "'Funde' must contain one element.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at updating property 'Funde'!");
        })
    );
    viewModelExplorerAblage.register("children", new GuiClient(
        function (elements) {
            assert.ok(Array.isArray(elements), "Children are an array.");
            assert.ok(elements.length === 2, "There are two children.");
        },
        function (messages) {
            assert.ok(false, "Must not fail at loading property 'Children'!");
        })
    );

    viewModelExplorerAblage.load(1);
});