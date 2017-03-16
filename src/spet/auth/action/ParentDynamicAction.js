sap.ui.define([
	"./BaseDynamicAction",
	"spet/auth/Factory",
	"spet/auth/helper/ParentDynamicActionHelper"
], function(BaseDynamicAction, Factory, ParentDynamicActionHelper) {
	
	/**
	 * Dynamic action which appends helper objects for each element which
	 * is processed. The helper elements are added as dependents to their
	 * respective elements.
	 * @class
	 * @name spet.auth.action.ParentDynamicAction
	 * @extends {spet.auth.action.BaseDynamicAction}
	 */
	return BaseDynamicAction.extend("spet.auth.action.ParentDynamicAction", {
		process: function(oView, oControl) {
			var oHelper = new ParentDynamicActionHelper({
				role: this._oValue,
				whenMissing: this._oWhenMissing,
				whenPresent: this._oWhenPresent,
				view: oView
			});
			oHelper.setView(oView);
			this._aHelperInfos.push({
				helper: oHelper,
				control: oControl
			});
		}
	});
	
}, /* bExport = */ false);