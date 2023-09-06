const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const userRepository = require("./../repository/user.repository");
const { promisify } = require("util");
const { OAuth2Client } = require("google-auth-library");
const { default: axios } = require("axios");

const sendAndCreateToken = (res, statusCode, user) => {
  let token = asignToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(statusCode)
    .json({
      status: "success",
      token,
      data: {
        user,
      },
    });
};

const asignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await userRepository.createUser(req.body);
  sendAndCreateToken(res, 201, newUser);
});

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("please provite an email", 400));
  let user = await userRepository.getOne({ email });
  if (
    !user ||
    (!(await user.corectpassword(password, user.password)) &&
      !(user.password == password))
  ) {
    return next(new AppError("email or password incorrect", 401));
  }
  sendAndCreateToken(res, 200, user);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("you not logged in !!", 401));
  }

  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let CurrentUser = await userRepository.getOne({ _id: decoded.id });

  if (!CurrentUser)
    return next(new AppError("the user is not defined at this token !!!", 401));

  // if (CurrentUser.changePasswordVRF(decoded.iat))
  //   return next(new AppError('password modified please login a gain !!!', 401));

  req.user = CurrentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    let decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    let CurrentUser = await userRepository.getOne({ _id: decoded.id });

    if (!CurrentUser) return next();

    // if (CurrentUser.changePasswordVRF(decoded.iat))
    //   return next(new AppError('password modified please login a gain !!!', 401));
    res.locals.user = CurrentUser;
    return next();
  }
  next();
});

exports.restricteTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles))
      return next(new AppError("you not an admin !!??"), 403);
    next();
  };
};

// exports.updatePassword = async (req, res, next) => {
//   const id = req.user.id;
//   const user = await User.findById(id).select("+password");
//   if (!(await user.corectpassword(req.body.CurrentPassword, user.password)))
//     return next(new AppError("Your current passwod is wrong!", 401));

//   user.password = req.body.password;
//   user.conformPassword = req.body.conformPassword;
//   await user.save();

//   sendAndCreateToken(res, 200, user);
// };

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await userRepository.getUserById(id);

  if (!user) {
    return next(new AppError(`No user found with that Id`, 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.oauth2callback = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  axios("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${code}`,
    },
  }).then(async ({ data }) => {
    const { email, email_verified, family_name } = data;
    if (!email_verified) return;
    const userExist = await userRepository.getOne({ email });
    if (!userExist) {
      console.log("signup");
      const credentials = {
        name: family_name,
        email,
        password: email,
        phone: 23180229,
      };
      let newUser = await userRepository.createUser(credentials);
      sendAndCreateToken(res, 201, newUser);
    } else {
      sendAndCreateToken(res, 200, userExist);
    }
  });
});
