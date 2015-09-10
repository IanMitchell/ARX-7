import assert from "assert";
import config from "./test_config";
import {Client} from "./helpers.js";
import {ARX7} from "../src/arx7";

let client = new Client();
let arx7 = new ARX7(client, config);

describe('ARX-7', () => {
  afterEach(() => {
    client.resetLog();
    client.resetChannels();
    arx7.droppedChannels.clear();
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
      assert.equal(client.channelLog[0], "#arx-7");
    });

    it('should join +k channels', () => {
      arx7.connect();
      assert.equal(client.channelLog[1], "#arbalest sagara");
    });
  });

  describe('Responds to CTCP Version', () => {
    it('should respond with VERSION', () => {
      arx7.version("Mocha", "ARX-7");
      assert(client.lastMessage.includes("VERSION"));
      assert.equal(client.lastType, "notice");
    });
  });

  describe('Responds to Messages', () => {
    it('should send message to plugins');

    it('should channel-restrict plugins');
  });

  describe('Responds to Queries', () => {
    it('should respond to Query', () => {
      arx7.message('Mocha', 'ARX-7', 'Hi');
      assert(client.lastMessage);
      assert(client.lastMessage.includes("Desch, Jukey, Aoi-chan"));
    });

    it('should respond to Admin Query', () => {
      arx7.message('Desch', 'ARX-7', 'Hi');
      assert(client.lastMessage.includes('Command not recognized'));
    });

    it('should only respond to [add|remove]', () => {
      arx7.message('Desch', 'ARX-7', 'Hi');
      assert(client.lastMessage.includes('Command not recognized'));
    });

    it('should only respond to the correct number of commands', () => {
      arx7.message('Desch', 'ARX-7', 'add youtube #arx-7 password oops');
      assert(client.lastMessage.includes('Incorrect number of commands'));

      arx7.message('Desch', 'ARX-7', 'add youtube #arx-7');
      assert(client.lastMessage.includes('Incorrect number of commands'));

      arx7.message('Desch', 'ARX-7', 'add youtube #arx-7 admin');
      assert(!client.lastMessage.includes('Incorrect number of commands'));
    });

    it('should only respond to the correct password', () => {
      arx7.message('Desch', 'ARX-7', 'add youtube #arx-7 wrong');
      assert(client.lastMessage.includes('Invalid password'));

      arx7.message('Desch', 'ARX-7', 'add youtube #arx-7 admin');
      assert(!client.lastMessage.includes('Invalid password'));
    });

    it('should not respond for an inappropriate channel', () => {
      arx7.message('Desch', 'ARX-7', 'add youtube #wrong admin');
      assert(client.lastMessage.includes('Invalid channel'));
    });

    it('should not respond for an inappropriate plugin', () => {
      arx7.message('Desch', 'ARX-7', 'add irc #arx-7 admin');
      assert(client.lastMessage.includes('Invalid plugin'));
    });

    it('should not double a plugin', () => {
      arx7.message('Desch', 'ARX-7', 'add youtube #arx-7 admin');
      assert(client.lastMessage.includes('already enabled'));
    });

    it('should not remove a non-existent plugin', () => {
      arx7.message('Desch', 'ARX-7', 'remove youtube #arbalest admin');
      assert(client.lastMessage.includes('already disabled'));
    });

    it('should add a disabled plugin', () => {
      assert(!arx7.config.channels[1].plugins.includes('youtube'));
      arx7.message('Desch', 'ARX-7', 'add youtube #arbalest admin');
      assert(client.lastMessage.includes('Enabled youtube for #arbalest'));
      assert(arx7.config.channels[1].plugins.includes('youtube'));
      arx7.config.channels[1].plugins.pop();
    });

    it('should remove an enabled plugin', () => {
      assert(arx7.config.channels[1].plugins.includes('reply'));
      arx7.message('Desch', 'ARX-7', 'remove reply #arbalest admin');
      assert(client.lastMessage.includes('Disabled reply for #arbalest'));
      assert(!arx7.config.channels[1].plugins.includes('reply'));
      arx7.config.channels[1].plugins.push('reply');
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
      arx7.error({args: [null, '#arbalest'], command: 'err_badchannelkey'});
      assert.equal('#arbalest sagara', client.getLastChannel());
      assert(arx7.droppedChannels.has('#arbalest'));
    });

    it('should not keep trying to rejoin a +k channel', () => {
      arx7.error({args: [null, '#arbalest'], command: 'err_badchannelkey'});
      arx7.error({args: [null, '#arbalest'], command: 'err_badchannelkey'});

      assert(arx7.droppedChannels.has('#arbalest'));
      assert.equal(1, client.channelLog.length);
    });

    it('should join +k channels when kicked twice', () => {
      arx7.error({args: [null, '#arbalest'], command: 'err_badchannelkey'});
      arx7.join('#arbalest', 'ARX-7');
      assert(!arx7.droppedChannels.has('#arbalest'));

      arx7.error({args: [null, '#arbalest'], command: 'err_badchannelkey'});
      assert.equal(2, client.channelLog.length);

      arx7.join('#arbalest', 'ARX-7');
      assert(!arx7.droppedChannels.has('#arbalest'));
    });
  });
});
