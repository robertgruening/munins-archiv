function GuiClient(updateFunction, failFunction)
{
	this._updateFunction = updateFunction;
	this._failFunction = failFunction;

	this.Update = function(parameter) 
	{
        if (this._updateFunction != undefined &&
            this._updateFunction != null)
        {
            this._updateFunction(parameter);
        }
	};

	this.Fail = function(parameter)
	{
        if (this._failFunction != undefined &&
            this._failFunction != null)
        {
            this._failFunction(parameter);
        }
	};
}