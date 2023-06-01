const ChatMessage = require('./models/livechat/chatMessage.model');
const ChatSession = require('./models/livechat/chatSession.model');
const socketIO = require('socket.io');
const User = require('./models/user.model');

module.exports = (server) => {
  // saves all the connected clients
  const clients = {};

  // Create a new instance of the Socket.io server
  const io = socketIO(server,{
    path: '/api/live-chat',
  });

  // TODO : ADD ERROR HANDLING

  io.on('connection', async (socket) => {
    console.log('New client connected');

    socket.on('init', async (userId) => {
      // Fetch all active ChatSession for this user id and return them through emitting 'init' event
      const chatSessions = await ChatSession.find({
        participants: userId,
        status: 'active',
      }).populate('participants').populate('messages').exec();

      // Add them to the clients object
      clients[userId] = socket;

      socket.emit('receive message', chatSessions);
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected');

      // Remove them from the clients object
      for (const userId in clients) {
        if (clients[userId] === socket) {
          delete clients[userId];
          break;
        }
      }
    })

    socket.on('support:init', async (userId) => {
      // Fetch all active ChatSession for this user id and return them through emitting 'init' event
      const chatSessions = await ChatSession.find({
        participants: userId,
      }).populate('participants').populate('messages').exec();

      // Add them to the clients object
      clients[userId] = socket;

      socket.emit('receive message', chatSessions);
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected');

      // Remove them from the clients object
      for (const userId in clients) {
        if (clients[userId] === socket) {
          delete clients[userId];
          break;
        }
      }
    })

    socket.on('send message', async ({ userId, message, sessionId }) => {
      // Fetch the ChatSession for this user id and return it through emitting 'receive message' event
      const chatSession = await ChatSession.findOne({
        _id: sessionId,
      }).populate('participants').populate('messages').exec();

      console.log('chatSession', chatSession)

      // Save the message to the database
      const chatMessage = await ChatMessage.create({
        sender: userId,
        recipient: chatSession.participants.find((participant) => participant._id.toString() !== userId),
        text: message,
      });

      // Send the message to the other participant
      const otherParticipant = chatSession.participants.find((participant) => participant._id.toString() !== userId);
      console.log('otherParticipant.name', otherParticipant.name);
      // clients[otherParticipant].emit('receive message', chatMessage);

      // Add the message to the chat session
      chatSession.messages.push(chatMessage);
      await chatSession.save();

      // Emit an event to the other participant to update their list of chat sessions, return all chat sessions
      const updatedChatSessions = await ChatSession.find({
        participants: otherParticipant,
        status: 'active',
      }).populate('participants').populate('messages').exec();

      // Check if the other participant is still connected
      if (!clients[otherParticipant._id]) {
        console.log('Other participant is not connected');
      } else {
        clients[otherParticipant._id].emit('receive message', updatedChatSessions);
      }

      // Emit an event to the sender to update their list of chat sessions, return all chat sessions
      const updatedChatSessionsUser = await ChatSession.find({
        participants: userId,
        status: 'active',
      }).populate('participants').populate('messages').exec();
      clients[userId].emit('receive message', updatedChatSessionsUser);      
    })

    socket.on('customer:contactSupport', async (userId) => {
      console.log('Customer contacting support:', userId);

      // Check which support agent has the lowest number of active chat sessions
      const supportAgents = await User.find({
        role: 'Support',
      });
      const supportAgentChatSessions = await Promise.all(supportAgents.map(async (supportAgent) => {
        const chatSessions = await ChatSession.find({
          participants: supportAgent._id,
          status: 'active',
        }).populate('participants').populate('messages').exec();
        return {
          supportAgent,
          chatSessions,
        };
      }));

      const supportAgentWithLowestChatSessions = supportAgentChatSessions.reduce((prev, curr) => {
        if (prev.chatSessions.length < curr.chatSessions.length) {
          return prev;
        }
        return curr;
      });
      
      // Create a new ChatSession with the customer and the support agent
      const user = await User.findById(userId);
      const chatSession = await ChatSession.create({
        name: `${user.name}`,
        participants: [userId, supportAgentWithLowestChatSessions.supportAgent._id],
        status: 'active',
      });

      // Add the chat session to the clients object, return all chat sessions
      const chatSessions = await ChatSession.find({
        participants: userId,
        status: 'active',
      }).populate('participants').populate('messages').exec();
      clients[userId].emit('receive message', chatSessions);

      // Emit an event to the support agent to update their list of chat sessions
      const updatedChatSessions = await ChatSession.find({
        participants: supportAgentWithLowestChatSessions.supportAgent._id,
        status: 'active',
      }).populate('participants').populate('messages').exec();
      clients[supportAgentWithLowestChatSessions.supportAgent._id].emit('receive message', updatedChatSessions);
    });

    socket.on('message read', async (userId, chatSessionId) => {
      console.log('Message read:', chatSessionId);

      // Update the ChatSession in the database
      const chatSession = await ChatSession.findById(chatSessionId).populate('participants').populate('messages').exec();
      // Loop through the messages and update the read status of the ones that are unread
      chatSession.messages.forEach((message) => {
        if (message.read === false && message.sender.toString() !== userId) {
          message.isRead = true;
        }
      });
      await chatSession.save();

      // Emit an event to the other participant to update their list of chat sessions
      const otherParticipant = chatSession.participants.find((participant) => participant !== userId);
      const updatedChatSessions = await ChatSession.find({
        participants: otherParticipant,
        status: 'active',
      }).populate('participants').populate('messages').exec();
      clients[otherParticipant].emit('message seen', updatedChatSessions);
    });

    socket.on('support:markAsDone', async ({userId, sessionId}) => {
      console.log('Support marking chat session as done:', sessionId);

      // Update the ChatSession in the database
      const chatSession = await ChatSession.findById(sessionId).populate('participants').populate('messages').exec();
      chatSession.status = 'closed';  
      await chatSession.save();

      // Emit an event to the other participant to update their list of chat sessions
      const otherParticipant = chatSession.participants.find((participant) => participant._id !== userId);
      clients[otherParticipant._id].emit('ticket closed', chatSession);

      // Emit an event to the support agent to update their list of chat sessions
      const updatedChatSessions = await ChatSession.find({
        participants: userId,
      }).populate('participants').populate('messages').exec();

      clients[userId].emit('receive message', updatedChatSessions);

    });
  });
};
