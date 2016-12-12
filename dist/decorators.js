"use strict";
var angular = require("angular");
/**
 * Module decorator for creating an angular module and registering
 * components to it.
 */
function ngModule(config) {
    return function moduleDecorator(moduleClass) {
        // Normalize module dependencies to string names
        var dependencies = (config.dependencies || []).map(function (dependency) {
            return typeof dependency === 'string'
                ? dependency
                : dependency.$name;
        });
        var moduleInstance = angular.module(config.name, dependencies);
        // Register our run blocks
        for (var _i = 0, _a = config.configBlocks || []; _i < _a.length; _i++) {
            var configBlock = _a[_i];
            moduleInstance.config(configBlock);
        }
        // Register our config blocks
        for (var _b = 0, _c = config.runBlocks || []; _b < _c.length; _b++) {
            var runBlock = _c[_b];
            moduleInstance.config(runBlock);
        }
        // register our components
        for (var _d = 0, _e = config.components || []; _d < _e.length; _d++) {
            var component_1 = _e[_d];
            moduleInstance.component(component_1.$componentConfig.name, component_1.$componentConfig.config);
        }
        // register our services
        for (var _f = 0, _g = config.services || []; _f < _g.length; _f++) {
            var service_1 = _g[_f];
            moduleInstance.service(service_1.$injectAs, service_1);
        }
        moduleClass.$name = config.name;
    };
}
exports.ngModule = ngModule;
/**
 * Decorator for annotating classes with injectables.
 */
function inject() {
    var injectables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        injectables[_i] = arguments[_i];
    }
    return function injectDecorator(target) {
        target.$inject = injectables;
    };
}
exports.inject = inject;
/**
 * Decorator for annotating services with injectable key.
 */
function service(injectAs) {
    return function serviceDecorator(serviceConstructor) {
        serviceConstructor.$injectAs = injectAs;
    };
}
exports.service = service;
/**
 * Decorator for annotating component controllers with options
 * that will later be used to register to a module.
 */
function component(componentName, config) {
    return function componentDecorator(componentConstructor) {
        config.controller = componentConstructor;
        var bindings = componentConstructor.$componentConfig &&
            componentConstructor.$componentConfig.config &&
            componentConstructor.$componentConfig.config.bindings;
        if (bindings) {
            config.bindings = bindings;
        }
        componentConstructor.$componentConfig = {
            name: componentName,
            config: config
        };
    };
}
exports.component = component;
/**
 * Base decorator for binding component properties.
 */
function bind(binding) {
    return function bindingDecorator(target, propertyKey) {
        var bindings = (target.constructor.$componentConfig = target.constructor.$componentConfig || {
            name: undefined,
            config: { bindings: {} }
        }).config.bindings;
        bindings[propertyKey] = binding;
    };
}
/**
 * Decorator for binding component input properties.
 */
function input() {
    return bind('<');
}
exports.input = input;
/**
 * Decorator for binding component output properies.
 */
function output() {
    return bind('&');
}
exports.output = output;
/**
 * Bootstrap a module to the dom.
 */
function bootstrapModule(appId, moduleClass) {
    angular.bootstrap(document.getElementById(appId), [moduleClass.$name]);
}
exports.bootstrapModule = bootstrapModule;
