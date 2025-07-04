const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });

async function createUsersTable() {
  const params = {
    TableName: 'ai-tutor-complete-users-dev',
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    const result = await client.send(new CreateTableCommand(params));
    console.log('✅ Users table created successfully:', result.TableDescription.TableName);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Table already exists');
    } else {
      console.error('❌ Error creating table:', error);
    }
  }
}

createUsersTable();
