sap.ui.define([
	"sap/ui/core/Control"
], function(Control) {

	/**
	 * Helper object for dynamic actions. Helper objects are designed
	 * to be injected inside the control tree in order to perform
	 * actions based on the binding context of the parent element.
	 * @class
	 * @abstract
	 * @name spet.auth.helper.BaseDynamicActionHelper
	 * @property	{boolean|Deferred}	role	The role value. If
	 * a deferred object is given, then the actions are executed only
	 * when the deferred is resolved.
	 * @property	{spet.auth.IAction} whenPresent	The action that 
	 * shoudl be executed when the role is present.
	 * @property	{spet.auth.IAction}	whenMissing	The action that 
	 * should be executed when the role is missing.
	 */
	return Control.extend("spet.auth.helper.BaseDynamicActionHelper", {
		metadata: {
			properties: {
				role: {
					type: "any"
				},
				whenPresent: {
					type: "spet.auth.IAction"
				},
				whenMissing: {
					type: "spet.auth.IAction"
				}
			},
			associations: {
				view: {
					type: "sap.ui.core.mvc.View",
					multiple: false
				}
			}
		},

		_counter: 0,

		setRole: function(oValue) {
			this.setProperty("role", oValue);
			jQuery.when(oValue).then(this.updateRole.bind(this, ++this._counter));
		},

		/**
		 * Called when the role is updated.
		 * @name spet.auth.helper.BaseDynamicActionHelper#updateRole
		 * @param	{integer}	iCounter	The request counter
		 * at the moment when the role update was received. This 
		 * is used to ensure that interleaving promises do not
		 * cause unexpected behavior.
		 * @returns {void}
		 */
		updateRole: function(iCounter, bRole) {
			if (iCounter === this._counter) {
				this.setProperty("role", bRole);
				this.refresh();
			}
		},
		
		/**
		 * Re-applies the actions to the control tree.
		 * @name spet.auth.helper.BaseDynamicActionHelper#refresh
		 * @returns {void}
		 */
		refresh: function() {
			var oAction = null,
				oView = sap.ui.getCore().byId(this.getView());
			if (this.getRole() === true) {
				oAction = this.getWhenPresent();
			} else if (this.getRole() === false) {
				oAction = this.getWhenMissing();
			}
			if (oAction) {
				this.getSelectedElements().forEach(function(oC) {
					oAction.process(oView, oC);
				});
			}
		}

	});

}, /* bExport = */ false);