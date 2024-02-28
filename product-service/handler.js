"use strict";

const products = require("./mockData");

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
