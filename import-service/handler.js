"use strict";

const AWS = require("aws-sdk");
const csv = require("csv-parser");
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

module.exports.importFileParser = async (event) => {
  const promises = event.Records.map(
    (record) =>
      new Promise((resolve, reject) => {
        try {
          const s3Stream = s3
            .getObject({
              Bucket: record.s3.bucket.name,
              Key: record.s3.object.key,
            })
            .createReadStream();

          console.log(`Starting to process file ${record.s3.object.key}...`);

          s3Stream
            .pipe(csv())
            .on("data", (data) => {
              console.log(data);
            })
            .on("end", () => {
              console.log(`File ${record.s3.object.key} has been processed.`);
              resolve();
            });
        } catch (error) {
          console.error("Error processing file:", error);
          reject(error);
        }
      })
  );

  await Promise.all(promises);
};
