import assert from "assert";
import {Client} from "../helpers.js";
import {Imgur} from "../../src/commands/imgur";

let client = new Client();
let imgur = new Imgur(client);

let link = '';

describe('Imgur', () => {
  describe('Triggers', () => {
    it('should activate anywhere in phrase', () => {
      return imgur.message('Mocha', '#test', `ARX-7 ${link}!`).then(() => {
        assert(client.lastMessage);
      });
    });
  });

  describe('General Usage', () => {
    it('should respond in correct channel', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert.equal('#test', client.lastTarget);
      });
    });

    it('should include [Imgur]', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        assert(client.lastMessage.startsWith('[Imgur] '));
      });
    });
  });

  describe('Picture Lookup', () => {
    // TODO: Test title, no title
    it('should display correct title', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        // .contains(title);
        //assert(client.lastMessage.);
      });
    });

    it('should include view count', () => {
      return imgur.message('Mocha', '#test', link).then(() => {
        // regex on viewcount digits
        // assert();
      });
    });
  });
});
