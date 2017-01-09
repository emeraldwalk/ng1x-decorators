/// <reference types="angular" />
/**
 * Extend module constructors with name.
 */
export interface IModule extends Function {
    $name?: string;
}
export declare type IInjectable = {
    $injectAs?: string;
} & Function;
export declare type IModuleConfig = {
    name: string;
    dependencies?: Array<IModule | string>;
    configBlocks?: Array<Function | Array<any>>;
    runBlocks?: Array<Function>;
    components?: Array<IComponentConstructor>;
    services?: Array<IInjectable>;
};
export declare type IComponentConfig = ng.IComponentOptions & {
    selector: string;
};
/**
 * Extend component constructors with configuration details.
 */
export declare type IComponentConstructor = ng.Injectable<ng.IControllerConstructor> & {
    $componentConfig?: IComponentConfig;
};
/**
 * Module decorator for creating an angular module and registering
 * components to it.
 */
export declare function ngModule(config: IModuleConfig): ClassDecorator;
/**
 * Decorator for annotating classes with injectables.
 */
export declare function inject(...injectables: Array<string>): ClassDecorator;
/**
 * Decorator for annotating services with injectable key.
 */
export declare function service(injectAs: string): ClassDecorator;
/**
 * Decorator for annotating component controllers with options
 * that will later be used to register to a module.
 */
export declare function component(config: IComponentConfig): ClassDecorator;
/**
 * Decorator for binding component input properties.
 */
export declare function input(): PropertyDecorator;
/**
 * Decorator for binding component output properies.
 */
export declare function output(): PropertyDecorator;
/**
 * Bootstrap a module to the dom.
 */
export declare function bootstrapModule(appId: string, moduleClass: IModule): void;
