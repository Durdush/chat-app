var moment = require('moment');

var generateMessage = (from,to,text) => {
  return {
    from,
    to,
    text,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage};
