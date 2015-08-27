import assert from "assert";
import should_promised from "should-promised";
import {Client} from "../helpers.js";
import {Youtube} from "../../src/commands/youtube";

let client = new Client();
let youtube = new Youtube(client);

describe('Youtube', () => {
  afterEach(() => {
    client.resetLog();
  });

  describe('Triggers', () => {
    it('should respond to triggers');

    it('should activate in beginning of phrase');

    it('should not activate in middle of phrase');
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return youtube.message('Mocha', '#test2', '.yt End Credits').then(() => {
        assert.equal('#test', client.lastTarget);
        client.resetLog();
      });
    });

    it('should include [YouTube]');
  });

  describe('Video Search', () => {



  });

  describe('Video Lookup', () => {
    it('should respond in correct channel');

    it('should activate anywhere in phrase');

    it('should respond to shortened links');

    it('should include view count');

    it('should include [Youtube]');
  });
});
