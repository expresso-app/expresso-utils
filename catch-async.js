/* eslint-disable prettier/prettier */
const catchAsync = func => {
    return (req, res, next) => {
      func(req, res, next).catch(next);
    }
};

module.exports = catchAsync;