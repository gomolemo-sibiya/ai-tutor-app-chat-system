const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function deployFresh() {
  console.log('🚀 Starting fresh deployment...\n');
  
  try {
    // Deploy with correct config
    console.log('📦 Deploying serverless-complete.yml...');
    const { stdout, stderr } = await execAsync('serverless deploy --stage dev --config serverless-complete.yml');
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('\n✅ Deployment completed!');
    console.log('🔄 Now populate the tables...');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
}

deployFresh();
