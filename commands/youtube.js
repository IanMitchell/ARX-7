import {Command} from './command.js';

export class Youtube extends Command {
  message(from, to, text, message) {
    if (text.toLowerCase().startsWith('.yt ')) {
      console.log('Youtube Message Received');
      // TODO: http://pastebin.com/nuaGJXf1
    }
  }
}
