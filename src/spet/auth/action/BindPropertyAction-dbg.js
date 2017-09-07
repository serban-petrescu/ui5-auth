sap.ui.define([
	"./BaseAction",
	"sap/ui/base/BindingParser"
], function(BaseAction, BindingParser) {
	
	/**
	 * Action which binds a property of the target control with a
	 * given binding info. 
	 * @class
	 * @name spet.auth.action.BindPropertyAction
	 * @extends {spet.auth.action.BaseAction}
	 */
	return BaseAction.extend("spet.auth.action.BindPropertyAction", {
		metadata: {},
		
		_sName: "",
		_oInfo: null,
		
		constructor: function(mSettings) {
			this._sName = mSettings.name;
			this._oInfo = mSettings.info;
		},
		
		process: function(oView, oControl) {
			if (oControl.bindProperty) {
				var oValue = this._oInfo;
				if (typeof oValue === "string" && oValue.indexOf("{=") === 0) {
					oValue = BindingParser.parseExpression(oValue, 2).result;
				}
				oControl.bindProperty(this._sName, oValue);
			}
		}
		
	});
	
}, /* bExport = */ false);