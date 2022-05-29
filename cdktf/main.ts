import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import { AwsProvider, ec2, iam, vpc } from "@cdktf/provider-aws";

import { EC2 as IAM } from "./src/iam";

class EC2 extends TerraformStack {
    provider: string;
    resource: string;

    identifier (service: string, modifier: string, type: string) {
        return [ this.provider, service, this.resource, modifier, type ].join("-");
    }

    constructor( scope: Construct, id: string, settings: { vpc: string, subnet: string } ) {
        super( scope, id );

        this.provider = "aws";
        this.resource = "ec2";

        const permissions = new iam.DataAwsIamPolicyDocument( this, this.identifier("iam", "permissions-policy", "data-source"), {
            version: "2012-10-17",
            statement: IAM.Statement
        });

        const policy = new iam.IamPolicy(this, this.identifier("iam", "permissions-policy", "resource"), {
            name: "aws-iam-ec2-instance-policy",
            policy: permissions.json,
            description: "..."
        })

        const role = new iam.IamRole(this, this.identifier("iam", "role", "resource"), {
            assumeRolePolicy: JSON.stringify({
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "Service": "ec2.amazonaws.com"
                        },
                        "Action": "sts:AssumeRole"
                    }
                ]
            }),
            forceDetachPolicies: true,
            maxSessionDuration: 3600,
            name: "TF-AWS-IAM-EC2-Instance-SSM-Integrations-Role",
            managedPolicyArns: [
                "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
                "arn:aws:iam::aws:policy/AmazonElasticFileSystemsUtils",
                "arn:aws:iam::aws:policy/AmazonSSMPatchAssociation",
                policy.arn
            ]
        });

        const source = new ec2.DataAwsAmi(this, this.identifier("compute", "ami", "data-source"), {
            owners: ["amazon"],
            mostRecent: true,
            filter: [
                {
                    name: "owner-alias",
                    values: ["amazon"]
                },
                {
                    name: "name",
                    values: ["amzn2-ami-hvm*"]
                }
            ],
        } )

        const ami = new ec2.AmiCopy(this, this.identifier("compute", "ami", "resource"), {
            name: source.name,
            sourceAmiId: source.id,
            description: "...",
            encrypted: false,
            sourceAmiRegion: "us-east-2"
        });
        
        const profile = new iam.IamInstanceProfile(this, this.identifier("iam", "instance-profile", "resource"), {
            role: role.name,
            name: "TF-AWS-IAM-EC2-Instance-Profile"
        });

        const sg = new vpc.SecurityGroup(this, this.identifier("vpc", "security-group", "resource"), {
            vpcId: "vpc-06243f4ee83229967",
            ingress: [
                {
                    description: "Docker Machine (Ingress) (TCP) Port",
                    protocol: "tcp",
                    fromPort: 2376,
                    toPort: 2376,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                },
                {
                    description: "Docker Machine (Ingress) (UDP) Port",
                    protocol: "udp",
                    fromPort: 2376,
                    toPort: 2376,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                },
                {
                    description: "Mongo + DocumentDB (Ingress) Port",
                    protocol: "tcp",
                    fromPort: 27017,
                    toPort: 27017,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                },
                {
                    description: "Interactive Web-Terminal (Ingress) Port",
                    protocol: "tcp",
                    fromPort: 8093,
                    toPort: 8093,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                },
                {
                    description: "PostgreSQL (Ingress) Port",
                    protocol: "tcp",
                    fromPort: 5432,
                    toPort: 5432,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                },
                {
                    description: "HTTP (Ingress) (TCP) Port",
                    protocol: "tcp",
                    fromPort: 80,
                    toPort: 80,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                },
                {
                    description: "HTTP (Ingress) (UDP) Port",
                    protocol: "udp",
                    fromPort: 80,
                    toPort: 80,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                },
                {
                    description: "HTTPs (Ingress) Port",
                    protocol: "tcp",
                    fromPort: 443,
                    toPort: 443,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                }
            ],
            egress: [
                {
                    description: "Mongo + DocumentDB (Ingress) Port",
                    protocol: "-1",
                    fromPort: 0,
                    toPort: 0,
                    cidrBlocks: [ "0.0.0.0/0" ],
                    ipv6CidrBlocks: [ "::/0" ],
                    prefixListIds: [],
                    securityGroups: []
                }
            ], name: "TF-AWS-IAM-EC2-Security-Group",
            description: "...",
            revokeRulesOnDelete: true,
            timeouts: {
                create: "10m",
                delete: "15m"
            }
        });

        new iam.IamRolePolicyAttachment(this, this.identifier("iam", "role-attachment", "resource"), {
            role: role.name, policyArn: policy.arn
        })

        new AwsProvider( this, "aws-terraform-provider", {
            region: "us-east-2"
        } )

        new ec2.Instance(this, this.identifier("compute", "instance", "resource"), {
            ami: ami.id,
            rootBlockDevice: {
                volumeSize: 20,
                deleteOnTermination: true,
                encrypted: false,
                /*** Min: 3000 IOPS, Max: 16000 IOPS. The value must be an integer. */
                iops: 3000,
                volumeType: "gp3",
                /*** 125 - 1000; 125/TiB */
                throughput: 125
            },
            instanceType: "t3.medium",
            ebsOptimized: true,
            iamInstanceProfile: profile.name,
            maintenanceOptions: {
                autoRecovery: "default"
            },
            monitoring: true,
            timeouts: {
                create: "15m",
                delete: "15m"
            },
            instanceInitiatedShutdownBehavior: "terminate",
            tags: {
               Name: "TF-AWS-EC2-Instance"
            },
            subnetId: settings.subnet,
            vpcSecurityGroupIds: [
                sg.id
            ]
        });
    }
}

const Application = new App();

void new EC2( Application, "aws-example-ec2-instance-stack", {
    vpc: "vpc-000", subnet: "subnet-000"
} );

Application.synth();