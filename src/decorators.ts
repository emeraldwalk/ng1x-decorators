import * as angular from 'angular';

/**
 * Extend module constructors with name.
 */
export interface IModule extends Function {
    $name?: string;
}

export type IInjectable = {
    $injectAs?: string;
} & Function;

export type IModuleConfig = {
    name: string,
    dependencies?: Array<IModule|string>,
    configBlocks?: Array<Function|Array<any>>,
    runBlocks?: Array<Function>,
    components?: Array<IComponentConstructor>,
    services?: Array<IInjectable>
};

export type IComponentConfig = ng.IComponentOptions & {
    selector: string;
}

/**
 * Extend component constructors with configuration details.
 */
export type IComponentConstructor = ng.Injectable<ng.IControllerConstructor> & {
    $componentConfig?: IComponentConfig
};

/**
 * Module decorator for creating an angular module and registering
 * components to it.
 */
export function ngModule(config: IModuleConfig): ClassDecorator {
    return function moduleDecorator(moduleClass: IModule) {
        // Normalize module dependencies to string names
        let dependencies = (config.dependencies || []).map(dependency => {
            return typeof dependency === 'string'
                ? dependency
                : dependency.$name;
        });

        let moduleInstance = angular.module(config.name, dependencies);

        // Register our run blocks
        for(let configBlock of config.configBlocks || []) {
            moduleInstance.config(configBlock);
        }

        // Register our config blocks
        for(let runBlock of config.runBlocks || []) {
            moduleInstance.config(runBlock);
        }

        // register our components
        for (let component of config.components || []) {
            moduleInstance.component(
                dashToCamelCase(component.$componentConfig.selector),
                component.$componentConfig);
        }

        // register our services
        for(let service of config.services || []) {
            moduleInstance.service(service.$injectAs, service);
        }

        moduleClass.$name = config.name;
    };
}

/**
 * Decorator for annotating classes with injectables.
 */
export function inject(...injectables: Array<string>): ClassDecorator {
    return function injectDecorator(target: Function) {
        target.$inject = injectables;
    }
}

/**
 * Decorator for annotating services with injectable key.
 */
export function service(injectAs: string): ClassDecorator {
    return function serviceDecorator(serviceConstructor: IInjectable) {
        serviceConstructor.$injectAs = injectAs;
    };
}

/**
 * Convert a camelCase string to dash-case.
 */
function camelToDashCase(text: string): string {
    return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert a dash-case string to camelCase.
 */
function dashToCamelCase(text: string): string {
    return text.replace(/(-)(.)/g, (match, dash, char: string) => char.toUpperCase());
}

/**
 * Decorator for annotating component controllers with options
 * that will later be used to register to a module.
 */
export function component(config: IComponentConfig): ClassDecorator {
    return function componentDecorator(componentConstructor: IComponentConstructor) {
        config.controller = componentConstructor;

        let bindings =
            componentConstructor.$componentConfig &&
            componentConstructor.$componentConfig.bindings;

        if (bindings) {
            config.bindings = bindings;
        }

        componentConstructor.$componentConfig = config;
    };
}

/**
 * Base decorator for binding component properties.
 */
function bind(binding: string): PropertyDecorator {
    return function bindingDecorator(target: { constructor: { $componentConfig?: IComponentConfig } }, propertyKey: string) {
        let bindings = (target.constructor.$componentConfig = target.constructor.$componentConfig || {
            selector: undefined,
            bindings: {}
        }).bindings;
        bindings[propertyKey] = binding;
    };
}

/**
 * Decorator for binding component input properties.
 */
export function input(): PropertyDecorator {
    return bind('<');
}

/**
 * Decorator for binding component output properies.
 */
export function output(): PropertyDecorator {
    return bind('&');
}

/**
 * Bootstrap a module to the dom.
 */
export function bootstrapModule(appId: string, moduleClass: IModule): void {
    angular.bootstrap(document.getElementById(appId), [moduleClass.$name]);
}