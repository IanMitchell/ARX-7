import 'babel-polyfill';
import { describe, afterEach, beforeEach, it } from 'mocha';
import assert from 'assert';
import config from './test_config';
import { Client,
         Choose,
         Imgur,
         Order,
         Reply,
         Time,
         Twitter,
         Youtube } from './helpers.js';
import { ARX7 } from '../src/arx7';

const client = new Client();
const arx7 = new ARX7(client, config);
arx7.commands = [
  new Choose(client),
  new Imgur(client),
  new Order(client),
  new Reply(client),
  new Time(client),
  new Twitter(client),
  new Youtube(client),
];

describe('ARX-7', () => {
  afterEach(() => {
    client.resetLog();
    client.resetChannels();
    arx7.droppedChannels.clear();
    arx7.commands.forEach(command => command.clearHistory());
  });

  describe('On Connect', () => {
    it('should identify on connect', () => {
      arx7.connect();
      assert.equal(client.lastTarget, 'NickServ');
      assert.equal(client.lastMessage, `identify password`);
    });

    it('should join channels after identify', () => {
      assert.equal(client.lastMessage, null);
      assert.equal(client.channelLog.length, 0);
      arx7.connect();
      assert(client.lastMessage);
      assert(client.channelLog.length > 0);
    });

    it('should handle uppercase channel names', () => {
      arx7.connect();
      assert(client.channelLog.includes('#arx-7'));
    });

    it('should join +k channels', () => {
      arx7.connect();
      assert(client.channelLog.includes('#arbalest sagara'));
    });
  });

  describe('Responds to CTCP Version', () => {
    it('should respond with VERSION', () => {
      arx7.version('Mocha', 'ARX-7');
      assert(client.lastMessage.includes('VERSION'));
      assert.equal(client.lastType, 'notice');
    });
  });

  describe('Responds to Messages', () => {
    it('should send message to plugins', () => {
      arx7.message('Mocha', '#arx-7', '.c 1 2 3');
      arx7.commands.forEach(command => assert.equal(command.log.length, 1));
    });

    // Aoi-chan Test
    it('should send message to plugins for non-lowercase channel', () => {
      arx7.join('#Some-Channel', 'ARX-7');
      arx7.message('Mocha', '#Some-Channel', '.c 1 2 3');
      assert(arx7.commands[0].log.includes('.c 1 2 3'));
    });

    it('should channel-restrict plugins', () => {
      arx7.message('Mocha', '#arbalest', '.c 1 2 3');
      assert(arx7.commands[0].log.includes('.c 1 2 3'));

      for (let i = 1; i < arx7.commands.length; i++) {
        assert.equal(arx7.commands[i].log.length, 0);
      }
    });
  });

  describe('Handles Authorization', () => {
    it('should remove event listeners');

    it('should handle simultaneous commands');
  });

  describe('Responds to Queries', () => {
    beforeEach(() => {
      arx7.isAuthorized = () => {
        return new Promise(resolve => resolve(true));
      };
    });

    it('should respond to Query', () => {
      return arx7.message('Mocha', 'ARX-7', 'Hi').then(() => {
        assert(client.lastMessage);
        assert(client.lastMessage.includes('Desch, Jukey, Aoi-chan'));
      });
    });

    it('should respond to Admin Query', () => {
      return arx7.message('Desch', 'ARX-7', 'Hi').then(() => {
        assert(client.lastMessage.includes('Command not recognized'));
      });
    });

    it('should respond to unidentified Admin Query', () => {
      arx7.isAuthorized = () => {
        return new Promise(resolve => resolve(false));
      };

      return arx7.message('Desch', 'ARX-7', 'add youtube #arx-7').then(() => {
        assert(client.lastMessage.includes('You are not identified.'));
      });
    });

    it('should only respond to [add|remove]', () => {
      return arx7.message('Desch', 'ARX-7', 'Hi replies #arx-7').then(() => {
        assert(client.lastMessage.includes('Command not recognized'));
      });
    });

    it('should only respond to the correct number of commands', () => {
      return arx7.message('Desch', 'ARX-7', 'add youtube #arx-7 oops').then(() => {
        assert(client.lastMessage.includes('Incorrect number of commands'));

        arx7.message('Desch', 'ARX-7', 'add youtube #arx-7').then(() => {
          assert(!client.lastMessage.includes('Incorrect number of commands'));
        });
      });
    });

    it('should not respond for an inappropriate channel', () => {
      return arx7.message('Desch', 'ARX-7', 'add youtube #wrong').then(() => {
        assert(client.lastMessage.includes('Invalid channel'));
      });
    });

    it('should not respond for an inappropriate plugin', () => {
      return arx7.message('Desch', 'ARX-7', 'add irc #arx-7').then(() => {
        assert(client.lastMessage.includes('Invalid plugin'));
      });
    });

    it('should not double a plugin', () => {
      return arx7.message('Desch', 'ARX-7', 'add youtube #arx-7').then(() => {
        assert(client.lastMessage.includes('already enabled'));
      });
    });

    it('should not remove a non-existent plugin', () => {
      return arx7.message('Desch', 'ARX-7', 'remove youtube #arbalest').then(() => {
        assert(client.lastMessage.includes('already disabled'));
      });
    });

    it('should add a disabled plugin', () => {
      assert(!arx7.config.channels[0].plugins.includes('youtube'));
      return arx7.message('Desch', 'ARX-7', 'add youtube #arbalest').then(() => {
        assert(client.lastMessage.includes('Enabled youtube for #arbalest'));
        assert(arx7.config.channels[0].plugins.includes('youtube'));
        arx7.config.channels[0].plugins.pop();
      });
    });

    it('should remove an enabled plugin', () => {
      assert(arx7.config.channels[0].plugins.includes('choose'));
      return arx7.message('Desch', 'ARX-7', 'remove choose #arbalest').then(() => {
        assert(client.lastMessage.includes('Disabled choose for #arbalest'));
        assert(!arx7.config.channels[0].plugins.includes('choose'));
        arx7.config.channels[0].plugins.push('choose');
      });
    });
  });

  describe('Responds to Kicks and Bans', () => {
    // TODO: Fix setTimeout
    // it('should attempt to rejoin after kicks in 3 seconds', () => {
    //   arx7.kick('#test', 'ARX-7', 'Mocha', 'Testing');
    //   assert.equal(null, client.getLastChannel());
    //   setTimeout(() => {
    //     assert.equal('#test', client.getLastChannel());
    //   }, 1000 * 3);
    // });

    it('should attempt to rejoin after bans in 3 minutes');

    it('should be able to rejoin a +k channel', () => {
      arx7.error({ args: [null, '#arbalest'], command: 'err_badchannelkey' });
      assert.equal('#arbalest sagara', client.getLastChannel());
      assert(arx7.droppedChannels.has('#arbalest'));
    });

    it('should not keep trying to rejoin a +k channel', () => {
      arx7.error({ args: [null, '#arbalest'], command: 'err_badchannelkey' });
      arx7.error({ args: [null, '#arbalest'], command: 'err_badchannelkey' });

      assert(arx7.droppedChannels.has('#arbalest'));
      assert.equal(1, client.channelLog.length);
    });

    it('should join +k channels when kicked twice', () => {
      arx7.error({ args: [null, '#arbalest'], command: 'err_badchannelkey' });
      arx7.join('#arbalest', 'ARX-7');
      assert(!arx7.droppedChannels.has('#arbalest'));

      arx7.error({ args: [null, '#arbalest'], command: 'err_badchannelkey' });
      assert.equal(2, client.channelLog.length);

      arx7.join('#arbalest', 'ARX-7');
      assert(!arx7.droppedChannels.has('#arbalest'));
    });
  });
});
