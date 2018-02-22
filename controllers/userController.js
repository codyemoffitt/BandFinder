const user = require('../models/user');
const async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all users.
exports.user_list = function(req, res, next) {
  if (typeof req.params.instrument == 'undefined') {
    user
      .find()
      .sort([['family_name', 'ascending']])
      .exec((err, list_users) => {
        if (err) {
          return next(err);
        }
        // Successful, so render
        res.render('user_list', { title: 'User List', user_list: list_users });
      });
  } else {
    user
      .find({ instrument: req.params.instrument, zipcode: req.params.zipcode })
      .sort([['family_name', 'ascending']])
      .exec((err, list_users) => {
        if (err) {
          return next(err);
        }
        // Successful, so render
        res.render('user_list', { title: 'User List', user_list: list_users });
      });
  }
};

// Display detail page for a specific user.
exports.user_detail = function(req, res, next) {
  async.parallel(
    {
      user(callback) {
        user.findById(req.params.id).exec(callback);
      },
      users_books(callback) {
        Book.find({ user: req.params.id }, 'title summary').exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      } // Error in API usage.
      if (results.user == null) {
        // No results.
        var err = new Error('user not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('user_detail', {
        title: 'user Detail',
        user: results.user,
        user_books: results.users_books
      });
    }
  );
};

// Display user create form on GET.
exports.user_create_get = function(req, res, next) {
  res.render('user_form', { title: 'Create user' });
};

// Handle user create on POST.
exports.user_create_post = [
  // Validate fields.
  body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

  // Sanitize fields.
  sanitizeBody('first_name')
    .trim()
    .escape(),
  sanitizeBody('family_name')
    .trim()
    .escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('user_form', {
        title: 'Create user',
        user: req.body,
        errors: errors.array()
      });
    } else {
      // Data from form is valid.

      // Create an user object with escaped and trimmed data.
      var user = new user({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      user.save(function(err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new user record.
        res.redirect(user.url);
      });
    }
  }
];

// Display user delete form on GET.
exports.user_delete_get = function(req, res, next) {
  async.parallel(
    {
      user(callback) {
        user.findById(req.params.id).exec(callback);
      },
      users_books(callback) {
        Book.find({ user: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.user == null) {
        // No results.
        res.redirect('/catalog/users');
      }
      // Successful, so render.
      res.render('user_delete', {
        title: 'Delete user',
        user: results.user,
        user_books: results.users_books
      });
    }
  );
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res, next) {
  async.parallel(
    {
      user(callback) {
        user.findById(req.body.userid).exec(callback);
      },
      users_books(callback) {
        Book.find({ user: req.body.userid }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.users_books.length > 0) {
        // user has books. Render in same way as for GET route.
        res.render('user_delete', {
          title: 'Delete user',
          user: results.user,
          user_books: results.users_books
        });
        return;
      } else {
        // user has no books. Delete object and redirect to the list of users.
        user.findByIdAndRemove(req.body.userid, function deleteuser(err) {
          if (err) {
            return next(err);
          }
          // Success - go to user list
          res.redirect('/catalog/users');
        });
      }
    }
  );
};

// Display user update form on GET.
exports.user_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: user update GET');
};

// Handle user update on POST.
exports.user_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: user update POST');
};
