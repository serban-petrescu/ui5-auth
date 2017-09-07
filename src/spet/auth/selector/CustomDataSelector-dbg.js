sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	
	/**
	 * Selector which checks the value of a custom-data property.
	 * @class
	 * @name spet.auth.selector.CustomDataSelector
	 * @implements {spet.auth.ISelector}
	 */
	return UI5Object.extend("spet.auth.selector.CustomDataSelector", {
		metadata: {
			interfaces: ["spet.auth.ISelector"]
		},
		
		_sKey: "",
		_oValue: null,
		
		constructor: function(mSettings) {
			this._sKey = mSettings.name;
			this._oValue = mSettings.value;
		},
		
		check: function(oView, oObject) {
			return oObject.data && oObject.data(this._sKey) === this._oValue;
		}
		
	});
	
}, /* bExport = */ false);