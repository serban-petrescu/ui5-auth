sap.ui.define([
	"./BaseAction"
], function(BaseAction) {
	
	/* Retrieves the property info from the given object, for the given property name.  */
	var fnGetProperty = function(oObject, sProperty) {
		if (oObject.getMetadata && oObject.getMetadata().getProperty) {
			var oProperty = oObject.getMetadata().getProperty(sProperty);
			if (oProperty) {
				return oProperty;
			}
		}
		return null;
	};
	
	/**
	 * Action which sets the value of a given property to the
	 * given value.
	 * @class
	 * @name spet.auth.action.SetPropertyAction
	 * @extends {spet.auth.action.BaseAction}
	 */
	return BaseAction.extend("spet.auth.action.SetPropertyAction", {
		metadata: {
			interfaces: ["spet.auth.IAction"]
		},
		
		_sName: "",
		_oValue: null,
		
		constructor: function(mSettings) {
			this._sName = mSettings.name;
			this._oValue = mSettings.value;
		},
		
		process: function(oView, oControl) {
			var oProperty = fnGetProperty(oControl, this._sName);
			if (oProperty) {
				oControl.unbindProperty(this._sName);
				oProperty.set(oControl, this._oValue);
			}
		}
		
	});
	
}, /* bExport = */ false);