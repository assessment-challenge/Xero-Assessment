## **AWS Access Solution for Medium to Large Companies**


### **1. AWS Organizations**
- **Centralized Management**
- **Service Control Policies (SCPs)**

### **2. AWS Single Sign-On (SSO)**
- **Central Access Portal**
- **Identity Providers**

### **3. IAM Roles**
- **Role-Based Access Control (RBAC)**
- **Cross-Account Access**

### **4. IAM Policies**
- **Principle of Least Privilege**
- **Managed vs. Custom Policies**

### **5. IAM Groups**
- **Grouping Strategy**

### **6. Multi-Factor Authentication (MFA)**
- **Security Enhancement**


## **After The Solution:** 

- Many Users: We will use AWS SSO for centralised access and group users with similar job functions into IAM Groups to manage permissions efficiently. Also, we will implement MFA for enhanced security. 

- Many Roles: We will adopt Role-Based Access Control (RBAC) through IAM Roles. Then, defining roles based on job functions or departments and assigning necessary permissions to each role, which will ensure that users only have access to what they need. 

- Many Accounts: We leverage AWS Organisations to manage multiple accounts and use Service Control Policies (SCPs) to set permissions across these accounts. After we implement cross-account IAM roles for users, they can access to multiple accounts if needed.


## References
- [AWS - Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

- [AWS - Establishing your best practice AWS environment](https://aws.amazon.com/organizations/getting-started/best-practices/)

- [AWS - Best Practices for Organizational Units with AWS Organizations](https://aws.amazon.com/blogs/mt/best-practices-for-organizational-units-with-aws-organizations/)
