sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	
	/**
	 * Selector which checks the view-relative id.
	 * @class
	 * @name spet.auth.selector.IdSelector
	 * @implements {spet.auth.ISelector}
	 */
	return UI5Object.extend("spet.auth.selector.IdSelector", {
		metadata: {
			interfaces: ["spet.auth.ISelector"]
		},
		
		_sId: "",
		
		constructor: function(mSettings) {
			this._sId = mSettings.value;
		},
		
		check: function(oView, oObject) {
			return oObject.getId && oView.createId(this._sId) === oObject.getId();
		}
		
	});
	
}, /* bExport = */ false);