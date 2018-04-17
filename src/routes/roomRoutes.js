const express = require('express'),
      ensureToken = require('../authentication/authenticate');

const routes = (Room) => {
  const roomRouter = express.Router();

  const roomController = require('../controllers/roomController')(Room);

  roomRouter.use(ensureToken);

  roomRouter.route('/')
    .get(roomController.getAll)
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
    .get(roomController.getByRoomId);

  return roomRouter;
};

module.exports = routes;