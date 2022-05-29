export module TF {
    export type IaC = typeof import("IaC-Factory");
    export type Terraform = {
        [Type in keyof typeof import("IaC-Factory.Terraform")]: (typeof import("IaC-Factory.Terraform"))[Type]
    };

    export type Backend = {
        [Type in keyof typeof import("IaC-Factory.Terraform.Backend")]: (typeof import("IaC-Factory.Terraform.Backend"))[Type];
    } & {
        Configuration: {
            [Type in keyof typeof import("IaC-Factory.Terraform.Backend.Properties")]: (typeof import("IaC-Factory.Terraform.Backend.Properties"))[Type];
        }
    };

    export type Remote = {
        [Type in keyof typeof import("IaC-Factory.Terraform.Remote-State")]: (typeof import("IaC-Factory.Terraform.Remote-State"))[Type];
    } & {
        Configuration: {
            [Type in keyof typeof import("IaC-Factory.Terraform.Remote-State.Configuration")]: (typeof import("IaC-Factory.Terraform.Remote-State.Configuration"))[Type];
        }
    };
}

export default TF;

export * from "./exports";