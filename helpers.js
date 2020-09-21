/* eslint-disable prettier/prettier */
exports.filterObject = (obj, ...allowedFields) => {
    const newObj = {};
  
    Object.keys(obj).forEach((field) => {
      if (allowedFields.includes(field)) {
        newObj[field] = obj[field];
      }
    });
  
    return newObj;
  };

exports.echo = (msg) => console.log("hello " + msg);
  