console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const iam = new aws.IAM();

exports.handler = async (event) => {
    const userName = event.userName; 

    const roles = await iam.listRoles({}).promise();

    const assumableRoles = roles.Roles.filter((role) => {
        const trustRelationship = JSON.parse(decodeURIComponent(role.AssumeRolePolicyDocument));
        return trustRelationship.Statement.some((stmt) => stmt.Effect === 'Allow' && stmt.Principal.AWS && stmt.Principal.AWS.includes(userName));
    });

    const bucketName = 'xero-assessment';
    const params = {
        Bucket: bucketName,
        Key: `${userName}_roles.json`,
        Body: JSON.stringify(assumableRoles),
        ContentType: 'application/json'
    };

    await s3.putObject(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Mission Completed!' })
    };
};
