sap.ui.define([
	"./BaseDynamicActionHelper"
], function(BaseDynamicActionHelper) {
	
	/**
	 * Dynamic action helper which stores the controls that
	 * it should act upon inside an association.
	 * @class
	 * @name spet.auth.helper.AssociationDynamicActionHelper
	 * @extends {spet.auth.helper.BaseDynamicActionHelper}
	 */
	return BaseDynamicActionHelper.extend("spet.auth.helper.AssociationDynamicActionHelper", {
		metadata: {
			associations: {
				elements: {type: "sap.ui.core.Element", multiple: true}
			}
		},
		
		getSelectedElements: function() {
			return (this.getElements() || []).map(function(sId) {
				return sap.ui.getCore().byId(sId);
			});
		}
	});
	
}, /* bExport = */ false);