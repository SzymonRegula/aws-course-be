"use strict";

const AWS = require("aws-sdk");
const s3 = new AWS.S3({ region: "us-east-1" });

module.exports.importProductsFile = async (event) => {
  const fileName = event.queryStringParameters.name;
  const params = {
    Bucket: "aws-course-bucket-task5",
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(signedUrl),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Error generating signed URL" }),
    };
  }
};
