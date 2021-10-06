const express = require('express');
const router = new express.Router();

router.get('/', (req, res, next) => {
  try {
    res.redirect('https://www.notion.so/Catenoid-5e7d2309d16a493a8ae672b46af943fd');
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
