sap.ui.define([
		"spet/auth/library",
		"spet/auth/action/RemoveAction",
		"spet/auth/selector/IdSelector",
		"spet/auth/action/AssociationDynamicAction",
		"spet/auth/action/ParentDynamicAction",
		"spet/auth/Factory"
	], function(library, RemoveAction, IdSelector, AssociationDynamicAction, ParentDynamicAction, Factory) {
		"use strict";
		
		QUnit.module("library");
		
		QUnit.test("Plain role map should be build.", function (assert) {
			// Arrange
			var oSpec = {
					roles: ["a", "b", "c", "d"]
				},
				aRoles = ["a", "b", "c"],
				mResult,
				mExpected = {
					a: true,
					b: true,
					c: true,
					d: false
				};
			
			//Act
			mResult = library.buildRoleMap(oSpec, aRoles);

			// Assert
			assert.deepEqual(mResult, mExpected, "Box1 was visited.");
		});
		
		QUnit.test("Plain role map should be built.", function (assert) {
			// Arrange
			var oSpec = {
					roles: ["a", "b", "c", "d"]
				},
				aRoles = ["a", "b", "c"],
				mResult,
				mExpected = {
					a: true,
					b: true,
					c: true,
					d: false
				};
			
			//Act
			mResult = library.buildRoleMap(oSpec, aRoles);

			// Assert
			assert.deepEqual(mResult, mExpected, "Box1 was visited.");
		});
		
		QUnit.test("Plain role map should be built (with missing entry).", function (assert) {
			// Arrange
			var oSpec = {
					roles: ["a", "b", "c", "d"]
				},
				aRoles = ["a", "b", "e"],
				mResult,
				mExpected = {
					a: true,
					b: true,
					c: false,
					d: false,
					e: true
				};
			
			//Act
			mResult = library.buildRoleMap(oSpec, aRoles);

			// Assert
			assert.deepEqual(mResult, mExpected, "Box1 was visited.");
		});
		
		QUnit.test("Plain role map should be built (with simple implication).", function (assert) {
			// Arrange
			var oSpec = {
					roles: ["a", "b", "c", "d"],
					implications: {
						"a": ["b", "c"]
					}
				},
				aRoles = ["a", "d"],
				mResult,
				mExpected = {
					a: true,
					b: true,
					c: true,
					d: true
				};
			
			//Act
			mResult = library.buildRoleMap(oSpec, aRoles);

			// Assert
			assert.deepEqual(mResult, mExpected, "Role map was built correctly.");
		});
		
		QUnit.test("Plain role map should be built (with simple expression).", function (assert) {
			// Arrange
			var oSpec = {
					roles: ["a", "b", "c", "d"],
					expressions: {
						"a": "{= ${b} || (${c} && ${d}) }"
					}
				},
				aRoles1 = ["c", "d"],
				aRoles2 = ["b"],
				aRoles3 = ["d"],
				mResult1,
				mResult2,
				mResult3,
				mExpected1 = {
					a: true,
					b: false,
					c: true,
					d: true
				},
				mExpected2 = {
					a: true,
					b: true,
					c: false,
					d: false
				},
				mExpected3 = {
					a: false,
					b: false,
					c: false,
					d: true
				};
			
			//Act
			mResult1 = library.buildRoleMap(oSpec, aRoles1);
			mResult2 = library.buildRoleMap(oSpec, aRoles2);
			mResult3 = library.buildRoleMap(oSpec, aRoles3);

			// Assert
			assert.deepEqual(mResult1, mExpected1, "Role map 1 was built correctly.");
			assert.deepEqual(mResult2, mExpected2, "Role map 2 was built correctly.");
			assert.deepEqual(mResult3, mExpected3, "Role map 3 was built correctly.");
		});
		
		QUnit.test("Plain role map should be built (complex).", function (assert) {
			// Arrange
			var oSpec = {
					roles: ["a", "b", "c", "d", "e", "f", "g", "h"],
					implications: {
						"a": ["c"],
						"c": ["d", "b"]
					},
					expressions: {
						"e": "{= ${c} && ${d} }",
						"g": "{= ${f} || ${e} }",
						"h": "{= ${g} && ${d} }"
					}
				},
				aRoles = ["a"],
				mResult,
				mExpected = {
					a: true,
					b: true,
					c: true,
					d: true,
					e: true,
					f: false,
					g: true,
					h: true
				};
			
			//Act
			mResult = library.buildRoleMap(oSpec, aRoles);

			// Assert
			assert.deepEqual(mResult, mExpected, "Role map was built correctly.");
		});
		
		QUnit.test("Build context.", function (assert) {
			// Arrange
			var mRoles = {
					a: true,
					b: true,
					c: false
				},
				aActions = [{
					view: "A",
					when: "present:a",
					selector: {
						type: "id",
						value: "test"
					},
					action: {
						type: "remove"
					}
				},{
					view: "A",
					when: ":always",
					selector: {
						type: "id",
						value: "test"
					},
					action: {
						type: "remove"
					}
				},{
					view: "A",
					when: "missing:c",
					selector: {
						type: "id",
						value: "test"
					},
					action: {
						type: "remove"
					}
				},{
					view: "A",
					when: "missing:a",
					selector: {
						type: "id",
						value: "test"
					},
					action: {
						type: "show"
					}
				}],
				mContext;
			
			//Act
			mContext = library.buildContext(aActions, mRoles);

			// Assert
			assert.ok(mContext.A, "Context contains the A view.");
			assert.ok(mContext.A[0].action instanceof RemoveAction, "The context action is of type remove");
			assert.ok(mContext.A[1].action instanceof RemoveAction, "The context action is of type remove");
			assert.ok(mContext.A[2].action instanceof RemoveAction, "The context action is of type remove");
			assert.ok(mContext.A[0].selector instanceof IdSelector, "The context selector is of type ID");
			assert.ok(mContext.A[1].selector instanceof IdSelector, "The context selector is of type ID");
			assert.ok(mContext.A[2].selector instanceof IdSelector, "The context selector is of type ID");
		});
		
		QUnit.test("Texts should be removed.", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text(),
				oToolbar = new sap.m.Toolbar(),
				oSpec = {
					roles: ["a", "b", "c"],
					actions: [{
						view: ":all",
						when: "present:a",
						selector: {
							type: "element-type",
							value: "sap.m.Text"
						},
						action: {
							type: "remove"
						}
					}]
				};
			
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			oView.addContent(oPanel);
			
			//Act
			library.registerComponent("test", oSpec, ["a"]);
			library.processControlTree("test", oView, oView);

			// Assert
			assert.equal(oBox1.getItems().length, 0, "Box1 is empty.");
			assert.equal(oBox2.getItems().length, 0, "Box2 is empty.");
		});
		
		QUnit.test("Nothing should be changed (wrong component id).", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text(),
				oToolbar = new sap.m.Toolbar(),
				oSpec = {
					roles: ["a", "b", "c"],
					actions: [{
						view: ":all",
						when: "present:a",
						selector: {
							type: "element-type",
							value: "sap.m.Text"
						},
						action: {
							type: "remove"
						}
					}]
				};
			
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			oView.addContent(oPanel);
			
			//Act
			library.registerComponent("test-2", oSpec, ["a"]);
			library.processControlTree("tests", oView, oView);

			// Assert
			assert.equal(oBox1.getItems().length, 1, "Box1 is not empty.");
			assert.equal(oBox2.getItems().length, 1, "Box2 is not empty.");
		});
		
		
		QUnit.test("Texts should be removed (spec and roles loaded with AJAX).", function (assert) {
			// Arrange
			var oView = sap.ui.xmlview({
					viewContent: "<mvc:View xmlns:mvc=\"sap.ui.core.mvc\" />"
				}),
				oPanel = new sap.m.Panel(),
				oBox1 = new sap.m.HBox(),
				oBox2 = new sap.m.VBox(),
				oText1 = new sap.m.Text(),
				oText2 = new sap.m.Text(),
				oToolbar = new sap.m.Toolbar(),
				sSpec = jQuery.sap.getModulePath("test.unit", "/spec.json"),
				sRoles = jQuery.sap.getModulePath("test.unit", "/roles.json");
			
			oBox1.addItem(oText1);
			oBox2.addItem(oText2);
			oPanel.addContent(oBox1);
			oPanel.addContent(oBox2);
			oPanel.setHeaderToolbar(oToolbar);
			oView.addContent(oPanel);
			
			var fnDone = assert.async();
			
			//Act
			library.registerComponent("test", sSpec, sRoles);
			library.processControlTree("test", oView, oView).then(function() {
				// Assert
				assert.equal(oBox1.getItems().length, 0, "Box1 is empty.");
				assert.equal(oBox2.getItems().length, 0, "Box2 is empty.");
			}).always(fnDone);

		});
		
		QUnit.test("Texts should be removed (view preprocessing).", function (assert) {
			// Arrange
			var sSpec = jQuery.sap.getModulePath("test.unit", "/spec.json"),
				sRoles = jQuery.sap.getModulePath("test.unit", "/roles.json");
			
			var fnDone = assert.async();
			
			//Act
			library.registerComponent(undefined, sSpec, sRoles);
			
			var oView = sap.ui.xmlview({
				"viewName": "test.unit.Test",
				"async": true
			});
			
			oView.attachEventOnce("afterInit", function() {
				// Assert
				assert.equal(oView.byId("box1").getItems().length, 0, "Box1 is empty.");
				assert.equal(oView.byId("box2").getItems().length, 0, "Box2 is empty.");
				fnDone();
			});
		});
		
		QUnit.test("Right pre-defined dynamic types should be instantiated.", function (assert) {
			//Act
			var oParent = Factory.getInstance().createAction("dynamic", {
					"value": true,
					"when-missing": {
						"type": "hide"
					},
					"when-present": {
						"type": "show"
					}
				}),
				oAssoc = Factory.getInstance().createAction("dynamic", {
					"context": "external",
					"value": true,
					"when-missing": {
						"type": "hide"
					},
					"when-present": {
						"type": "show"
					}
				});
			
			//Assert
			assert.ok(oParent instanceof ParentDynamicAction, "Parent dynamic action instantiated correctly.");
			assert.ok(oAssoc instanceof AssociationDynamicAction, "Association dynamic action instantiated correctly.");
		});
	}
);