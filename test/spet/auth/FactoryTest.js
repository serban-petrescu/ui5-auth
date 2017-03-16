sap.ui.define([
		"spet/auth/Factory"
	], function(Factory) {
		"use strict";
		
		QUnit.module("Factory");
		
		QUnit.test("Custom selector and action should be created.", function (assert) {
			// Arrange
			var oCustom = {},
				fnProvider = function() {
					return oCustom;
				},
				oRa,
				oRs;
			
			//Act
			Factory.getInstance().registerSelectorProvider("custom", fnProvider);
			Factory.getInstance().registerActionProvider("custom", fnProvider);
			oRs = Factory.getInstance().createSelector("custom", {});
			oRa = Factory.getInstance().createAction("custom", {});
			
			// Assert
			assert.equal(oCustom, oRa, "The custom action was created.");
			assert.equal(oCustom, oRs, "The custom selector was created.");
		});
	
		QUnit.test("Unknown selector and action types.", function (assert) {
			// Arrange
			var oRa,
				oRs;
			
			//Act
			oRs = Factory.getInstance().createSelector("custom-2", {});
			oRa = Factory.getInstance().createAction("custom-2", {});
			
			// Assert
			assert.notOk(oRa, "The custom action was not created.");
			assert.notOk(oRs, "The custom selector was not created.");
		});
	
		QUnit.test("Invalid selector and action provider.", function (assert) {
			// Arrange
			var oRa,
				oRs;
			
			//Act
			Factory.getInstance().registerSelectorProvider("custom-3", {});
			Factory.getInstance().registerActionProvider("custom-3", {});
			oRs = Factory.getInstance().createSelector("custom-3", {});
			oRa = Factory.getInstance().createAction("custom-3", {});
			
			// Assert
			assert.notOk(oRa, "The custom action was not created.");
			assert.notOk(oRs, "The custom selector was not created.");
		});
	}
);