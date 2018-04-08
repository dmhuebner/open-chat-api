const express = require('express');

const routes = (Message) => {
  const messageRouter = express.Router();

  const messageController = require('../controllers/messageController')(Message);

  messageRouter.use('/:roomId', (req, res, next) => {
    Message.find({roomId: req.params.roomId}, (error, messages) => {
      if (error) {
        res.status(500).send(error);
      } else if (messages) {
        req.messages = messages;
        next();
      } else {
        res.status(404).send('No messages found for that roomId');
      }
    });
  });

  messageRouter.route('/:roomId')
    .get(messageController.getMessagesByRoomId);

  // TODO should be /:roomId/messages
  messageRouter.route('/')
    .post(messageController.post);

  return messageRouter;
};

module.exports = routes;