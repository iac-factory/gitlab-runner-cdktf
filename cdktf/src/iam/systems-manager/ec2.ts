import Utility from "util";

module Policy {
    export const Version = "2012-10-17" as const;

    export interface Configuration {
        ssm: boolean;
        patching: boolean;
        efs: boolean
    }

    export const Default = {
        ssm: true,
        patching: true,
        efs: true
    } as const;

    /*** The policy for Amazon EC2 Role to enable AWS Systems Manager service core functionality */
    export const SSM = [
        {
            effect: "Allow",
            actions: [
                "ssm:DescribeAssociation",
                "ssm:GetDeployablePatchSnapshotForInstance",
                "ssm:GetDocument",
                "ssm:DescribeDocument",
                "ssm:GetManifest",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:ListAssociations",
                "ssm:ListInstanceAssociations",
                "ssm:PutInventory",
                "ssm:PutComplianceItems",
                "ssm:PutConfigurePackageResult",
                "ssm:UpdateAssociationStatus",
                "ssm:UpdateInstanceAssociationStatus",
                "ssm:UpdateInstanceInformation"
            ], resources: [ "*" ]
        },
        {
            effect: "Allow",
            actions: [
                "ssmmessages:CreateControlChannel",
                "ssmmessages:CreateDataChannel",
                "ssmmessages:OpenControlChannel",
                "ssmmessages:OpenDataChannel"
            ],
            resources: ["*"]
        },
        {
            effect: "Allow",
            actions: [
                "ec2messages:AcknowledgeMessage",
                "ec2messages:DeleteMessage",
                "ec2messages:FailMessage",
                "ec2messages:GetEndpoint",
                "ec2messages:GetMessages",
                "ec2messages:SendReply"
            ], resources: ["*"]
        }
    ] as const;

    /*** Provide access to child instances for patch association operation */
    export const Patching = [
        {
            effect: "Allow",
            actions: [ "ssm:DescribeEffectivePatchesForPatchBaseline" ],
            resources: ["arn:aws:ssm:*:*:patchbaseline/*"]
        },
        {
            effect: "Allow",
            actions: [ "ssm:GetPatchBaseline" ],
            resources: [ "arn:aws:ssm:*:*:patchbaseline/*" ]
        },
        {
            effect: "Allow",
            actions: [ "tag:GetResources" ],
            resources: [ "*" ]
        },
        {
            effect: "Allow",
            actions: [ "ssm:DescribePatchBaselines" ],
            resources: [ "*" ]
        }
    ] as const;

    /***
     * Allows customers to use AWS Systems Manager to automatically manage Amazon EFS utilities (amazon-efs-utils)
     * package on their EC2 instances, and use CloudWatchLog to get EFS file system mount success/failure
     * notifications.
     */
    export const EFS = [
        {
            effect: "Allow",
            actions: [
                "ssm:DescribeAssociation",
                "ssm:GetDeployablePatchSnapshotForInstance",
                "ssm:GetDocument",
                "ssm:DescribeDocument",
                "ssm:GetManifest",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:ListAssociations",
                "ssm:ListInstanceAssociations",
                "ssm:PutInventory",
                "ssm:PutComplianceItems",
                "ssm:PutConfigurePackageResult",
                "ssm:UpdateAssociationStatus",
                "ssm:UpdateInstanceAssociationStatus",
                "ssm:UpdateInstanceInformation"
            ], resources: [ "*" ]
        },
        {
            effect: "Allow",
            actions: [
                "ssmmessages:CreateControlChannel",
                "ssmmessages:CreateDataChannel",
                "ssmmessages:OpenControlChannel",
                "ssmmessages:OpenDataChannel"
            ], resources: [ "*" ]
        },
        {
            effect: "Allow",
            actions: [
                "ec2messages:AcknowledgeMessage",
                "ec2messages:DeleteMessage",
                "ec2messages:FailMessage",
                "ec2messages:GetEndpoint",
                "ec2messages:GetMessages",
                "ec2messages:SendReply"
            ], resources: [ "*" ],
        },
        {
            effect: "Allow",
            actions: [
                "elasticfilesystem:DescribeMountTargets"
            ],
            resources: [ "*" ]
        },
        {
            effect: "Allow",
            actions: [
                "ec2:DescribeAvailabilityZones"
            ],
            resources: [ "*" ]
        },
        {
            effect: "Allow",
            actions: [
                "logs:PutLogEvents",
                "logs:DescribeLogStreams",
                "logs:DescribeLogGroups",
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutRetentionPolicy"
            ],
            resources: [ "*" ]
        }
    ] as const;

    export const Statement = { ssm: SSM, patching: Patching, efs: EFS } as const;

    export type Statements = typeof Statement;

    export enum Option {
        SSM = "ssm",
        Patching = "patching",
        EFS = "efs"
    }

    export type Options = Lowercase<keyof typeof Option>;

    export type Types = { [Callable in Options]: Statements[Callable] }

    export const Evaluate = ( option: Options ) => {
        return Statement[ option ];
    };
}

export module EC2 {
    export const SSM = ( configuration: Policy.Configuration = Policy.Default, debug?: boolean ) => {
        const statements = Object.entries( configuration ).map( ( entry ) => {
            const [ property, enablement ] = entry;

            return ( enablement === true ) ? Policy.Evaluate( property as Policy.Options ) : null;
        } ).filter( ( document ) => document ).flat();

        const instance = { version: "2012-10-17", statement: statements } as { version: string, statement: object[] };

        ( debug ) && console.debug( "[Debug] SSM Generated Policy",
            Utility.inspect( instance, {
                colors: true,
                depth: Infinity
            } )
        );

        return JSON.stringify(instance, null, 4);
    };

    export const Statement = [
        {
            "actions": [
                "iam:PassRole"
            ],
            "condition": [
                {
                    "test": "StringEquals",
                    "values": [
                        "ec2.amazonaws.com"
                    ],
                    "variable": "iam:PassedToService"
                }
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "iam:ListInstanceProfiles",
                "ec2:Describe*",
                "ec2:Search*",
                "ec2:Get*"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ssm:DescribeAssociation",
                "ssm:GetDeployablePatchSnapshotForInstance",
                "ssm:GetDocument",
                "ssm:DescribeDocument",
                "ssm:GetManifest",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:ListAssociations",
                "ssm:ListInstanceAssociations",
                "ssm:PutInventory",
                "ssm:PutComplianceItems",
                "ssm:PutConfigurePackageResult",
                "ssm:UpdateAssociationStatus",
                "ssm:UpdateInstanceAssociationStatus",
                "ssm:UpdateInstanceInformation"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ssm:DescribeAssociation",
                "ssm:GetDeployablePatchSnapshotForInstance",
                "ssm:GetDocument",
                "ssm:DescribeDocument",
                "ssm:GetManifest",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:ListAssociations",
                "ssm:ListInstanceAssociations",
                "ssm:PutInventory",
                "ssm:PutComplianceItems",
                "ssm:PutConfigurePackageResult",
                "ssm:UpdateAssociationStatus",
                "ssm:UpdateInstanceAssociationStatus",
                "ssm:UpdateInstanceInformation"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ssmmessages:CreateControlChannel",
                "ssmmessages:CreateDataChannel",
                "ssmmessages:OpenControlChannel",
                "ssmmessages:OpenDataChannel"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ec2messages:AcknowledgeMessage",
                "ec2messages:DeleteMessage",
                "ec2messages:FailMessage",
                "ec2messages:GetEndpoint",
                "ec2messages:GetMessages",
                "ec2messages:SendReply"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ssm:DescribeAssociation",
                "ssm:GetDeployablePatchSnapshotForInstance",
                "ssm:GetDocument",
                "ssm:DescribeDocument",
                "ssm:GetManifest",
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:ListAssociations",
                "ssm:ListInstanceAssociations",
                "ssm:PutInventory",
                "ssm:PutComplianceItems",
                "ssm:PutConfigurePackageResult",
                "ssm:UpdateAssociationStatus",
                "ssm:UpdateInstanceAssociationStatus",
                "ssm:UpdateInstanceInformation"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ssmmessages:CreateControlChannel",
                "ssmmessages:CreateDataChannel",
                "ssmmessages:OpenControlChannel",
                "ssmmessages:OpenDataChannel"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ec2messages:AcknowledgeMessage",
                "ec2messages:DeleteMessage",
                "ec2messages:FailMessage",
                "ec2messages:GetEndpoint",
                "ec2messages:GetMessages",
                "ec2messages:SendReply"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "elasticfilesystem:DescribeMountTargets"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ec2:DescribeAvailabilityZones"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "logs:PutLogEvents",
                "logs:DescribeLogStreams",
                "logs:DescribeLogGroups",
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutRetentionPolicy"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ssm:DescribeEffectivePatchesForPatchBaseline"
            ],
            "effect": "Allow",
            "resources": [
                "arn:aws:ssm:*:*:patchbaseline/*"
            ]
        },
        {
            "actions": [
                "ssm:GetPatchBaseline"
            ],
            "effect": "Allow",
            "resources": [
                "arn:aws:ssm:*:*:patchbaseline/*"
            ]
        },
        {
            "actions": [
                "tag:GetResources"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        },
        {
            "actions": [
                "ssm:DescribePatchBaselines"
            ],
            "effect": "Allow",
            "resources": [
                "*"
            ]
        }
    ];
}

export default EC2;