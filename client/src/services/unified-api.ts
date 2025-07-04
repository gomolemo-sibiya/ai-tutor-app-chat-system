import axios from "axios";
import type { ChatHistory, UserRole, AIChatRequest } from "../types";
// import { createUnifiedApiService } from "./apiServiceFactory";

const API_BASE = "./api";

// Create axios instance with role-based headers
const createApiClient = (userRole: UserRole, userId?: string) => {
  return axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "X-User-Role": userRole,
      "X-User-Id": userId || "",
    },
  });
};

export class UnifiedApiService {
  private userRole: UserRole;
  private userId?: string;
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(userRole: UserRole, userId?: string) {
    this.userRole = userRole;
    this.userId = userId;
    this.apiClient = createApiClient(userRole, userId);
  }

  // Update role context
  updateRole(userRole: UserRole, userId?: string) {
    this.userRole = userRole;
    this.userId = userId;
    this.apiClient = createApiClient(userRole, userId);
  }

  // Unified Chat Service - Student-only access
  chat = {
    getAll: async (studentId?: string) => {
      // Only students can access chats
      if (this.userRole !== "student") {
        return Promise.reject(new Error("Only students can access chats"));
      }

      // For AWS serverless-complete, student must request their own chats
      // The studentId parameter is passed but headers determine access
      const targetStudentId = studentId || this.userId;

      const requestHeaders = {
        "Content-Type": "application/json",
        "X-User-Role": this.userRole,
        "X-User-Id": String(targetStudentId),
      };

      try {
        // Use serverless-complete chat endpoint with proper authentication
        const params = `?studentId=${targetStudentId}`;
        const response = await axios.get(
          `https://oqsoed5kqb.execute-api.us-east-2.amazonaws.com/dev/chat${params}`,
          {
            headers: requestHeaders,
          }
        );

        // Handle AWS response format - ensure we return the data in expected format
        let chats = response.data;
        if (chats && chats.data) {
          chats = chats.data;
        }

        // Ensure it's always an array
        if (!Array.isArray(chats)) {
          chats = [];
        }

        // Load messages for each chat
        console.log("📨 Loading messages for", chats.length, "chats...");
        const chatsWithMessages = await Promise.all(
          chats.map(async (chat: any) => {
            try {
              const messagesResponse = await axios.get(
                `https://oqsoed5kqb.execute-api.us-east-2.amazonaws.com/dev/chat/${chat.chatId}/messages`,
                { headers: requestHeaders }
              );

              let messages = messagesResponse.data;
              if (messages && messages.data) {
                messages = messages.data;
              }
              if (!Array.isArray(messages)) {
                messages = [];
              }

              console.log(
                `  ✅ Loaded ${messages.length} messages for chat: ${chat.title}`
              );

              return {
                ...chat,
                messages: messages,
              };
            } catch (messageError) {
              console.warn(
                `  ⚠️ Failed to load messages for chat ${chat.chatId}:`,
                messageError
              );
              return {
                ...chat,
                messages: [],
              };
            }
          })
        );

        console.log("✅ All chats loaded with messages");
        return { ...response, data: chatsWithMessages };
      } catch (awsError) {
        console.warn("AWS chat not available, using local:", awsError);
        const url = targetStudentId
          ? `/chat?studentId=${targetStudentId}`
          : "/chat";
        return this.apiClient.get<ChatHistory[]>(url);
      }
    },

    create: async (chat: Omit<ChatHistory, "chatId" | "timestamp">) => {
      // Only students can create chats
      if (this.userRole !== "student") {
        return Promise.reject(new Error("Only students can create chats"));
      }

      // Ensure student can only create chats for themselves
      const chatData = { ...chat, studentId: this.userId || chat.studentId };

      console.log("🔄 UnifiedAPI: Creating chat with data:", chatData);
      console.log(
        "🔄 UnifiedAPI: User role:",
        this.userRole,
        "User ID:",
        this.userId
      );

      try {
        // Use AWS endpoint for chat creation
        console.log("🚀 UnifiedAPI: Sending to AWS...");
        const response = await axios.post(
          "https://oqsoed5kqb.execute-api.us-east-2.amazonaws.com/dev/chat",
          chatData,
          {
            headers: {
              "Content-Type": "application/json",
              "X-User-Role": this.userRole,
              "X-User-Id": this.userId || "",
            },
          }
        );
        console.log("✅ UnifiedAPI: AWS response:", response);
        return response;
      } catch (awsError) {
        console.warn(
          "❌ UnifiedAPI: AWS chat create failed, using local:",
          awsError
        );
        return this.apiClient.post<ChatHistory>("/chat", chatData);
      }
    },

    update: async (chatId: string, updates: Partial<ChatHistory>) => {
      // Only students can update their own chats
      if (this.userRole !== "student") {
        return Promise.reject(new Error("Only students can update chats"));
      }

      try {
        // Use AWS endpoint for chat updates
        const response = await axios.put(
          `https://oqsoed5kqb.execute-api.us-east-2.amazonaws.com/dev/chat/${chatId}`,
          updates,
          {
            headers: {
              "Content-Type": "application/json",
              "X-User-Role": this.userRole,
              "X-User-Id": this.userId || "",
            },
          }
        );
        return response;
      } catch (awsError) {
        console.warn("AWS chat update failed, using local:", awsError);
        return this.apiClient.put<ChatHistory>(`/chat/${chatId}`, updates);
      }
    },

    delete: async (chatId: string) => {
      // Only students can delete their own chats
      if (this.userRole !== "student") {
        return Promise.reject(new Error("Only students can delete chats"));
      }

      try {
        // Use AWS endpoint for chat deletion
        const response = await axios.delete(
          `https://oqsoed5kqb.execute-api.us-east-2.amazonaws.com/dev/chat/${chatId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-User-Role": this.userRole,
              "X-User-Id": this.userId || "",
            },
          }
        );
        return response;
      } catch (awsError) {
        console.warn("AWS chat delete failed, using local:", awsError);
        return this.apiClient.delete(`/chat/${chatId}`);
      }
    },
  };

  // Unified AI Service - Uses preserved AWS URL
  ai = {
    chat: async (request: AIChatRequest) => {
      // Use the updated AWS chat URL
      try {
        const response = await axios.post(
          "https://oqsoed5kqb.execute-api.us-east-2.amazonaws.com/dev/chat",
          request,
          {
            headers: {
              "Content-Type": "application/json",
              "X-User-Role": this.userRole,
              "X-User-Id": this.userId || "",
            },
          }
        );
        return response;
      } catch (error) {
        // Fallback to local AI if AWS is unavailable
        return this.apiClient.post("/ai/chat", request);
      }
    },  
  };
}

// Factory function to create service instance
export const createUnifiedApiService = (
  userRole: UserRole,
  userId?: string
) => {
  return new UnifiedApiService(userRole, userId);
};

// Export for backward compatibility with existing components
export const unifiedApiService = new UnifiedApiService("student"); // Default instance
