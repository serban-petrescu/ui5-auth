sap.ui.define([
	"sap/ui/core/Element"
], function(Element) {
	
	/**
	 * Helper object used to evaluate expressions.
	 * @class	
	 * @name spet.auth.selector.ExpressionHelper
	 * @property	{boolean}	result	The result of the expression.
	 */
	return Element.extend("spet.auth.selector.ExpressionHelper", {
		metadata: {
			properties: {
				result: {type: "boolean", defaultValue: false}
			}
		}
	});
	
}, /* bExport = */ false);