const debug = require('debug')('app:roomController'),
      jwt = require('jsonwebtoken'),
      jwtConfig = require('../config/security')(),
      jwtKey = jwtConfig.getJWTKey();

const roomController = (Room, User) => {

  const post = (req, res) => {
    jwt.verify(req.token, jwtKey, (error, data) => {
      if (error) {
        res.sendStatus(403);
      } else {
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
      }
    });
  };

  const getByRoomId = (req, res) => {
    jwt.verify(req.token, jwtKey, (error, data) => {
      if (error) {
        res.sendStatus(403);
      } else {
        res.status(200).json(req.room);
      }
    });
  };

  const getRooms = (req, res) => {
    jwt.verify(req.token, jwtKey, (error, data) => {
      if (error) {
        debug(error);
        res.sendStatus(403);
      } else {
        let query;

        if (req.query.userId) {
          query = {
            userId: req.query.userId
          }
        }

        if (query) {
          getRoomsByUserId(req, res, query);
        } else if (JSON.stringify(req.query) === '{}') {
          getAll(req, res);
        } else {
          res.status(404).send('Invalid query string');
        }
      }
    });
  };

  const getAll = (req, res) => {

    Room.find((error, allRooms) => {
      if (error) {
        res.status(500).send(error);
        debug(error);
      } else {
        res.status(200).json(allRooms);
        debug(allRooms);
      }
    });
  };

  const getRoomsByUserId = (req, res, query) => {
    Room.find({userIds: { $in: [query.userId] }}, (error, rooms) => {
      if (error) {
        res.status(500).send(error);
        debug(error);
      } else {
        if (rooms.length) {
          res.status(200).json(rooms);
          debug(rooms);
        } else {
          res.status(404).send('No rooms found');
          debug({status: 404, message: 'No rooms found'});
        }
      }
    });
  };

  const addUserToRoom = (req, res) => {
    jwt.verify(req.token, jwtKey, (error, data) => {
      if (error) {
        res.sendStatus(403);
      } else {
        User.findOne({email: req.body.userEmail}).exec().then((foundUser) => {
          if (foundUser) {
            Room.findOne({_id: req.params.roomId}, (error, room) => {
              if (error) {
                res.status(500).send(error);
                debug(error);
              } else {
                if (room) {
                  const userAlreadyInRoom = room.userIds.indexOf(foundUser._id) !== -1;

                  if (!userAlreadyInRoom) {
                    room.userIds.push(foundUser._id);
                    room.save((error, savedRoom) => {
                      if (error) {
                        res.status(500).send(error);
                        debug(error);
                      } else {
                        res.status(200).json(savedRoom);
                        debug(savedRoom);
                      }
                    });
                  } else {
                    res.status(400).send(`That user is already in ${room.roomName}`);
                    debug({status: 400, message: `That user is already in ${room.roomName}`});
                  }
                } else {
                  res.status(404).send('No room found');
                  debug({status: 404, message: 'No room found'});
                }
              }
            });
          } else {
            res.status(404).send('No user found with that email');
            debug({status: 404, message: 'No user found with that email'});
          }
        });
      }
    });
  };

  return {
    getRooms: getRooms,
    post: post,
    getByRoomId: getByRoomId,
    addUserToRoom: addUserToRoom
  }
};

module.exports = roomController;