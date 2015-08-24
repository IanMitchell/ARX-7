import assert from "assert";
import {Client} from "../helpers.js";
import {Youtube} from "./../../src/commands/youtube";

let client = new Client();
let youtube = new Youtube(client);

describe('Youtube', () => {
  describe('Search General Usage', () => {
    it('should respond in correct channel', () => {
      youtube.message('Mocha', '#test', '.yt End Credits', null);
      assert.equal('#test', client.lastTarget);
      client.resetLog();
    });

    it('should respond to triggers', () => {
      youtube.message('Mocha', '#test', '.yt End Credits', null);
      assert.notEqual(null, client.lastMessage);
      client.resetLog();

      youtube.message('Mocha', '#test', '.youtube End Credits', null);
      assert.notEqual(null, client.lastMessage);
      client.resetLog();
    });

    it('should activate in beginning of phrase', () => {
      youtube.message('Mocha', '#test', '.yt End Credits', null);
      assert.notEqual(null, client.lastMessage);
      client.resetLog();
    });

    it('should not activate in middle of phrase', () => {
      youtube.message('Mocha', '#test', 'test .yt End Credits', null);
      assert.equal(null, client.lastMessage);
      client.resetLog();
    });

    it('should include [YouTube]', () => {
      youtube.message('Mocha', '#test', '.yt End Credits', null);
      assert(client.lastMessage.startsWith('[YouTube] '));
      client.resetLog();
    });
  });

  describe('Lookup General Usage', () => {
    it('should respond in correct channel', () => {
      assert(false, 'Not implemented');
    });

    it('should activate anywhere in phrase', () => {
      assert(false, 'Not implemented');
    });

    it('should respond to shortened links', () => {
      assert(false, 'Not implemented');
    });

    it('should include view count', () => {
      assert(false, 'Not implemented');
    });

    it('should include [Youtube]', () => {
      assert(false, 'Not implemented');
    });
  });
});
