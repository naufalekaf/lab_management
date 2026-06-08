const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

const authController = {
  showLogin: (req, res) => {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }

    res.render('auth/login', {
      errorMsg: null,
      fieldErrors: {},
      old: {},
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('auth/login', {
        errorMsg: 'Email dan password harus diisi',
        fieldErrors: {
          email: !email ? 'Harus diisi' : undefined,
          password: !password ? 'Harus diisi' : undefined,
        },
        old: { email: email || '' },
      });
    }

    try {
      const users = await sequelize.query(
        `SELECT \`user\`.*, role.role_name FROM \`user\` JOIN role ON \`user\`.role_id = role.id WHERE email = :email`,
        {
          replacements: { email },
          type: QueryTypes.SELECT,
        }
      );

      if (!users || users.length === 0) {
        return res.status(404).render('auth/login', {
          errorMsg: 'Email tidak ditemukan',
          fieldErrors: { email: 'Email tidak terdaftar' },
          old: { email },
        });
      }

      const user = users[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).render('auth/login', {
          errorMsg: 'Password salah',
          fieldErrors: { password: 'Password tidak cocok' },
          old: { email },
        });
      }

      if (user.is_active !== 1) {
        return res.status(403).render('auth/login', {
          errorMsg: 'Akun tidak aktif',
          old: { email },
        });
      }

      req.session.user = {
        id: user.id,
        full_name: user.full_name,
        role_name: user.role_name,
        email: user.email,
      };

      return res.redirect('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).render('auth/login', {
        errorMsg: 'Login error',
        old: { email },
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  },

  showChangePassword: (req, res) => {
    res.render('auth/change-password', {
      errorMsg: null,
      successMsg: null,
      fieldErrors: {}
    });
  },

  changePassword: async (req, res) => {
    try {
      const {
        current_password,
        new_password,
        confirm_password
      } = req.body;
      const fieldErrors = {};

      if (!current_password) {
        fieldErrors.current_password =
            'Password lama wajib diisi';
      }

      if (!new_password) {
        fieldErrors.new_password =
            'Password baru wajib diisi';
      }

      if (!confirm_password) {
        fieldErrors.confirm_password =
            'Konfirmasi password wajib diisi';
      }

      if (Object.keys(fieldErrors).length > 0) {
        return res.render(
            'auth/change-password',
            {
              errorMsg: null,
              successMsg: null,
              fieldErrors
            }
        );
      }

      const user = await User.findByPk(
          req.session.user.id
      );

      const isMatch = await bcrypt.compare(
          current_password,
          user.password
      );

      if (!isMatch) {
        return res.render(
            'auth/change-password',
            {
              errorMsg: 'Password lama salah',
              successMsg: null,
              fieldErrors: {}
            }
        );
      }

      if (new_password.length < 8) {
        return res.render(
            'auth/change-password',
            {
              errorMsg:
                  'Password baru minimal 8 karakter',
              successMsg: null,
              fieldErrors: {}
            }
        );
      }

      if (new_password !== confirm_password) {
        return res.render(
            'auth/change-password',
            {
              errorMsg:
                  'Konfirmasi password tidak cocok',
              successMsg: null,
              fieldErrors: {}
            }
        );
      }

      if (current_password === new_password) {
        return res.render(
            'auth/change-password',
            {
              errorMsg:
                  'Password baru harus berbeda dari password lama',
              successMsg: null,
              fieldErrors: {}
            }
        );
      }

      user.password = new_password;

      await user.save();

      return res.render(
          'auth/change-password',
          {
            errorMsg: null,
            successMsg:
                'Password berhasil diperbarui',
            fieldErrors: {}
          }
      );

    } catch (error) {
      console.error(error);
      return res.render(
          'auth/change-password',
          {
            errorMsg:
                'Terjadi kesalahan sistem',
            successMsg: null,
            fieldErrors: {}
          }
      );
    }
  },

};



module.exports = authController;
