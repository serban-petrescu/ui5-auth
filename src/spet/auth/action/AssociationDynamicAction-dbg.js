sap.ui.define([
	"jquery.sap.global",
	"./BaseDynamicAction",
	"spet/auth/Factory",
	"spet/auth/helper/AssociationDynamicActionHelper"
], function(jQuery, BaseDynamicAction, Factory, AssociationDynamicActionHelper) {
	
	/**
	 * Dynamic action which appends a helper object as a dependent for a given
	 * target object (once per view). All view controls which are processed by
	 * the action are then added to the helper's association.
	 * @class
	 * @name spet.auth.action.AssociationDynamicAction
	 * @extends {spet.auth.action.BaseDynamicAction}
	 */
	return BaseDynamicAction.extend("spet.auth.action.AssociationDynamicAction", {
		_sTarget: null,
		
		constructor: function(mSettings) {
			BaseDynamicAction.apply(this, arguments);
			this._sTarget = mSettings.target;
		},
		
		initialize: function(oView) {
			BaseDynamicAction.prototype.initialize.apply(this, arguments);
			var oTarget = this._sTarget ? oView.byId(this._sTarget) : oView,
				oHelper = new AssociationDynamicActionHelper({
					role: this._oValue,
					whenMissing: this._oWhenMissing,
					whenPresent: this._oWhenPresent,
					view: oView
				});
			if (oTarget) {
				this._aHelperInfos.push({
					helper: oHelper,
					control: oTarget
				});
			}
			else {
				jQuery.sap.log.warning("An dynamic action could not be attached (target not found).");
			}
		},
		
		process: function(oView, oControl) {
			if (this._aHelperInfos.length) {
				this._aHelperInfos[0].helper.addElement(oControl);
			}
		}
	});
	
}, /* bExport = */ false);