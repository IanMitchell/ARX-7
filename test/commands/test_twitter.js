import assert from "assert";
import {Client} from "../helpers.js";
import {Twitter} from "../../src/commands/twitter";

let client = new Client();
let twitter = new Twitter(client);

describe('Twitter', () => {
  describe('Tweet Lookup', () => {
    it('should respond in correct channel');

    it('should activate anywhere in phrase');

    it('should include [Twitter]');

    // TODO: Test multiple links (use Jukey Tweet)
    it('should expand links');
  });
});
