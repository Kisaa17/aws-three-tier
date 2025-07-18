AWS Three Tier Web Application Project Documentation
________________________________________
Project Overview
This project involved building a three-tier web application on AWS. The architecture included:
•	Presentation Tier: Static website hosted on Amazon S3 and distributed via CloudFront
•	Logic Tier: AWS Lambda function handling API requests
•	Data Tier: DynamoDB for storing user data
•	API Gateway: To expose Lambda as an HTTP endpoint
The goal was to create a fully functioning web app that connects these services securely and efficiently.

 

________________________________________

Key Steps and Concepts Covered
1.	Hosting Static Website on S3
o	Uploading website files to an S3 bucket
o	Configuring the bucket for static website hosting
2.	Setting up CloudFront Distribution
o	Creating a CloudFront distribution with the S3 bucket as the origin
o	Using CloudFront domain for site access
3.	Creating API Gateway and Lambda Function
o	Defining a REST API in API Gateway
o	Connecting API Gateway to Lambda using proxy integration
o	Writing Lambda code to fetch data from DynamoDB
 
 
4.	Handling CORS (Cross-Origin Resource Sharing)
o	Enabling CORS in API Gateway to allow requests from the CloudFront domain
o	Adding CORS headers (Access-Control-Allow-Origin) in Lambda response
o	Troubleshooting common CORS errors (including the trailing slash issue)
 
5.	Deploying API and Lambda Updates
o	Deploying API changes to the prod stage
o	Redeploying Lambda function after code changes
 
6.	Testing Final Setup
o	Accessing the site via CloudFront URL
o	Testing user data retrieval from DynamoDB via the API
o	Validating CORS policies and API connectivity
 ________________________________________
Challenges and Solutions
•	CORS Errors:
Initially, API requests were blocked due to CORS policy mismatches. The root cause was the mismatch between the Access-Control-Allow-Origin header in Lambda and the actual origin of the request (CloudFront domain).
Solution:
o	Removed trailing slash in the allowed origin URL in Lambda response header
o	Ensured API Gateway CORS settings matched exactly
•	Deploying Changes:
Forgetting to redeploy API Gateway after CORS changes caused issues with header updates not taking effect.
•	CloudFront Cache:
At times, caching caused outdated content to be served. Invalidating the cache helped but was mostly not needed after fixing headers.
________________________________________
Best Practices and Security
•	Replace Access-Control-Allow-Origin: "*" with your CloudFront domain to restrict API access only to your site.
•	Keep your Lambda function stateless and return appropriate CORS headers consistently.
•	Always deploy API Gateway after making configuration changes.
________________________________________
Summary and Final Thoughts
This project took about 2.5 hours including demos and troubleshooting. The most challenging part was resolving CORS errors, but it was rewarding to see the fully functioning three-tier application at the end.
You learned how to:
•	Host a website on S3 and distribute via CloudFront
•	Create and connect API Gateway and Lambda
•	Manage DynamoDB as the backend data store
•	Troubleshoot CORS issues across AWS services
________________________________________
Resource Cleanup
To avoid incurring charges, ensure you delete your resources in this order:
1.	Disable and delete CloudFront distribution
2.	Empty and delete the S3 bucket
3.	Delete the Lambda function
4.	Delete the API Gateway
5.	Delete the DynamoDB table

