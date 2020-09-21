const { errorHandling, catchAsync, helpers } = require('./index');
//const utils = require('./index');

const res = helpers.filterObject({ id: 1, name: "ali", age: 30 }, "name", "age");
console.log(res);

//utils.helpers.echo();
helpers.echo("omar");

//console.log(catchAsync);

//const appError = new AppError("ERROR!!!", 400);
//console.log(appError);

//console.log(globalErrorHandler);

// const appError = new errorHandling.AppError("ERROR", 500);
// console.log(appError);