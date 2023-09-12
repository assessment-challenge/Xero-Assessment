import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

// Initialize IAM and S3 constructors
const iam = new AWS.IAM();
const s3 = new AWS.S3();

// This function is used to create Policy ans will be assigned to the AWS account users
const createPolicy = async (policyName: string, policyDocument: object): Promise<string> => {
    const params = {
        PolicyName: policyName,
        PolicyDocument: JSON.stringify(policyDocument),
    };
    const policy = await iam.createPolicy(params).promise();
    return policy.Policy!.Arn!;
};

// This function is used to create 3 Users and 1 Role
const createUsersAndRole = async () => {

    for (let i = 1; i <= 3; i++) {
        await iam.createUser({ UserName: `User${i}` }).promise();
    }

    const requirements = {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    Service: "ec2.amazonaws.com"
                },
                Action: "sts:AssumeRole",
                Condition: {
                    Bool: {
                        "aws:MultiFactorAuthPresent": "true"
                    }
                }
            }
        ]
    };

    const role = await iam.createRole({
        RoleName: 'XeroRole',
        AssumeRolePolicyDocument: JSON.stringify(requirements),
    }).promise();

    return role.Role.Arn;
};

// This function is used to upload and store the config file to S3 Bucket
// Granted it a full access for temporary usages
const storeToS3 = async (bucketName:string, config: object) => {
    try {
        // Check if the bucket exists
        await s3.headBucket({ Bucket: bucketName }).promise();
    } catch (error: any) {
        // If the bucket doesn't exist, create it
        if (error.code === 'NotFound') {
            await s3.createBucket({ Bucket: bucketName }).promise();
        } else {
            // If there's another error, throw it
            throw error;
        }
    }

    // Store the configuration to the bucket
    const storeParams: PutObjectRequest = {
        Bucket: bucketName,
        Key: 'IAMConfig.json',
        Body: JSON.stringify(config),
        ContentType: 'application/json'
    };
    await s3.putObject(storeParams).promise();
};

// This function is used to execute all the requirements from the instruction
async function setupIAMConfiguration() {
    // Policies
    const firstPolicy = {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "s3:Get*",
                    "s3:List*"
                ],
                Resource: "*"
            },
            {
                Effect: "Allow",
                Action: "ec2:*",
                Resource: "*"
            }
        ]
    };

    const secondPolicy = {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Deny",
                Action: "iam:CreateUser",
                Resource: "*"
            }
        ]
    };

    // Initialization the policies and role
    const policy1Arn = await createPolicy('XeroFirstPolicy', firstPolicy);
    const policy2Arn = await createPolicy('XeroSecondPolicy', secondPolicy);
    const roleArn = await createUsersAndRole();

    // Attach the policies to the role
    await iam.attachRolePolicy({
        RoleName: 'XeroRole',
        PolicyArn: policy1Arn
    }).promise();

    await iam.attachRolePolicy({
        RoleName: 'XeroRole',
        PolicyArn: policy2Arn
    }).promise();

    // Make a config file and store to S3 later
    const config = {
        policies: [policy1Arn, policy2Arn],
        role: roleArn
    };

    // Upload the config to the S3 bucket
    await storeToS3("xero-assessment-prac", config);
};

setupIAMConfiguration();