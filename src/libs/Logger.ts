import pino, { type DestinationStream } from 'pino';
import pretty from 'pino-pretty';

let stream: DestinationStream;


stream = pretty({
  colorize: true,
});


export const logger = pino({ base: undefined }, stream);
