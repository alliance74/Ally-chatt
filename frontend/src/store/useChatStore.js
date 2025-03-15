


import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import axiosInstance from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  Notifications: parseInt(localStorage.getItem("notifications") || "0"),
  userNotifications: JSON.parse(localStorage.getItem("userNotifications") || "{}"),

  resetNotifications: () => {
    set({ Notifications: 0, userNotifications: {} });
    localStorage.setItem("notifications", "0");
    localStorage.setItem("userNotifications", JSON.stringify({}));
  },


  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set((state) => {
        const newUserNotifications = { ...state.userNotifications };
        const userNotificationCount = newUserNotifications[userId] || 0;

        // Reset user notifications count
        newUserNotifications[userId] = 0;

        // Reduce global notifications count
        const updatedGlobalNotifications = Math.max(0, state.Notifications - userNotificationCount);

        // Update localStorage
        localStorage.setItem("userNotifications", JSON.stringify(newUserNotifications));
        localStorage.setItem("notifications", updatedGlobalNotifications.toString());

        return {
          messages: res.data,
          userNotifications: newUserNotifications,
          Notifications: updatedGlobalNotifications,
        };
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage"); // Prevent duplicate listeners

    socket.on("newMessage", (newMessage) => {
      set((state) => {
        const { selectedUser, messages, Notifications, userNotifications } = state;
        const isChatOpen = selectedUser && newMessage.senderId === selectedUser._id;
        const newUserNotifications = { ...userNotifications };

        if (isChatOpen) {
          const userNotificationCount = newUserNotifications[newMessage.senderId] || 0;

          // Reset notifications for the selected user
          newUserNotifications[newMessage.senderId] = 0;

          // Reduce global notifications
          const updatedGlobalNotifications = Math.max(0, Notifications - userNotificationCount);

          // Update localStorage
          localStorage.setItem("userNotifications", JSON.stringify(newUserNotifications));
          localStorage.setItem("notifications", updatedGlobalNotifications.toString());

          return {
            messages: [...messages, newMessage],
            userNotifications: newUserNotifications,
            Notifications: updatedGlobalNotifications,
          };
        } else {
          // Increase notifications for the user and globally
          newUserNotifications[newMessage.senderId] = (newUserNotifications[newMessage.senderId] || 0) + 1;
          const updatedGlobalNotifications = Notifications + 1;

          localStorage.setItem("userNotifications", JSON.stringify(newUserNotifications));
          localStorage.setItem("notifications", updatedGlobalNotifications.toString());

          toast.success(`New message from ${newMessage.senderName}`);

          return {
            userNotifications: newUserNotifications,
            Notifications: updatedGlobalNotifications,
          };
        }
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => {
    set((state) => {
      const newUserNotifications = { ...state.userNotifications };
      const userNotificationCount = newUserNotifications[selectedUser._id] || 0;

      // Reset notifications for selected user
      newUserNotifications[selectedUser._id] = 0;

      // Reduce global notifications
      const updatedGlobalNotifications = Math.max(0, state.Notifications - userNotificationCount);

      // Update localStorage
      localStorage.setItem("userNotifications", JSON.stringify(newUserNotifications));
      localStorage.setItem("notifications", updatedGlobalNotifications.toString());

      return {
        selectedUser,
        userNotifications: newUserNotifications,
        Notifications: updatedGlobalNotifications,
      };
    });
  },


  
  setSelectedUser: (selectedUser) => {
    if (!selectedUser) {
      set({ selectedUser: null, messages: [] });  
      return;
    }
    set({ selectedUser });
  },
  
}));








