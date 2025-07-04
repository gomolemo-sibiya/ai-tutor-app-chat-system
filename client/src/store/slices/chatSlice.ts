import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatHistory, ChatState } from '../../types';
import { chatService } from '../../services/api';

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  isLoading: false,
  error: null,
};

export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (studentId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await chatService.getChats(studentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch chats');
    }
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (chatData: Omit<ChatHistory, 'chatId' | 'timestamp'>, { rejectWithValue }) => {
    try {
      const response = await chatService.createChat(chatData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create chat');
    }
  }
);

export const updateChat = createAsyncThunk(
  'chat/updateChat',
  async ({ chatId, chatData }: { chatId: string; chatData: Partial<ChatHistory> }, { rejectWithValue }) => {
    try {
      const response = await chatService.updateChat(chatId, chatData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update chat');
    }
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId: string, { rejectWithValue }) => {
    try {
      await chatService.deleteChat(chatId);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete chat');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<ChatHistory | null>) => {
      state.currentChat = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create chat
      .addCase(createChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats.push(action.payload);
        state.currentChat = action.payload;
        state.error = null;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update chat
      .addCase(updateChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.chats.findIndex(chat => chat.chatId === action.payload.chatId);
        if (index !== -1) {
          state.chats[index] = action.payload;
        }
        if (state.currentChat?.chatId === action.payload.chatId) {
          state.currentChat = action.payload;
        }
        state.error = null;
      })
      .addCase(updateChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete chat
      .addCase(deleteChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = state.chats.filter(chat => chat.chatId !== action.payload);
        if (state.currentChat?.chatId === action.payload) {
          state.currentChat = null;
        }
        state.error = null;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentChat, clearError, clearCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;