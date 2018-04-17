const debug = require('debug')('app:messageController'),
      jwt = require('jsonwebtoken'),
      jwtKey = require('../config/security')();

const messageController = (Message) => {

  const get = (req, res) => {
    jwt.verify(req.token, jwtKey, (error, data) => {
      if (error) {
        res.sendStatus(403);
      } else {
        res.status(200).json(req.messages);
        debug(req.messages);
      }
    });
  };

  const post = (req, res) => {
    jwt.verify(req.token, jwtKey, (error, data) => {
      if (error) {
        res.sendStatus(403);
      } else {
        // TODO Validations
        // TODO validations - check if userId and roomId are valid

        if (!req.body.content || !req.body.userId || !req.body.roomId || !req.body.username || !req.body.dateCreated) {
          res.status(400);
          res.send('Bad request, request body incomplete');
          debug('Status 400: Bad request, request body incomplete');
        } else {
          const message = new Message(req.body);
          message.save((error, message) => {
            if (error) {
              res.status(500);
              res.send(error);
            } else {
              res.status(201);
              res.send({message: 'Message was created successfully', response: {messageId: message._id}});
              debug(message);
              debug('Status 201: Message was created successfully');
            }
          });
        }
      }
    });
  };

  return {
    get: get,
    post: post
  }
};

module.exports = messageController;