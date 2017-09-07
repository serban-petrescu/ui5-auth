sap.ui.define([
	"sap/ui/base/Object"
], function(UI5Object) {
	
	/**
	 * Base (adapter) class for actions. Simply defines nop methods.
	 * @class
	 * @name spet.auth.action.BaseAction
	 * @implements {spet.auth.IAction}
	 */
	return UI5Object.extend("spet.auth.action.BaseAction", {
		metadata: {
			interfaces: ["spet.auth.IAction"]
		},
		
		initialize: function() {
			
		},
		
		process: function() {
			
		},
		
		finalize: function() {
			
		}
		
	});
	
}, /* bExport = */ false);