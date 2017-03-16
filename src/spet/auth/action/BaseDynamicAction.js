sap.ui.define([
	"./BaseAction",
	"spet/auth/Factory"
], function(BaseAction, Factory) {
	
	/**
	 * Base dynamic action class. Dynamic actions attach helpers to the 
	 * control tree and defer action execution to the helper objects.
	 * Each helper should have a pair of actions: one which is executed
	 * when the helper's value evaluates to true (i.e. the user has the
	 * authority to perform an action) and one when the value is false.
	 * @class
	 * @abstract
	 * @name spet.auth.action.BaseDynamicAction
	 * @extends {spet.auth.action.BaseAction}
	 */
	return BaseAction.extend("spet.auth.action.BaseDynamicAction", {
		
		_aHelperInfos: null,
		_oWhenMissing: null,
		_oWhenPresent: null,
		_oValue: null,
		
		constructor: function(mSettings) {
			var oWhenMissing = mSettings["when-missing"] || {},
				oWhenPresent = mSettings["when-present"] || {};
			this._oValue = mSettings.value;
			this._oWhenMissing = Factory.getInstance().createAction(oWhenMissing.type, oWhenMissing);
			this._oWhenPresent = Factory.getInstance().createAction(oWhenPresent.type, oWhenPresent);
		},
		
		initialize: function() {
			this._aHelperInfos = [];
			this._oWhenMissing.initialize();
			this._oWhenPresent.initialize();
		},
		
		finalize: function() {
			this._aHelperInfos.forEach(function(oInfo){
				oInfo.control.addDependent(oInfo.helper);
				oInfo.helper.refresh();
			});
			this._oWhenMissing.finalize();
			this._oWhenPresent.finalize();
		}
		
	});
	
}, /* bExport = */ false);