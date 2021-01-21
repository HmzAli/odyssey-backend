const express = require('express'),
  router = express.Router()

/* Home page. */
router.get('/', function(request, response) {
  response.render('index', { title: 'Odyssey Backend' })
});

module.exports = router
