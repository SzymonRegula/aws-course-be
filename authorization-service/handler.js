"use strict";

module.exports.basicAuthorizer = async (event, context) => {
  console.log("event: ", event);

  const authHeader = event.headers.Authorization;
  console.log("authHeader: ", authHeader);

  if (!authHeader) {
    return generatePolicy("user", "Deny", event.methodArn);
  }

  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  console.log("usenrame and password: ", username, password);

  console.log("process.env[username]:", process.env[username]);

  if (!process.env[username] || process.env[username] !== password) {
    return generatePolicy(username, "Deny", event.methodArn);
  }

  return generatePolicy(username, "Allow", event.methodArn);
};

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}
