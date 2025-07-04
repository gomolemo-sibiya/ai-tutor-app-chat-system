const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });

async function createTable(params) {
  try {
    const result = await client.send(new CreateTableCommand(params));
    console.log(`✅ Table created: ${result.TableDescription.TableName}`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`⚠️  Table ${params.TableName} already exists`);
    } else {
      console.error(`❌ Error creating ${params.TableName}:`, error.message);
    }
  }
}

async function createAllTables() {
  console.log('🚀 Creating missing DynamoDB tables...\n');

  // Files Table
  await createTable({
    TableName: 'ai-tutor-app-files-dev',
    AttributeDefinitions: [
      { AttributeName: 'fileId', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'fileId', KeyType: 'HASH' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  });

  // Messages Table
  await createTable({
    TableName: 'ai-tutor-app-messages-dev',
    AttributeDefinitions: [
      { AttributeName: 'messageId', AttributeType: 'S' },
      { AttributeName: 'chatId', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'messageId', KeyType: 'HASH' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'ChatIdIndex',
        KeySchema: [
          { AttributeName: 'chatId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  });

  console.log('\n🎉 Table creation completed!');
}

createAllTables().catch(console.error);
