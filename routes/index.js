const express = require("express");
const quranRoute = require("./quranRoute");
const userRoute = require("./userRoute");
const historyRoute = require("./historyRoute");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/quran",
    route: quranRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/history",
    route: historyRoute,
  },
];

const devRoutes = [
  // // routes available only in development mode
  // {
  //   path: '/docs',
  //   route: docsRoute,
  // },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
