import assert from "assert";
import {Client} from "../helpers.js";
import {Imgur} from "../../src/commands/imgur";

let client = new Client();
let imgur = new Imgur(client);

describe('Imgur', () => {
  describe('Picture Lookup', () => {
    it('should respond in correct channel');

    it('should activate anywhere in phrase');

    it('should include [Imgur]');

    // TODO: Test title, no title
    it('should display correct title');

    it('should include view count');
  });
});
