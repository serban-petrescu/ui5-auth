sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	
	/**
	 * Selector which checks the element type.
	 * @class
	 * @name spet.auth.selector.ElementTypeSelector
	 * @implements {spet.auth.ISelector}
	 */
	return UI5Object.extend("spet.auth.selector.ElementTypeSelector", {
		metadata: {
			interfaces: ["spet.auth.ISelector"]
		},
		
		_sTypeName: "",
		
		constructor: function(mSettings) {
			this._sTypeName = mSettings.value;
		},
		
		check: function(oView, oObject) {
			return oObject.getMetadata && oObject.getMetadata().getElementName 
				&& oObject.getMetadata().getElementName() === this._sTypeName;
		}
		
	});
	
}, /* bExport = */ false);