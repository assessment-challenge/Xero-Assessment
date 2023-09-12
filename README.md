# Xero Security Engineer Technical Assessment Instructions

## 1. Setup:
- Install the necessary npm packages. (It will automatically install all the dependencies in the package.json file)
```bash
  npm install
```
- Set up the .env file or configure the ACCESS_KEY through AWS CLI
  - AWS_ACCESS_KEY_ID=your_access_key
  - AWS_SECRET_ACCESS_KEY=your_secret_key 

## 2. How the code works (Step by Step):

### a. IAM Policies:
- Create two IAM policies:
  - One that allows read-only access to S3 and full access to EC2.
  - Another that denies IAM user creation.

### b. IAM Users and Role:
- Create 3 IAM users and 1 IAM role.
- The role allows it to be assumed only when MFA is authenticated.

### c. Attach Policies to Role:
- Attach the 2 policies to the IAM role.

### d. Store Configuration:
- Store the ARNs of the created policies and role in an S3 bucket for reference.

## 3. Run the script:
```bash
  npm start
```