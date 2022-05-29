import * as CDK from "cdktf";
import { Construct } from "constructs";

export type Reflector = { property: string, value: PropertyDescriptor & ThisType<unknown | any> };
export type Reflection <Generic> = { property: string, value: PropertyDescriptor & ThisType<Generic> };

export module Backend {
    export const azure = (scope: Construct, configuration: CDK.AzurermBackendProps, reflection?: Reflector) => {
        const instance = new CDK.AzurermBackend(scope, configuration);
        const properties = (reflection) ? { ... Object.defineProperty( instance, reflection.property, reflection.value ), ... instance } as const : { ... instance } as const;
        
        type Instance = typeof instance;
        type Properties = typeof properties;
        type Reflect = Reflection<Properties>;
        
        return { ... instance as Reflect & Instance & Properties } as const;
    };
    
    export const s3 = (scope: Construct, configuration: CDK.S3BackendProps, reflection?: Reflector) => {
        const instance = new CDK.S3Backend(scope, configuration);
        const properties = (reflection) ? { ... Object.defineProperty( instance, reflection.property, reflection.value ), ... instance } as const : { ... instance } as const;

        type Instance = typeof instance;
        type Properties = typeof properties;
        type Reflect = Reflection<Properties>;

        return { ... instance as Reflect & Instance & Properties } as const;
    };
    
    export const remote = (scope: Construct, configuration: CDK.RemoteBackendProps, reflection?: Reflector) => {
        const instance = new CDK.RemoteBackend(scope, configuration);
        const properties = (reflection) ? { ... Object.defineProperty( instance, reflection.property, reflection.value ), ... instance } as const : { ... instance } as const;

        type Instance = typeof instance;
        type Properties = typeof properties;
        type Reflect = Reflection<Properties>;

        return { ... instance as Reflect & Instance & Properties } as const;
    };
    
    export const etcd = (scope: Construct, configuration: CDK.EtcdV3BackendProps, reflection?: Reflector) => {
        const instance = new CDK.EtcdV3Backend(scope, configuration);
        const properties = (reflection) ? { ... Object.defineProperty( instance, reflection.property, reflection.value ), ... instance } as const : { ... instance } as const;

        type Instance = typeof instance;
        type Properties = typeof properties;
        type Reflect = Reflection<Properties>;

        return { ... instance as Reflect & Instance & Properties } as const;
    };
    
    export const http = (scope: Construct, configuration: CDK.HttpBackendProps, reflection?: Reflector) => {
        const instance = new CDK.HttpBackend(scope, configuration);
        const properties = (reflection) ? { ... Object.defineProperty( instance, reflection.property, reflection.value ), ... instance } as const : { ... instance } as const;

        type Instance = typeof instance;
        type Properties = typeof properties;
        type Reflect = Reflection<Properties>;

        return { ... instance as Reflect & Instance & Properties } as const;
    };
    
    export const local = (scope: Construct, configuration: CDK.LocalBackendProps, reflection?: Reflector) => {
        const instance = new CDK.LocalBackend(scope, configuration);
        const properties = (reflection) ? { ... Object.defineProperty( instance, reflection.property, reflection.value ), ... instance } as const : { ... instance } as const;

        type Instance = typeof instance;
        type Properties = typeof properties;
        type Reflect = Reflection<Properties>;

        return { ... instance as Reflect & Instance & Properties } as const;
    };
    
    export const postgresql = (scope: Construct, configuration: CDK.PgBackendProps, reflection?: Reflector) => {
        const instance = new CDK.PgBackend(scope, configuration);
        const properties = (reflection) ? { ... Object.defineProperty( instance, reflection.property, reflection.value ), ... instance } as const : { ... instance } as const;

        type Instance = typeof instance;
        type Properties = typeof properties;
        type Reflect = Reflection<Properties>;

        return { ... instance as Reflect & Instance & Properties } as const;
    };
    
}

export module IaC {
    export const Terraform = CDK;

    export const annotations = CDK.Annotations;
    export const application = CDK.App;
    export const aspects = CDK.Aspects;
}