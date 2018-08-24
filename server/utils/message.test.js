var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Neelesh';
    var text = 'good day!';
    var message = generateMessage(from, text);
      console.log(message.createdAt);
    expect(message.createdAt).toBe('number');
    // expect(5).toBeA('number');
    // expect(message).toInclude({from, text});
  });
});
