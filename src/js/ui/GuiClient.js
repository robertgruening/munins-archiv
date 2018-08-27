function GuiClient(updateFunction, failFunction)
{
	this._updateFunction = updateFunction;
	this._failFunction = failFunction;

	this.Update = function(parameter, sender) 
	{
        if (this._updateFunction != undefined &&
            this._updateFunction != null)
        {
            this._updateFunction(parameter, sender);
        }
	};

	this.Fail = function(parameter, sender)
	{
        if (this._failFunction != undefined &&
            this._failFunction != null)
        {
            this._failFunction(parameter, sender);
        }
	};
}