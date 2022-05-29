declare module "IaC-Factory" {}

declare module "IaC-Factory.Terraform" {
    export type Stack = import("cdktf").TerraformStack;
    export type Resource = import("cdktf").Resource;
    export type Variable = import("cdktf").TerraformVariable;
    export type Testing = import("cdktf").Testing;
    export type Annotations = import("cdktf").Annotations;
    export type Application = import("cdktf").App;
    export type Aspects = import("cdktf").Aspects;
    export type Manifest = import("cdktf").Manifest;
    export type Module = import("cdktf").TerraformModule;
    export type FN = import("cdktf").Fn;
}

declare module "IaC-Factory.Terraform.Backend" {
    export type S3 = import("cdktf").S3Backend;
    export type HTTP = import("cdktf").HttpBackend;
    export type Local = import("cdktf").LocalBackend;
    export type PostgreSQL = import("cdktf").PgBackend;

    export type Terraform = import("cdktf").TerraformBackend;
}

declare module "IaC-Factory.Terraform.Backend.Properties" {
    export type S3 = import("cdktf").S3BackendProps;
    export type HTTP = import("cdktf").HttpBackendProps;
    export type Local = import("cdktf").LocalBackendProps;
    export type PostgreSQL = import("cdktf").S3BackendProps;
}

declare module "IaC-Factory.Terraform.Remote-State" {
    export type Aspects = import("cdktf").DataTerraformRemoteState;
    export type Azure = import("cdktf").DataTerraformRemoteStateAzurerm;
    export type S3 = import("cdktf").DataTerraformRemoteStateS3;
    export type ETCD = import("cdktf").DataTerraformRemoteStateEtcdV3;

    export type PostgreSQL = import("cdktf").DataTerraformRemoteStatePg;
    export type Local = import("cdktf").DataTerraformRemoteStateLocal;
    export type HTTP = import("cdktf").DataTerraformRemoteStateHttp;
}

declare module "IaC-Factory.Terraform.Remote-State.Configuration" {
    export type Aspects = import("cdktf").DataTerraformRemoteStateConfig;
    export type Azure = import("cdktf").DataTerraformRemoteStateAzurermConfig;
    export type S3 = import("cdktf").DataTerraformRemoteStateS3Config;
    export type ETCD = import("cdktf").DataTerraformRemoteStateEtcdV3Config;

    export type PostgreSQL = import("cdktf").DataTerraformRemoteStatePgConfig;
    export type Local = import("cdktf").DataTerraformRemoteStateLocalConfig;
    export type HTTP = import("cdktf").DataTerraformRemoteStateHttpConfig;
}