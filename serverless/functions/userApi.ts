import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v1 as v1uuid } from "uuid";
import { CreateUserInput, UpdateUserInput, UserWithId } from "../../lib/types";

const dynamoDb = new DynamoDB();

const createUser = async (tableName: string, user: CreateUserInput) => {
  const userId = v1uuid();
  const now = Date.now();

  const createdUser: UserWithId = {
    userId,
    ...user,
    lastUpdatedAt: now,
    createdAt: now
  };
  await dynamoDb
    .putItem({
      TableName: tableName,
      Item: DynamoDB.Converter.marshall(createdUser)
    })
    .promise();

  return createdUser;
};

const readUser = async (tableName: string, userId: string) => {
  const result = await dynamoDb
    .query({
      TableName: tableName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": DynamoDB.Converter.input(userId)
      }
    })
    .promise();

  const user = DynamoDB.Converter.unmarshall(
    result.Items?.[0] || {}
  ) as UserWithId;

  return user;
};

const updateUser = async (
  tableName: string,
  userId: string,
  user: UpdateUserInput
) => {
  const now = Date.now();

  const updateExpressions: string[] = ["#lastUpdatedAt = :lastUpdatedAt"];
  const expressionAttributeNames: DynamoDB.ExpressionAttributeNameMap = {
    "#lastUpdatedAt": "lastUpdatedAt"
  };
  const expressionAttributeValues: DynamoDB.ExpressionAttributeValueMap = {
    ":lastUpdatedAt": DynamoDB.Converter.input(now)
  };

  Object.keys(user).forEach(attr => {
    updateExpressions.push(`#${attr} = :${attr}`);
    expressionAttributeNames[`#${attr}`] = attr;
    expressionAttributeValues[`:${attr}`] = DynamoDB.Converter.input(
      user[attr]
    );
  });

  const result = await dynamoDb
    .updateItem({
      TableName: tableName,
      Key: DynamoDB.Converter.marshall({ userId }),
      UpdateExpression: "SET " + updateExpressions.join(", "),
      ConditionExpression: "attribute_exists(#userId)",
      ExpressionAttributeNames: {
        ...expressionAttributeNames,
        "#userId": "userId"
      },
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    })
    .promise();

  return DynamoDB.Converter.unmarshall(result.Attributes) as UserWithId;
};

const deleteUser = async (tableName: string, userId: string) => {
  await dynamoDb
    .deleteItem({
      TableName: tableName,
      Key: DynamoDB.Converter.marshall({ userId })
    })
    .promise();
};

const listUsers = async (tableName: string) => {
  const result = await dynamoDb
    .scan({
      TableName: tableName
    })
    .promise();

  const users = (result.Items || []).map(item =>
    DynamoDB.Converter.unmarshall(item)
  ) as UserWithId[];

  return users;
};

const userApi: APIGatewayProxyHandlerV2 = async event => {
  const tableName = process.env.TABLE_NAME;

  const body = JSON.parse(event.body || "{}");

  const userId = event.pathParameters?.["id"];

  // console.log(JSON.stringify(event, null, 2));

  let result = null;
  switch (event.routeKey) {
    case "POST /user":
      result = await createUser(tableName, body);
      break;
    case "GET /user/{id}":
      result = await readUser(tableName, userId);
      break;
    case "PUT /user/{id}":
      result = await updateUser(tableName, userId, body);
      break;
    case "DELETE /user/{id}":
      result = await deleteUser(tableName, userId);
      break;
    case "GET /user/list":
      result = await listUsers(tableName);
      break;
  }

  return result;
};

export default userApi;
