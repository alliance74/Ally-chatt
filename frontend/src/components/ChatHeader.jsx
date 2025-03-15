//  import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";
// import NochatSelected from "./NoChatSelected";

// const ChatHeader = () => {
//   const { selectedUser } = useChatStore();
//   const { onlineUsers } = useAuthStore();

//   return (
//     <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Avatar */}
//           <div className="avatar">
//             <div className="size-10 rounded-full relative">
//               <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
//             </div>
//           </div>

//           {/* User info */}
//           <div>
//             <h3 className="font-medium">{selectedUser.fullName}</h3>
//             <p className="text-sm text-base-content/70">
//               {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>

//         {/* Close button */}
//         <button onClick={ NochatSelected}>
//           <X />
//         </button>
//       </div>
//     </div>
//   );
// };


// export default ChatHeader

// import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";
// import NochatSelected from "./NoChatSelected";

// const ChatHeader = () => {
//   const { selectedUser, setSelectedUser } = useChatStore();
//   const { onlineUsers } = useAuthStore();

//   const handleCloseChat = () => {
//     // Reset selected user and clear the chat state
//     setSelectedUser(null);
//   };

//   return (
//     <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Avatar */}
//           <div className="avatar">
//             <div className="size-10 rounded-full relative">
//               <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.fullName} />
//             </div>
//           </div>

//           {/* User info */}
//           <div>
//             <h3 className="font-medium">{selectedUser?.fullName}</h3>
//             <p className="text-sm text-base-content/70">
//               {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
//             </p>
//           </div>
//         </div>

//         {/* Close button */}
//         <button onClick={handleCloseChat}>
//           <X />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;




import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import NochatSelected from "./NoChatSelected";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleCloseChat = () => {
    // Reset selected user and clear the chat state
    setSelectedUser(null);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {selectedUser ? (
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.fullName} />
              </div>
            </div>
          ) : null}

          {/* User info */}
          {selectedUser ? (
            <div>
              <h3 className="font-medium">{selectedUser?.fullName}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
              </p>
            </div>
          ) : null}
        </div>

        {/* Close button */}
        <button onClick={handleCloseChat}>
          <X />
        </button>
      </div>

      {/* Conditionally render NoChatSelected when there is no selected user */}
      {!selectedUser && <NochatSelected />}
    </div>
  );
};

export default ChatHeader;

