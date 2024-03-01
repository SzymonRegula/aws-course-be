"use strict";

const { v4: uuidv4 } = require("uuid");

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

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
      count: stock ? stock.count : 0,
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

module.exports.createProduct = async (event) => {
  const { title, description, price } = JSON.parse(event.body);
  const product = {
    id: uuidv4(),
    title,
    description,
    price,
  };
  const params = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
    Item: product,
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(product),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Cannot create product" }),
    };
  }
};

module.exports.catalogBatchProcess = async (event) => {
  const records = event.Records.map((record) => JSON.parse(record.body));

  for (const record of records) {
    const { id, title, description, price } = record;
    const item = {
      id: id ? id : uuidv4(),
      title: title ? title : "No title",
      description: description ? description : "No description",
      price: price ? price : 0,
    };
    const dynamoParams = {
      TableName: "Products_aws-course",
      Item: item,
    };
    const snsParams = {
      Message: `Product created: ${JSON.stringify(item, null, 2)}`,
      TopicArn: process.env.SNS_TOPIC_ARN,
    };
    try {
      await dynamoDb.put(dynamoParams).promise();
      await sns.publish(snsParams).promise();
      console.log(`Product created: ${item.id}`);
    } catch (error) {
      console.error(`Error creating product: ${error}`);
    }
  }
};
