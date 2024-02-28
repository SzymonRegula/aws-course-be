"use strict";

const products = require("./mockData");

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsList = async (event) => {
  const productsParams = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
  };
  const stocksParams = {
    TableName: process.env.STOCKS_TABLE_NAME,
  };
  try {
    const productsDataPromise = dynamoDb.scan(productsParams).promise();
    const stocksDataPromise = dynamoDb.scan(stocksParams).promise();

    const [productsData, stocksData] = await Promise.all([
      productsDataPromise,
      stocksDataPromise,
    ]);

    const mergedData = productsData.Items.map((product) => {
      const stock = stocksData.Items.find(
        (item) => item.product_id === product.id
      );
      return {
        ...product,
        count: stock ? stock.count : 0,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(mergedData),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Cannot fetch products" }),
    };
  }
};

module.exports.getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  const productParams = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": productId,
    },
  };
  const stockParams = {
    TableName: process.env.STOCKS_TABLE_NAME,
    KeyConditionExpression: "product_id = :product_id",
    ExpressionAttributeValues: {
      ":product_id": productId,
    },
  };

  try {
    const productDataPromise = dynamoDb.query(productParams).promise();
    const stockDataPromise = dynamoDb.query(stockParams).promise();

    const [productData, stockData] = await Promise.all([
      productDataPromise,
      stockDataPromise,
    ]);

    const product = productData?.Items[0];
    const stock = stockData?.Items[0];

    const mergedProduct = {
      ...product,
      count: stock.count ?? 0,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(mergedProduct),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `Cannot find product with id: ${productId}`,
      }),
    };
  }
};
