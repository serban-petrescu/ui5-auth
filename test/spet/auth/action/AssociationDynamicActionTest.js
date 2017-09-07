sap.ui.define([
		"./VisitingAction",
		"spet/auth/Factory",
		"spet/auth/action/AssociationDynamicAction",
		"spet/auth/library"
	], function(VisitingAction, Factory, AssociationDynamicAction) {
		"use strict";
		
		QUnit.module("AssociationDynamicAction");
		
		QUnit.test("Dynamic action should work on view.", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text(),
				oToolbar = new sap.m.Toolbar();
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			oView.addContent(oPanel);
			Factory.getInstance().registerActionProvider("custom", function(mSettings) {
				return new VisitingAction(mSettings);
			});
			
			//Act
			var oAction = new AssociationDynamicAction({
				value: true,
				"when-missing": {
					type: "custom",
					value: false
				},
				"when-present": {
					type: "custom",
					value: true
				}
			});
			oAction.initialize(oView);
			oAction.process(oView, oBox2);
			oAction.finalize();

			// Assert
			assert.ok(oBox2.visited, "Box2 was visited.");
			assert.ok(oView.getDependents(), "View dependents initialized.");
			assert.ok(oView.getDependents().length, "View has dependents.");
			assert.ok(oView.getDependents()[0].getRole(), "Helper role is present.");
			assert.ok(oView.getDependents()[0].getWhenMissing() instanceof VisitingAction, "Helper when-mising action is ok.");
			assert.ok(oView.getDependents()[0].getWhenPresent() instanceof VisitingAction, "Helper when-present action is ok.");
			assert.ok(oView.getDependents()[0].getElements(), "Helper elements initialized.");
			assert.ok(oView.getDependents()[0].getElements().length, "Helper has elements.");
			assert.equal(oView.getDependents()[0].getElements()[0], oBox2.getId(), "Box2 is an element of helper.");
			
			//Act
			oView.getDependents()[0].setRole(false);
			
			// Assert
			assert.notOk(oBox2.visited, "Box2 was not visited (after change).");
		});
		
		QUnit.test("Dynamic action should work on target (panel).", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(oView.createId("panel")),
				oBox2 = new sap.m.VBox();
			oPanel.addContent(oBox2);
			oView.addContent(oPanel);
			Factory.getInstance().registerActionProvider("custom", function(mSettings) {
				return new VisitingAction(mSettings);
			});
			
			//Act
			var oAction = new AssociationDynamicAction({
				value: true,
				target: "panel",
				"when-missing": {
					type: "custom",
					value: false
				},
				"when-present": {
					type: "custom",
					value: true
				}
			});
			oAction.initialize(oView);
			oAction.process(oView, oBox2);
			oAction.finalize();

			// Assert
			assert.ok(oBox2.visited, "Box2 was visited.");
			assert.ok(oPanel.getDependents(), "Panel dependents initialized.");
			assert.ok(oPanel.getDependents().length, "Panel has dependents.");
			assert.ok(oPanel.getDependents()[0].getRole(), "Helper role is present.");
			assert.ok(oPanel.getDependents()[0].getWhenMissing() instanceof VisitingAction, "Helper when-mising action is ok.");
			assert.ok(oPanel.getDependents()[0].getWhenPresent() instanceof VisitingAction, "Helper when-present action is ok.");
			assert.ok(oPanel.getDependents()[0].getElements(), "Helper elements initialized.");
			assert.ok(oPanel.getDependents()[0].getElements().length, "Helper has elements.");
			assert.equal(oPanel.getDependents()[0].getElements()[0], oBox2.getId(), "Box2 is an element of helper.");
			
			//Act
			oPanel.getDependents()[0].setRole(false);
			
			// Assert
			assert.notOk(oBox2.visited, "Box2 was not visited (after change).");
		});
		
		QUnit.test("Dynamic action should work on view with promise.", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(),
				oBox2 = new sap.m.VBox(),
				oDeferred = new jQuery.Deferred();
			oPanel.addContent(oBox2);
			oView.addContent(oPanel);
			Factory.getInstance().registerActionProvider("custom", function(mSettings) {
				return new VisitingAction(mSettings);
			});
			
			//Act
			var oAction = new AssociationDynamicAction({
				value: oDeferred.promise(),
				"when-missing": {
					type: "custom",
					value: false
				},
				"when-present": {
					type: "custom",
					value: true
				}
			});
			oAction.initialize(oView);
			oAction.process(oView, oBox2);
			oAction.finalize();

			// Assert
			assert.notOk(oBox2.visited, "Box2 was not yet visited.");
			
			//Act
			oDeferred.resolve(true);
			
			// Assert
			assert.ok(oBox2.visited, "Box2 was visited (after resolve).");
		});
		
		QUnit.test("Dynamic action should work with interleaving promises.", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(),
				oBox2 = new sap.m.VBox(),
				oDeferred1 = new jQuery.Deferred(),
				oDeferred2 = new jQuery.Deferred();
			oPanel.addContent(oBox2);
			oView.addContent(oPanel);
			Factory.getInstance().registerActionProvider("custom", function(mSettings) {
				return new VisitingAction(mSettings);
			});
			
			//Act
			var oAction = new AssociationDynamicAction({
				value: oDeferred1.promise(),
				"when-missing": {
					type: "custom",
					value: false
				},
				"when-present": {
					type: "custom",
					value: true
				}
			});
			oAction.initialize(oView);
			oAction.process(oView, oBox2);
			oAction.finalize();

			// Assert
			assert.notOk(oBox2.visited, "Box2 was not yet visited.");
			
			//Act
			oView.getDependents()[0].setRole(oDeferred2);
			oDeferred1.resolve(false);
			
			// Assert
			assert.notOk(oBox2.visited, "Box2 was not yet visited (after first resolve).");
			
			//Act
			oDeferred2.resolve(true);
			
			// Assert
			assert.ok(oBox2.visited, "Box2 was visited (after second resolve).");
		});
		
		
		QUnit.test("Dynamic action should not attach.", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				});
			Factory.getInstance().registerActionProvider("custom", function(mSettings) {
				return new VisitingAction(mSettings);
			});
			
			//Act
			var oAction = new AssociationDynamicAction({
				value: true,
				"when-missing": {
					type: "custom",
					value: false
				},
				"when-present": {
					type: "custom",
					value: true
				}
			});
			oAction.initialize(null);
			oAction.finalize();

			// Assert
			assert.ok(!oView.getDependents() || !oView.getDependents().length, "View does not have dependents.");
		});
	}
);