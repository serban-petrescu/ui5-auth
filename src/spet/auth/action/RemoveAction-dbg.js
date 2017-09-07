sap.ui.define([
	"./BaseAction"
], function(BaseAction) {
	
	/**
	 * Action which completely removes the processed control
	 * from the control tree. 
	 * @class
	 * @name spet.auth.action.RemoveAction
	 * @extends {spet.auth.action.BaseAction}
	 */
	return BaseAction.extend("spet.auth.action.RemoveAction", {
		process: function(oV, oC, oI) {
			oI.remove();
		}
	});
	
}, /* bExport = */ false);