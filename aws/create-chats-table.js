const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });

async function createChatsTable() {
  const params = {
    TableName: 'ai-tutor-app-chats-dev',
    AttributeDefinitions: [
      {
        AttributeName: 'chatId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'studentId',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'chatId',
        KeyType: 'HASH'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'StudentIdIndex',
        KeySchema: [
          {
            AttributeName: 'studentId',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    const result = await client.send(new CreateTableCommand(params));
    console.log('✅ Chats table created successfully:', result.TableDescription.TableName);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Table already exists');
    } else {
      console.error('❌ Error creating table:', error);
    }
  }
}

createChatsTable();
