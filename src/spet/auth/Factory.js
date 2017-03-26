sap.ui.define([
	"jquery.sap.global"
], function(jQuery) {
	var oInstance;
	
	/**
	 * Factory class responsible for building actions and selectors.
	 * Custom actions and selectors may be registered with this class.
	 * @class
	 * @name spet.auth.Factory
	 */
	function Factory() {
		var mSelectorPoviders = {},
			mActionProviders = {};
		
		/**
		 * Registers a new provider (factory method) for a selector type.
		 * @function
		 * @name spet.auth.Factory#registerSelectorProvider
		 */
		this.registerSelectorProvider = function(sType, fnProvider) {
			if (typeof fnProvider === "function") {
				mSelectorPoviders[sType] = fnProvider;
			}
			else {
				jQuery.sap.log.warning("Invalid selector provider type (it must be a function).");
			}
		};
		
		/**
		 * Creates a new selector based on the type and settings.
		 * @function
		 * @name spet.auth.Factory#createSelector
		 * @returns {spet.auth.ISelector|null} A selector or null if no provider is registered for the given type.
		 */
		this.createSelector = function(sType, mSettings){
			if (mSelectorPoviders.hasOwnProperty(sType)) {
				return mSelectorPoviders[sType](mSettings);
			}
			else {
				jQuery.sap.log.warning("Unknown selector type: " + sType + ".");
			}
		};
		
		/**
		 * Registers a new provider (factory method) for a action type.
		 * @function
		 * @name spet.auth.Factory#registerActionProvider
		 */
		this.registerActionProvider = function(sType, fnProvider) {
			if (typeof fnProvider === "function") {
				mActionProviders[sType] = fnProvider;
			}
			else {
				jQuery.sap.log.warning("Invalid action provider type (it must be a function).");
			}
		};
		
		/**
		 * Creates a new action based on the type and settings.
		 * @function
		 * @name spet.auth.Factory#createAction
		 * @returns {spet.auth.IAction|null} An action or null if no provider is registered for the given type.
		 */
		this.createAction = function(sType, mSettings){
			if (mActionProviders.hasOwnProperty(sType)) {
				return mActionProviders[sType](mSettings);
			}
			else {
				jQuery.sap.log.warning("Unknown action type: " + sType + ".");
			}
		};
	}
	
	oInstance = new Factory();
	
	/**
	 * Retrieves the singleton instance which is used by the library.
	 * @function
	 * @static
	 * @name spet.auth.Factory#getInstance
	 * @returns {spet.auth.Factory} The singleton instance.
	 */
	Factory.getInstance = function() {
		return oInstance;
	};
	
	return Factory;
	
}, /* bExport = */ false);