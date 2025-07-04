const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// File paths
const CHAT_FILE = path.join(__dirname, 'data', 'chat.json');

// Helper function to read JSON file
async function readJSONFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Helper function to write JSON file
async function writeJSONFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

// Chat Routes
app.get('/api/chat', async (req, res) => {
  try {
    const { studentId } = req.query;
    let chats = await readJSONFile(CHAT_FILE);
    
    if (studentId) {
      chats = chats.filter(chat => chat.studentId === studentId);
    }
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chats' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { studentId, queryType, module, title, notes } = req.body;
    
    const chats = await readJSONFile(CHAT_FILE);
    
    const newChat = {
      chatId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      studentId,
      queryType,
      module: module || '',
      title: title || `${queryType === 'module' ? module : 'General'} Chat - ${new Date().toLocaleTimeString()}`,
      notes: notes || '',
      messages: []
    };
    
    chats.push(newChat);
    await writeJSONFile(CHAT_FILE, chats);
    
    res.json(newChat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

app.put('/api/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const updates = req.body;
    
    const chats = await readJSONFile(CHAT_FILE);
    const chatIndex = chats.findIndex(chat => chat.chatId === chatId);
    
    if (chatIndex === -1) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    chats[chatIndex] = { ...chats[chatIndex], ...updates };
    await writeJSONFile(CHAT_FILE, chats);
    
    res.json(chats[chatIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chat' });
  }
});

app.delete('/api/chat/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chats = await readJSONFile(CHAT_FILE);
    const filteredChats = chats.filter(chat => chat.chatId !== chatId);
    
    if (filteredChats.length === chats.length) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    await writeJSONFile(CHAT_FILE, filteredChats);
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

// AI Chat Response (Simple Dummy)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Simple dummy responses
    const dummyResponses = [
      "Thanks for your question! This is a dummy AI response.",
      "I understand what you're asking. Here's a sample response.",
      "That's a great question! This is just a placeholder response.",
      "I'm a dummy AI assistant. Your message was received successfully.",
      "This is a mock response to demonstrate the chat functionality."
    ];
    
    const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
    
    // Short delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ response: randomResponse });
  } catch (error) {
    console.error('AI Response Error:', error);
    res.status(500).json({ error: 'Sorry, there was an error processing your request.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chat server is running' });
});

app.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
