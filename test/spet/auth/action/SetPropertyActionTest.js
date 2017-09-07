sap.ui.define([
		"spet/auth/action/SetPropertyAction",
		"spet/auth/library"
	], function(SetPropertyAction) {
		"use strict";
		
		QUnit.module("SetPropertyAction");
		
		QUnit.test("Property should be changed.", function (assert) {
			// Arrange
			var oText = new sap.m.Text();
			
			//Act
			var oAction = new SetPropertyAction({
				name: "text",
				value: "Something"
			});
			
			oAction.initialize(null);
			oAction.process(null, oText);
			oAction.finalize();

			// Assert
			assert.equal(oText.getText(), "Something", "Text value was updated correctly.");
		});
		
		
		QUnit.test("Unknown property should be ignored.", function (assert) {
			// Arrange
			var oText = new sap.m.Text();
			
			//Act
			var oAction = new SetPropertyAction({
				name: "text2",
				value: "Something"
			});
			
			oAction.initialize(null);
			oAction.process(null, oText);
			oAction.finalize();

			// Assert
			assert.notOk(oText.getText(), "Text value was initial.");
		});
	}
);