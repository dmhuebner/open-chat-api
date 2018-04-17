const express = require('express'),
      ensureToken = require('../authentication/authenticate');

const routes = (Message, Room) => {
  const messageRouter = express.Router({mergeParams: true});

  const messageController = require('../controllers/messageController')(Message);

  messageRouter.use('/', (req, res, next) => {
    const roomId = req.params.roomId;
    Room.findById(roomId, (error, room) => {
      if (error) {
        res.status(500).send(error);
      } else if (!room) {
        res.status(404).send('No messages found for that roomId');
      } else {
        req.room = room;
        Message.find({roomId: roomId}, (error, messages) => {
          if (error) {
            console.log();
            res.status(500).send(error);
          } else if (!messages) {
            res.status(404).send('No messages found for that roomId');
          } else {
            req.messages = messages;
            next();
          }
        });
      }
    });
  });

  messageRouter.use(ensureToken);

  messageRouter.route('/')
    .get(messageController.get)
    .post(messageController.post);

  return messageRouter;
};

module.exports = routes;