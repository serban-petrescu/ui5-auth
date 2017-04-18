# UI5 Authorization [![Build Status](https://travis-ci.org/serban-petrescu/ui5-auth.svg?branch=master)](https://travis-ci.org/serban-petrescu/ui5-auth) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.svg)](https://gruntjs.com/)
## Introduction
Lightweight library which enables developers to build user interfaces which adapt at runtime to user roles. The main goal of this library is to decouple the responsibilities of regular UI5 applications: role-based adaptation should be done declaratively and centrally for each app. This ensures that any changes to the authorization schema of the application (or suite of applications) do not require changes throughout the views and fragments of the UI.

## Prerequisites
To be able to use this library, the apps must adhere to the following constraints (derived from the design assumptions of the library):

1. **All views and fragments should be XML-based.** The library uses [XML View Preprocessing](https://openui5.hana.ondemand.com/#docs/guide/48b81b967af34ad08f1f88c962b4740a.html) to modify the control tree. This is a hard constraint, so a complete remake of the library would be needed to be able to use it with other types of views.
2. **All views should be loaded asynchronously.** The XML preprocessing is done asynchronously, because the authorization specification and the user roles *may* be loaded asynchronously. If synchronous loading is needed, then the library can be easily adjusted (by a third party) to process the views synchronously (a prerequisite would be to load the spec and user roles synchronously).

## Current Features
Note that the library is still *work in progress*. The following capabilities are supported:
- Role inference: a role may imply a set of other roles (e.g. Admin implies that you have all other roles). 
- Role-based expressions: a role may be calculated from other roles (via UI5 [property binding](https://openui5.hana.ondemand.com/#docs/guide/91f0652b6f4d1014b6dd926db0e91070.html) syntax: simple, complex or expression-based).
- Selectors (classes which select controls based on some logic):
  - ID-based
  - Custom-data-based
  - Property-value-based
  - Element-type-based
- Actions (performed on the selected controls):
  - Remove
  - Hide / Show
  - Disable / Enable
  - Set the value of a property
  - Bind a property
  - Dynamic: perform other actions based on a boolean value that may change during the application execution. This boolean value may be statically specified or bound using UI5 property binding. The binding can use either properties relative to the binding context of the target control or properties relative to the binding context of another control (specified by ID). The value itself may be resolved synchronously (e.g. via a simple expression binding) or asynchronously (by returning a deferred object; this allow applications to perform a backend request to determine if the user has the necessary roles). 
- Extendable: custom selectors or actions can be added by the target applications.
  
## How can I use it?
The whole goal of the library is to be non-invasive. As such, only the following things must be done such that you can use it:
- Reference the library in your app. There are several blogs on SCN on how to use a custom library in a UI5 application. You can download the latest build of the library from [here](https://serban-petrescu.github.io/ui5-auth/latest.zip). 
- Write a authorization specification `.json` file with the following structure:
  ```javascript
  {
    "roles": ["A", "B", "C" /* string array of all possible roles. */ ],
    "implications": { /* optional map between role name and implies roles */
      "A": ["B"] // A implies B
    },
    "expressions": { /* optional map between role name and calculation expression */
      "C": "{= ${A} && ${B} }" // C = A && B
    },
    "actions": [{ /* array of actions which should be performed */
      "when": "missing:A", // criteria specifying when the action should be executed
                           // it can in one of the following forms: 'missing:{role}', 
                           // 'present:{role}' or ':always'
                           
      "views": ":all",     // optional comma separated view name list. If it is not
                           // specified, then it is applied to all the views. The
                           // special identifier ":all" may also be used (same effect)
      
      "selector": {        // mandatory selector specification
        "type": "id",      // mandatory selector type
        // selector specific properties (0 or more)
        "value": "btnSmth" 
      },
      
      "action": {          // mandatory action specification
        "type": "remove",  // mandatory action type
        // action specific properties (0 or more)
      }
    }] 
  }
  ```
- Obtain the current user's role list. This is application specific (in the future, some predefined adapters may also be added to the library). The roles should be passed to the library as an array of strings (role names).
- Register the current component, with the authorization specification and role list, to the library:
  ```javascript
  // either the spec / role arrays are passed directly, or a string
  // with the path towards a json file containing either of them, or
  // a promise which is resolved with either of them.
  spet.auth.registerComponent(this.getId(), oSpecification, aRoles);
  ```
- All views which are loaded after this point will be automatically processed by the library. If a view or model is built or instantiated in a different manor (e.g. imperative instantiation of a fragment - which should be avoided) then the `spet.auth.processControlTree` method may be used.

## Best Practices
You can do a number of things to ensure that you don't run into problems:
- Avoid imperative manipulation of properties that are changed by the library. For simple actions, changes are done only once during view preprocessing, so these changes might be irreversibly reverted by your controller code.
- Favor declarative bindings such that all the bindings and templates exist when the preprocessing is done.
- Favor declarative fragment instantiation (to avoid the point from above).

## Links
- Sample: [wrapper.html](https://serban-petrescu.github.io/ui5-auth/sample/wrapper.html). For the sample, the authorization specification is located here: [auth.json](https://serban-petrescu.github.io/ui5-auth/sample/auth.json). The role list is derived from the checkboxes in the top of the page. Make sure to press the "Refresh" button after changing the checkboxes.
- JsDoc: [index.html](https://serban-petrescu.github.io/ui5-auth/doc/index.html)
- Test suite: [index.qunit.html?coverage](https://serban-petrescu.github.io/ui5-auth/test/spet/auth/index.qunit.html?coverage).
- Latest build: [latest.zip](https://serban-petrescu.github.io/ui5-auth/latest.zip).
