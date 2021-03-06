const express = require('express'),
      ensureToken = require('../authentication/authenticate');

const routes = (Room, User) => {
  const roomRouter = express.Router();

  const roomController = require('../controllers/roomController')(Room, User);

  roomRouter.use(ensureToken);

  roomRouter.route('/')
    .get(roomController.getRooms)
    .post(roomController.post);

  roomRouter.use('/:roomId', (req, res, next) => {
    Room.findById(req.params.roomId, (error, room) => {
      if (error) {
        res.status(500).send(error);
      } else if (room) {
        req.room = room;
        next();
      } else {
        res.status(404).send('No room found');
      }
    });
  });

  roomRouter.use(ensureToken);

  roomRouter.route('/:roomId')
    .get(roomController.getByRoomId)
    .put(roomController.addUserToRoom);

  return roomRouter;
};

module.exports = routes;