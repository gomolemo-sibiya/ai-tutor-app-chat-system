// Quick test script for deployed AWS API
const axios = require('axios');

// Replace with your actual API Gateway URL after deployment
const API_BASE_URL = 'https://YOUR_API_GATEWAY_URL/dev';

async function testDeployment() {
  console.log('🧪 Testing AWS API Gateway deployment...\n');
  
  const tests = [
    {
      name: 'Test Files Endpoint',
      method: 'GET',
      url: `${API_BASE_URL}/files`
    },
    {
      name: 'Test Chat Endpoint', 
      method: 'GET',
      url: `${API_BASE_URL}/chat?studentId=student-1`
    },
    {
      name: 'Test Create Chat',
      method: 'POST',
      url: `${API_BASE_URL}/chat`,
      data: {
        studentId: 'test-student',
        queryType: 'general',
        title: 'Test Chat',
        notes: 'Deployment test'
      }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`⏳ ${test.name}...`);
      
      const config = {
        method: test.method,
        url: test.url,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (test.data) {
        config.data = test.data;
      }
      
      const response = await axios(config);
      console.log(`✅ ${test.name}: Status ${response.status}`);
      console.log(`   Data:`, JSON.stringify(response.data, null, 2).substring(0, 200));
      
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data}`);
      }
    }
    console.log('');
  }
}

// Update this with your deployed API URL and run: node test-deployment.js
if (require.main === module) {
  if (API_BASE_URL.includes('YOUR_API_GATEWAY_URL')) {
    console.log('❌ Please update API_BASE_URL with your actual API Gateway URL');
    console.log('   You can find it in the serverless deploy output');
  } else {
    testDeployment();
  }
}

module.exports = { testDeployment };
