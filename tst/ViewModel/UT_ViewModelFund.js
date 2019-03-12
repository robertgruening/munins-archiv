QUnit.module("FundViewModel");
QUnit.test("FAIL_LoadById_NoElementWithId23", function (assert) {
    function MockWebServiceClientFund() {
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

        this.Load = function (fund, sender) {
            var controller = this;
            var messages = new Array();
            messages.push("Es gibt keinen Fund mit der Id 23!");

            controller.Fail("load", messages, sender);
        };
    }

    var fundViewModel = new FundViewModel(new MockWebServiceClientFund());
    fundViewModel.init();
    fundViewModel.register("load", new GuiClient(
        function (element) {
            assert.ok(false, "Must not load an element!")
        },
        function (messages) {
            assert.ok(messages.length == 1, "There is one Message.");
            assert.equal(messages[0], "Es gibt keinen Fund mit der Id 23!", "Message text is as expected.")
        })
    );

    fundViewModel.load(23);
});

QUnit.test("SUCCESS_LoadById_ElementWithId23", function (assert) {
    function MockWebServiceClientFund() {
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

        this.Load = function (fund, sender) {
            var controller = this;
            var element = new Fund();
            element.Id = 23;

            controller.Update("load", element, sender);
        };
    }

    var fundViewModel = new FundViewModel(new MockWebServiceClientFund());
    fundViewModel.init();
    fundViewModel.register("id", new GuiClient(
        function (id) {
            assert.ok(id != undefined, "ID is defined.");
            assert.ok(id != null, "ID is set.");
            assert.ok(id == 23, "ID is 23.");
        },
        function (messages) {
            assert.ok(false, "Must not have invalid ID!")
        })
    );
    fundViewModel.register("dataResetted", new GuiClient(
        function () {
            assert.ok(true, "Load event is successful.");
        },
        function (messages) {
            assert.ok(false, "Must return an object with ID 23!")
        })
    );
    fundViewModel.register("load", new GuiClient(
        function () {
            assert.ok(true, "Data are unchanged.");
        },
        function (messages) {
            assert.ok(false, "Must not reset data!")
        })
    );

    fundViewModel.load(23);
});