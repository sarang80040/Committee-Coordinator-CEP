const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const { committee } = req.user;
    const messages = await Message.find({ committee })
      .populate('sender', 'username role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { _id: sender, committee } = req.user;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const newMessage = await Message.create({
      sender,
      committee,
      text,
    });

    await newMessage.populate('sender', 'username role');

    // Emit event to room
    if (req.io) {
      req.io.to(committee).emit('receive_message', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
