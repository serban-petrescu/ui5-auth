sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	
	/* Gets the property info for the given object and property name. */
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
	 * Selector which checks the value of a property.
	 * @class
	 * @name spet.auth.selector.IdSelector
	 * @implements {spet.auth.ISelector}
	 */
	return UI5Object.extend("spet.auth.selector.PropertySelector", {
		metadata: {
			interfaces: ["spet.auth.ISelector"]
		},
		
		_sProperty: "",
		_oValue: null,
		
		constructor: function(mSettings) {
			this._sProperty = mSettings.name;
			this._oValue = mSettings.value;
		},
		
		check: function(oView, oObject) {
			var oProperty = fnGetProperty(oObject, this._sProperty);
			return oProperty && oProperty.get(oObject) === this._oValue;
		}
		
	});
	
}, /* bExport = */ false);