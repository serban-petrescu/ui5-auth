/* global spet */
/**
 * Initialization Code and shared classes of library spet.auth.
 */
sap.ui.define([
"jquery.sap.global", 
"sap/ui/core/library",
"./Factory",
"./selector/IdSelector",
"./selector/PropertySelector",
"./selector/CustomDataSelector",
"./selector/ElementTypeSelector",
"./action/BaseAction",
"./action/RemoveAction",
"./action/SetPropertyAction",
"./action/BindPropertyAction",
"./helper/ExpressionHelper",
"sap/ui/model/json/JSONModel",
"sap/ui/core/mvc/XMLView",
"./ControlIterator",
"sap/ui/base/BindingParser",
"./action/AssociationDynamicAction",
"./action/ParentDynamicAction"
], function(jQuery, core, Factory, IdSelector, PropertySelector, CustomDataSelector, 
ElementTypeSelector, BaseAction, RemoveAction, SetPropertyAction, BindPropertyAction,
ExpressionHelper, JSONModel, XMLView, ControlIterator, BindingParser, AssociationDynamicAction,
ParentDynamicAction) {
	"use strict";

	/**
	 * Authorization adaptation classes.
	 *
	 * @namespace
	 * @name spet.auth
	 * @author Serban Petrescu
	 * @public
	 * @version @@version
	 */
	sap.ui.getCore().initLibrary({
		name : "spet.auth",
		version: "@@version",
		dependencies : ["sap.ui.core"],
		types: [],
		interfaces: [
			"spet.auth.ISelector",
			"spet.auth.IAction"
		],
		controls: [],
		elements: [
			"spet.auth.ExpressionHelper"
		],
		noLibraryCSS: true
	});
	
	// built in factory registration
	var oFactory = Factory.getInstance();
	oFactory.registerSelectorProvider("id", function(mSettings){return new IdSelector(mSettings);});
	oFactory.registerSelectorProvider("property", function(mSettings){return new PropertySelector(mSettings);});
	oFactory.registerSelectorProvider("custom-data", function(mSettings){return new CustomDataSelector(mSettings);});
	oFactory.registerSelectorProvider("element-type", function(mSettings){return new ElementTypeSelector(mSettings);});
	oFactory.registerActionProvider("nop", function(){return new BaseAction();});
	oFactory.registerActionProvider("hide", function(){return new SetPropertyAction({name: "visible", value: false});});
	oFactory.registerActionProvider("show", function(){return new SetPropertyAction({name: "visible", value: true});});
	oFactory.registerActionProvider("disable", function(){return new SetPropertyAction({name: "enabled", value: false});});
	oFactory.registerActionProvider("enable", function(){return new SetPropertyAction({name: "enabled", value: true});});
	oFactory.registerActionProvider("set-property", function(mSettings){return new SetPropertyAction(mSettings);});
	oFactory.registerActionProvider("bind-property", function(mSettings){return new BindPropertyAction(mSettings);});
	oFactory.registerActionProvider("remove", function(){return new RemoveAction();});
	oFactory.registerActionProvider("dynamic", function(mSettings){
		if (mSettings && mSettings.context && mSettings.context === "external") {
			return new AssociationDynamicAction(mSettings);
		}
		else {
			return new ParentDynamicAction(mSettings);
		}
	});
	
	
	/**
	 * Authorization adaptation action classes.
	 * Action classes are used to modify controls of the control tree.
	 *
	 * @namespace
	 * @name spet.auth.action
	 * @author Serban Petrescu
	 * @public
	 */
	 
	/**
	 * Authorization adaptation selector classes.
	 * Action classes are used to filter controls of the control tree.
	 *
	 * @namespace
	 * @name spet.auth.selector
	 * @author Serban Petrescu
	 * @public
	 */
	 
	/**
	 * Authorization adaptation helper classes and controls.
	 *
	 * @namespace
	 * @name spet.auth.helper
	 * @author Serban Petrescu
	 * @public
	 */
	
	/**
	 * Interface which must be implemented by classes used to select UI5 controls
	 * during control tree interation.
	 *
	 * @name spet.auth.ISelector
	 * @interface
	 * @public
	 */
	 
	/**
	 * Checks if the given object should be selected or not for further processing.
	 *
	 * @method
	 * @name spet.auth.ISelector#check
	 * @param	{sap.ui.mvc.View}			oView	The currently processed view.
	 * @param	{sap.ui.base.ManagedObject}	oObject	The object which should be checked.
	 * @returns {boolean}	A flag indicating if the object passed the filter.
	 */
	 
	/**
	 * Interface which used for performing actions of the objects of the control
	 * tree. Action instances should be completely reusable. This means that the
	 * initialization method may be called several times during the lifetime of
	 * the application.
	 * 
	 * @name spet.auth.IAction
	 * @interface
	 * @public
	 */
	 
	/**
	 * Initializes the action. This method is called before starting to iterate 
	 * the control tree.
	 *
	 * @method
	 * @name spet.auth.IAction#initialize
	 * @param	{sap.ui.mvc.View}	oView	The currently processed view.
	 * @returns {void}
	 */
	 
	/**
	 * Processes an object from the control tree.
	 *
	 * @method
	 * @name spet.auth.IAction#process
	 * @param	{sap.ui.base.ManagedObject}	oObject	The currently processed object.
	 * @returns {void}
	 */
	 
	/**
	 * Clean-up method. Called after the control tree iteration was finished.
	 *
	 * @method
	 * @name spet.auth.IAction#finalize
	 * @returns {void}
	 */
	 
	/**
	 * Utility method for computing the complete role map based on a role specification
	 * and the list of roles that the current user has.
	 *
	 * @method
	 * @name spet.auth#buildRoleMap
	 * @param	{object}	oSpec				The role configuration specification.
	 * @param	{string[]}	oSpec.roles			The list of design-time roles.
	 * @param	{object=}	oSpec.implications	An optional map between the name of 
	 * a role and a string array with the roles which derive (are implied) by that role.
	 * @param	{object=}	oSpec.expressions	An optional map between the name of
	 * a role and an expression which can be used to compute that role.
	 * @param	{string[]}	aROles				The roles which the current user has.
	 * @returns {object} A map between the role name and the role's state.
	 */
	spet.auth.buildRoleMap = (function() {
		
		/* Helper function for adding a role to the role map. */
		function addRole(mRoles, sRole) {
			if (!mRoles.hasOwnProperty(sRole)) {
				jQuery.sap.log.warning("The role " + sRole + " was not present in the specification.");
				mRoles[sRole] = true;
				return true;
			}
			else if (!mRoles[sRole]) {
				mRoles[sRole] = true;
				return true;
			}
			return false;
		}
		
		/* Helper function for creating the role map based solely on the input. */
		function buildInitialRoleMap(aSpecs, aRoles) {
			var mRoles = {}, i;
			for (i = 0; i < aSpecs.length; ++i) {
				mRoles[aSpecs[i]] = false;
			}
			for (i = 0; i < aRoles.length; ++i) {
				addRole(mRoles, aRoles[i]);
			}
			return mRoles;
		}
		
		/* Updates the preliminary role map based on the implications. */
		function updateBasedOnImplies(mRoles, mImplies) {
			var bChanged = false;
			for (var sKey in mImplies) {
				if (mImplies.hasOwnProperty(sKey) && mImplies[sKey].length && mRoles[sKey]) {
					for (var i = 0; i < mImplies[sKey].length; ++i) {
						bChanged = addRole(mRoles, mImplies[sKey][i]) || bChanged;
					}
				}
			}
			return bChanged;
		}
	
		/* Updates the preliminary role map based on the expression helpers. */
		function updateBasedOnHelpers(mRoles, mHelpers) {
			var bChanged = false;
			for (var sKey in mHelpers) {
				if (mHelpers.hasOwnProperty(sKey) && mHelpers[sKey].getResult()) {
					bChanged = addRole(mRoles, sKey) || bChanged;
				}
			}
			return bChanged;
		}
	
		/* Builds expression helpers (one helper for each expression). */
		function buildHelpers(mCalculated, oModel) {
			var mHelpers = {}, oHelper, oValue;
			for (var sKey in mCalculated) {
				if (mCalculated.hasOwnProperty(sKey)) {
					oValue = mCalculated[sKey];
					if (typeof oValue === "string" && oValue.indexOf("{=") === 0) {
						oValue = BindingParser.parseExpression(oValue, 2).result;
					}
					oHelper = new ExpressionHelper({ result: oValue });
					oHelper.bindElement({path: "/"});
					oHelper.setModel(oModel);
					mHelpers[sKey] = oHelper;
				}
			}
			return mHelpers;
		}
	
		return function(oSpec, aRoles) {
			var mRoles = buildInitialRoleMap(oSpec.roles || [], aRoles),
				oModel = new JSONModel(mRoles),
				mHelpers = buildHelpers(oSpec.expressions || {}, oModel),
				mImplies = oSpec.implications || {},
				bUpdated;
			do {
				bUpdated = updateBasedOnHelpers(mRoles, mHelpers) || updateBasedOnImplies(mRoles, mImplies);
				oModel.refresh();
			} while (bUpdated);
			return mRoles;
		};
	})();
	
	var mContexts = {},
		bRegistered = false;
	
	/**
	 * Builds a processing context. A context is a map between the view name and 
	 * the selectors & actions linked to that view.
	 * 
	 * @method
	 * @name spet.auth#buildContext
	 * @param	{object[]}	aActions	An array of action specifications.
	 * @param	{object}	mRoles		A map between the role name and a
	 * flag indicating if the current user has this role.
	 * @returns {object} A map between the view name and an array of action
	 * and selector pairs.
	 */
	spet.auth.buildContext = (function() {
		
		/* Checks if the given "when" clause evaluates to "true" based on the roles. */
		function isApplicable(sWhen, mRoles) {
			var aMatch;
			if (!sWhen || sWhen.toLowerCase() === ":always") {
				return true;
			}
			
			aMatch = sWhen.match(/^present:(.+)$/i);
			if (aMatch && aMatch.length >= 2) {
				return !!mRoles[aMatch[1]];
			}
			
			aMatch = sWhen.match(/^missing:(.+)$/i);
			if (aMatch && aMatch.length >= 2) {
				return !mRoles[aMatch[1]];
			}
		}
		
		/* Builds a single action-selector pair. */
		function buildSingle(mTarget, oSpec) {
			var aViews = (oSpec.view || oSpec.views || ":all").split(","),
				oEntry = {
					action: oFactory.createAction(oSpec.action && oSpec.action.type, oSpec.action),
					selector: oFactory.createSelector(oSpec.selector && oSpec.selector.type, oSpec.selector)
				};
			if (aViews.length && oEntry.action && oEntry.selector) {
				for (var i = 0; i < aViews.length; ++i) {
					if (!mTarget.hasOwnProperty(aViews[i])) {
						mTarget[aViews[i]] = [];
					}
					mTarget[aViews[i]].push(oEntry);
				}
			}
		}
		
		return function(aActions, mRoles) {
			var mResult = {},
				i;
			for (i = 0; i < aActions.length; ++i) {
				if (isApplicable(aActions[i].when, mRoles)) {
					buildSingle(mResult, aActions[i]);
				}
			}
			return mResult;
		};
	})();
	
	/**
	 * Processes a control tree by applying the actions in the context
	 * for the owner component. The processing is asynchronous (if the 
	 * authorization specification and role list were already retrieved,
	 * then the processing is done immeiately).
	 * 
	 * @method
	 * @name spet.auth#processControlTree
	 * @param	{string}			sComponentId	The owner component's ID.
	 * @param	{sap.ui.mvc.View}	oView			The parent view (which may
	 * or may not coincide with the root control).
	 * @param	{sap.ui.core.Element}	oRoot		The root of the tree.
	 * @returns {Promise}	A promise which is resolved when the tree processing
	 * was finished.
	 */
	spet.auth.processControlTree = function(sComponentId, oView, oRoot) {
		var sViewName = oView.getViewName(),
			oContext = mContexts[sComponentId],
			oDeferred = new jQuery.Deferred();
		if (oContext) {
			oContext.then(function(mContext) {
				var aActions = (mContext[":all"] || []).concat(oContext[sViewName] || []),
					oControl,
					oIt = new ControlIterator(oRoot),
					fnInitialize = function(oA) {
						oA.action.initialize(oView);
					},
					fnFinalize = function(oA) {
						oA.action.finalize();
					},
					fnProcess= function(oA) {
						if (oA.selector.check(oView, oControl)) {
							oA.action.process(oView, oControl, oIt);
						}
					};
				aActions.forEach(fnInitialize);
				while ((oControl = oIt.next()) !== null) {
					aActions.forEach(fnProcess);
				}
				aActions.forEach(fnFinalize);
				oDeferred.resolve();
			});
		}
		else {
			jQuery.sap.log.error("The component " + sComponentId + " is not registered.");
			oDeferred.resolve();
		}
		return oDeferred.promise();
	};
	
	/**
	 * Registers a component for processing. If this is the first component
	 * registered, then the global XML view processor is also registered.
	 * 
	 * @method
	 * @name spet.auth#registerComponent
	 * @param	{string}	sComponentId	The component's ID.
	 * @param	{object|string|deferred}	oSpec	The authorization spec.
	 * Can either be passed directly as a JS object, as a path string (which
	 * is used to trigger a GET request) or as a promise which resolves with
	 * the object.
	 * @param	{string[]|string|deferred}	aRoles	The current user's roles.
	 * Can either be passed directly as a JS object, as a path string (which
	 * is used to trigger a GET request) or as a promise which resolves with
	 * the roles.
	 * @returns {void}
	 */
	spet.auth.registerComponent = (function() {
		
		/*
		 * Retrieves a promise for an object. 
		 * Might trigger an AJAX request if the parameter is a string. 
		 */
		function getObject(oObject) {
			if (typeof oObject === "string") {
				return jQuery.get(oObject).then(function(oResponse){
					return oResponse;
				});
			}
			else {
				return jQuery.when(oObject);
			}
		}
		
		/* UI5 preprocessor function (adapter between the UI interface and the processControlTree. */
		function preprocess(oView, oInfo) {
			return spet.auth.processControlTree(oInfo.componentId, oView, oView);
		}
		
		return function(sComponentId, oSpec, aRoles) {
			var oDeferred = new jQuery.Deferred();
			mContexts[sComponentId] = oDeferred.promise();
			if (!bRegistered) {
				bRegistered = true;
				XMLView.registerPreprocessor("CONTROLS", preprocess, false);
			}
			jQuery.when(getObject(oSpec), getObject(aRoles)).then(function(oS, aR) {
				var mRoles = spet.auth.buildRoleMap(oS, aR),
					mContext = spet.auth.buildContext(oS.actions || [], mRoles);
				oDeferred.resolve(mContext);
			});
		};
	})();
	
	
	return spet.auth;
}, /* bExport= */ false);