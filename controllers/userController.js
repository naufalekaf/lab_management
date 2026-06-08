const { QueryTypes } = require('sequelize');
const User = require('../models/User');
const sequelize = require('../config/database');
const bcrypt = require("bcrypt");

const userController = {
  index: async (req, res) => {
    try {
      const users = await sequelize.query(
        `SELECT \`user\`.*, role.role_name FROM \`user\` JOIN role ON \`user\`.role_id = role.id`,
        {
          type: QueryTypes.SELECT,
        }
      );

      res.render('users/index', {
        pageTitle: 'Manajemen Pengguna',
        users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(`Error server: ${error.message}`);
    }
  },

  create: async (req, res) => {
    try {
      const roles = await sequelize.query('SELECT * FROM role', {
        type: QueryTypes.SELECT,
      });

      res.render('users/create', {
        pageTitle: 'Tambah Pengguna',
        roles,
      });
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  store: async (req, res) => {
    try {
      const { full_name, email, password, role_id } = req.body;

      await User.create({
        role_id,
        full_name,
        email,
        password,
        is_active: 1,
      });

      res.redirect('/users');
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  edit: async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = await User.findByPk(userId);
      const roles = await sequelize.query('SELECT * FROM role', {
        type: QueryTypes.SELECT,
      });

      if (!userData) {
        return res.status(404).send('User not found');
      }

      res.render('users/edit', {
        pageTitle: 'Edit Pengguna',
        userData,
        roles,
      });
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  update: async (req, res) => {
    try {
      const userId = req.params.id;
      const { full_name, email, role_id, is_active } = req.body;

      await User.update(
        {
          full_name,
          email,
          role_id,
          is_active,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      res.redirect('/users');
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  destroy: async (req, res) => {
    try {
      const userId = req.params.id;

      await User.destroy({
        where: {
          id: userId,
        },
      });

      res.redirect('/users');
    } catch (error) {
      console.log(error);
      res.send('Database Error');
    }
  },

  getProfile : async (req, res) => {
    const user = await User.findByPk(req.user.id);
    res.render("profile/index", {
      user
    });
  },

  updateProfile : async (req, res) => {
    try {
      const { full_name, email, phone_number } = req.body;

      const user = await User.findByPk(req.user.id);

      const emailExists = await User.findOne({
        where: {
          email,
          id: { [require("sequelize").Op.ne]: req.user.id }
        }
      });

      if (emailExists) {
        return res.render("profile/index", {
          user,
          errorMsg: "Email sudah digunakan user lain"
        });
      }

      await user.update({
        full_name,
        email,
        phone_number
      });

      req.session.user.full_name = full_name;
      req.session.user.email = email;
      req.session.user.phone_number = phone_number;

      // res.redirect("/dashboard");

      const updatedUser = await User.findByPk(req.user.id);

      res.render("profile/index", {
        user: updatedUser,
        successMsg: "Profile berhasil diperbarui"
      });

    } catch (err) {
      console.log(err);
      res.send("Error update profile");
    }
  },

  getChangePassword : (req, res) => {
    res.render("profile/change-password");
  },

  postChangePassword : async (req, res) => {
    try {
      const { old_password, new_password, confirm_password } = req.body;

      if (!req.user || !req.user.id) {
        return res.redirect("/login");
      }

      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.send("User tidak ditemukan");
      }

      const isMatch = await bcrypt.compare(old_password, user.password);

      if (!isMatch) {
        return res.render("profile/change-password", {
          errorMsg: "Password lama salah"
        });
      }

      if (new_password !== confirm_password) {
        return res.render("profile/change-password", {
          errorMsg: "Konfirmasi password tidak cocok"
        });
      }

      await user.update({
        password: new_password
      });

      return res.render("profile/change-password")

    } catch (err) {
      console.log("CHANGE PASSWORD ERROR:", err);
      return res.send("Error change password");
    }
  },
};

module.exports = userController;
