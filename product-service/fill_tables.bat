aws dynamodb put-item ^
    --table-name Products_aws-course  ^
    --item ^
        "{\"id\": {\"S\": \"7567ec4b-b10c-48c5-9345-fc73c48a80a1\"}, \"title\": {\"S\": \"Product 1\"}, \"description\": {\"S\": \"This is a test product\"}, \"price\": {\"N\": \"30\"}}"

aws dynamodb put-item ^
    --table-name Stocks_aws-course  ^
    --item ^
        "{\"product_id\": {\"S\": \"7567ec4b-b10c-48c5-9345-fc73c48a80a1\"}, \"count\": {\"N\": \"10\"}}"

aws dynamodb put-item ^
    --table-name Products_aws-course ^
    --item ^
        "{\"id\": {\"S\": \"7567ec4b-b10c-48c5-9345-fc73c48a80a2\"}, \"title\": {\"S\": \"Product 2\"}, \"description\": {\"S\": \"This is a test product\"}, \"price\": {\"N\": \"120\"}}"

aws dynamodb put-item ^
    --table-name Stocks_aws-course ^
    --item ^
        "{\"product_id\": {\"S\": \"7567ec4b-b10c-48c5-9345-fc73c48a80a2\"}, \"count\": {\"N\": \"50\"}}"

aws dynamodb put-item ^
    --table-name Products_aws-course ^
    --item ^
        "{\"id\": {\"S\": \"7567ec4b-b10c-48c5-9345-fc73c48a80a3\"}, \"title\": {\"S\": \"Product 3\"}, \"description\": {\"S\": \"This is a test product\"}, \"price\": {\"N\": \"80\"}}"

aws dynamodb put-item ^
    --table-name Stocks_aws-course ^
    --item ^
        "{\"product_id\": {\"S\": \"7567ec4b-b10c-48c5-9345-fc73c48a80a3\"}, \"count\": {\"N\": \"20\"}}"