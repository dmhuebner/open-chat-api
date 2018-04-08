const debug = require('debug')('app:roomController');

const roomController = (Room) => {

  const getAll = (req, res) => {
    const query = {};

    Room.find(query, (error, rooms) => {
      if (error) {
        res.status(500).send(error);
        debug(error);
      } else {
        res.status(200).json(rooms);
        debug(rooms);
      }
    });
  };

  const post = (req, res) => {
    // TODO Validations

    const room = new Room(req.body);

    if (!req.body.roomName || !req.body.roomOwnerId) {
      res.status(400);
      res.send('Bad request, request body incomplete');
      debug('Status 400: Bad request, request body incomplete');
    } else if (req.body.private && !req.body.userIds) {
      res.status(400);
      res.send('Bad request, private rooms require userIds');
      debug('Status 400: Bad request, private rooms require userIds');
    } else {
      room.save((error, room) => {
        if (error) {
          res.status(400);
          res.send(error);
        } else {
          res.status(201);
          res.send({message: 'Room was created successfully', response: {roomId: room._id}});
          debug(room);
          debug('Status 201: Room was created successfully');
        }
      });
    }
  };

  const getByRoomId = (req, res) => {
    res.status(200).json(req.room);
  };

  return {
    getAll: getAll,
    post: post,
    getByRoomId: getByRoomId
  }
};

module.exports = roomController;