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
    it('should respond to Query');

    it('should respond to Admin Query');

    it('should only respond to [add|remove]');

    it('should only respond to the correct number of commands');

    it('should only respond to the correct password');

    it('should not respond for an inappropriate channel');

    it('should not respond for an inappropriate plugin');

    it('should not double a plugin');

    it('should not remove a non-existent plugin');

    it('should add a disabled plugin');

    it('should remove an enabled plugin');
  });

  describe('Responds to Kicks and Bans', () => {
    it('should attempt to rejoin after kicks in 3 seconds');

    it('should attempt to rejoin after bans in 3 minutes');

    it('should be able to rejoin a +k channel');

    it('should not keep trying to rejoin a +k channel');
  });
});
