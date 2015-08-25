import assert from "assert";
import "./helpers.js";

describe('ARX-7', () => {
  describe('Identifies with NickServ', () => {
    it('should identify on connect');
  });

  describe('Responds to CTCP Version', () => {
    it('should respond with VERSION');
  });

  describe('Responds to Bans', () => {
    it('should attempt to rejoin');
  });

  describe('Messages Handling', () => {
    it('should respond to PM');

    it('should handle uppercase channel names');

    it('should send message to plugins');

    it('should channel-restrict plugins');
  });
});
