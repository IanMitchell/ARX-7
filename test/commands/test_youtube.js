import assert from "assert";
import should_promised from "should-promised";
import {Client} from "../helpers.js";
import {Youtube} from "../../src/commands/youtube";

let client = new Client();
let youtube = new Youtube(client);

describe('Youtube', () => {
  describe('Video Search', () => {
    it('should respond in correct channel', (done) => {
      client.setCallback(() => {
        console.log(client.lastTarget);
        assert.equal('#test', client.lastTarget);
        if (client.lastTarget === '#test') {
          done();
        } else {
          throw new error();
        }
          client.resetLog();

      });
      return youtube.message('Mocha', '#test2', '.yt End Credits', null);
    });

    it('should respond to triggers');

    it('should activate in beginning of phrase');

    it('should not activate in middle of phrase');

    it('should include [YouTube]');
  });

  describe('Video Lookup', () => {
    it('should respond in correct channel');

    it('should activate anywhere in phrase');

    it('should respond to shortened links');

    it('should include view count');

    it('should include [Youtube]');
  });
});
