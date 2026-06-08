const Room = require('../models/Room');

const roomController = {
  index: async (req, res) => {
    try {
      const rooms = await Room.findAll();
      res.render('rooms/index', {
        pageTitle: 'Manajemen Ruangan',
        rooms,
      });
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  create: async (req, res) => {
    try {
      res.render('rooms/create',{
        pageTitle: 'Tambah Ruangan',
      });
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  store: async (req, res) => {
    try {
      const { room_code, room_name, room_description } = req.body;

      await Room.create({
        room_code,
        room_name,
        room_description,
      });

      res.redirect('/rooms');
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  edit: async (req, res) => {
    try {
      const roomId = req.params.id;
      const roomData = await Room.findByPk(roomId);

      if (!roomData) {
        return res.status(404).send('Room not found');
      }

      res.render('rooms/edit', {
        pageTitle: 'Edit Ruangan',
        roomData,
      });
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  update: async (req, res) => {
    try {
      const roomId = req.params.id;
      const { room_code, room_name, room_description } = req.body;

      await Room.update(
        {
          room_code,
          room_name,
          room_description,
        },
        {
          where: {
            id: roomId,
          },
        }
      );

      res.redirect('/rooms');
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  destroy: async (req, res) => {
    try {
      const roomId = req.params.id;

      await Room.destroy({
        where: {
          id: roomId,
        },
      });

      res.redirect('/rooms');
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },
};

module.exports = roomController;
