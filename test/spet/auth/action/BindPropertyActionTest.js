sap.ui.define([
		"sap/ui/model/json/JSONModel",
		"spet/auth/action/BindPropertyAction",
		"spet/auth/library"
	], function(JSONModel, BindPropertyAction) {
		"use strict";
		
		QUnit.module("BindPropertyAction");
		
		QUnit.test("Property should be bounded (simple).", function (assert) {
			// Arrange
			var oModel = new JSONModel({text: "Something"}),
				oText = new sap.m.Text();
			oText.setModel(oModel);
			
			//Act
			var oAction = new BindPropertyAction({
				name: "text",
				info: {
					path: "/text"
				}
			});
			
			oAction.initialize(null);
			oAction.process(null, oText);
			oAction.finalize();

			// Assert
			assert.ok(oText.getBinding("text"), "Text value was bounded.");
			assert.equal(oText.getText(), "Something", "Text value was updated correctly.");
		});
		
		QUnit.test("Property should be bounded (formatter).", function (assert) {
			// Arrange
			var oModel = new JSONModel({text: "Something"}),
				oText = new sap.m.Text();
			oText.setModel(oModel);
			
			//Act
			var oAction = new BindPropertyAction({
				name: "text",
				info: {
					path: "/text",
					formatter: function(sText) {
						return sText.toUpperCase();
					}
				}
			});
			
			oAction.initialize(null);
			oAction.process(null, oText);
			oAction.finalize();

			// Assert
			assert.ok(oText.getBinding("text"), "Text value was bounded.");
			assert.equal(oText.getText(), "SOMETHING", "Text value was updated correctly.");
		});
		
		QUnit.test("Property should be bounded (expression).", function (assert) {
			// Arrange
			var oModel = new JSONModel({text: "Some", text2: "thing"}),
				oText = new sap.m.Text();
			oText.setModel(oModel);
			
			//Act
			var oAction = new BindPropertyAction({
				name: "text",
				info: "{= ${/text} + ${/text2} }"
			});
			
			oAction.initialize(null);
			oAction.process(null, oText);
			oAction.finalize();

			// Assert
			assert.ok(oText.getBinding("text"), "Text value was bounded.");
			assert.equal(oText.getText(), "Something", "Text value was updated correctly.");
		});
	}
);