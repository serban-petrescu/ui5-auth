sap.ui.define([
	"./BaseDynamicActionHelper"
], function(BaseDynamicActionHelper) {
	
	/**
	 * Dynamic action helper which acts upon the parent element.
	 * @class
	 * @name spet.auth.helper.ParentDynamicActionHelper
	 * @extends {spet.auth.helper.BaseDynamicActionHelper}
	 */
	return BaseDynamicActionHelper.extend("spet.auth.helper.ParentDynamicActionHelper", {
		getSelectedElements: function() {
			return this.getParent() ? [this.getParent()] : [];
		}
	});
	
}, /* bExport = */ false);