var Song = require('../models/song');
const async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all songs.
exports.song_list = function(req, res, next) {
  Song.find()
    .sort([['rank', 'ascending']])
    .exec((err, list_songs) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render('song_list', { title: 'Song List', song_list: list_songs });
    });
};

// Display detail page for a specific song.
exports.song_detail = function(req, res, next) {
  async.parallel(
    {
      song: function(callback) {
        Song.findById(req.params.id).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.song == null) {
        // No results.
        var err = new Error('song not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('song_detail', {
        title: 'Title',
        song: results.song
      });
    }
  );
};

// Display song create form on GET.
exports.song_create_get = function(req, res, next) {
  res.render('song_form', { title: 'Create song' });
};

// Handle song create on POST.
exports.song_create_post = [
  // Validate fields.
  body('name', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('artist', 'Artist must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('link', 'Link must not be empty.')
    .isLength({ min: 1 })
    .trim(),

  // Sanitize fields (using wildcard).
  sanitizeBody('*')
    .trim()
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a song object with escaped and trimmed data.
    var song = new Song({
      artist: req.body.artist,
      name: req.body.name,
      link: req.body.link
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all songs and genres for form.
      async.parallel(function(err, results) {
        if (err) {
          return next(err);
        }

        // Mark our selected genres as checked.
        for (let i = 0; i < results.genres.length; i++) {
          if (song.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('song_form', {
          title: 'Create song',
          song: song,
          errors: errors.array()
        });
      });
      return;
    } else {
      // Data from form is valid. Save song.
      song.save(function(err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new song record.
        res.redirect(song.url);
      });
    }
  }
];

// Display song delete form on GET.
exports.song_delete_get = function(req, res, next) {
  async.parallel(
    {
      song: function(callback) {
        Song.findById(req.params.id).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.song == null) {
        // No results.
        res.redirect('/songs');
      }
      // Successful, so render.
      res.render('song_delete', { title: 'Delete song', song: results.song });
    }
  );
};

// Handle song delete on POST.
exports.song_delete_post = function(req, res, next) {
  async.parallel(
    {
      song: function(callback) {
        Song.findById(req.body.songid).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success
      // Delete object and redirect to the list of songs.
      Song.findByIdAndRemove(req.body.songid, function deletesong(err) {
        if (err) {
          return next(err);
        }
        // Success - go to song list
        res.redirect('/songs');
      });
    }
  );
};

// Handle song upvote on GET.
exports.song_upvote_get = function(req, res, next) {
  async.parallel(
    {
      song: function(callback) {
        Song.findById(req.params.id).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.song == null) {
        // No results.
        var err = new Error('song not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('song_detail', {
        title: 'Title',
        song: results.song
      });
    }
  );
};

// Handle song upvote on POST.
exports.song_upvote_post = function(req, res, next) {
  async.parallel(
    {
      song: function(callback) {
        Song.findById(req.body.songid).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success
      // Delete object and redirect to the list of songs.
      console.log(results);
      Song.findByIdAndUpdate(req.body.songid, { upvotes: results.song.upvotes + 1 }, function(err) {
        if (err) {
          return next(err);
        }
        // Success - go to song detail page
        res.redirect(results.song.url);
      });
    }
  );
};

// Handle song downvote on GET.
exports.song_downvote_get = function(req, res, next) {
  async.parallel(
    {
      song: function(callback) {
        Song.findById(req.params.id).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.song == null) {
        // No results.
        var err = new Error('song not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('song_detail', {
        title: 'Title',
        song: results.song
      });
    }
  );
};

// Handle song downvote on POST.
exports.song_downvote_post = function(req, res, next) {
  async.parallel(
    {
      song: function(callback) {
        Song.findById(req.body.songid).exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      // Success
      // Delete object and redirect to the list of songs.
      console.log(results);
      Song.findByIdAndUpdate(req.body.songid, { downvotes: results.song.downvotes + 1 }, function(
        err
      ) {
        if (err) {
          return next(err);
        }
        // Success - go to song detail page
        res.redirect(results.song.url);
      });
    }
  );
};
