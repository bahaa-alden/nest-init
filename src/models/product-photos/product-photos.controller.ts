/**
 * The `zlib` module provides compression functionality implemented using Gzip,
 * Deflate/Inflate, and Brotli.
 *
 * To access it:
 *
 * ```js
 * const zlib = require('zlib');
 * ```
 *
 * Compression and decompression are built around the Node.js `Streams API`.
 *
 * Compressing or decompressing a stream (such as a file) can be accomplished by
 * piping the source stream through a `zlib` `Transform` stream into a destination
 * stream:
 *
 * ```js
 * const { createGzip } = require('zlib');
 * const { pipeline } = require('stream');
 * const {
 *   createReadStream,
 *   createWriteStream
 * } = require('fs');
 *
 * const gzip = createGzip();
 * const source = createReadStream('input.txt');
 * const destination = createWriteStream('input.txt.gz');
 *
 * pipeline(source, gzip, destination, (err) => {
 *   if (err) {
 *     console.error('An error occurred:', err);
 *     process.exitCode = 1;
 *   }
 * });
 *
 * // Or, Promisified
 *
 * const { promisify } = require('util');
 * const pipe = promisify(pipeline);
 *
 * async function do_gzip(input, output) {
 *   const gzip = createGzip();
 *   const source = createReadStream(input);
 *   const destination = createWriteStream(output);
 *   await pipe(source, gzip, destination);
 * }
 *
 * do_gzip('input.txt', 'input.txt.gz')
 *   .catch((err) => {
 *     console.error('An error occurred:', err);
 *     process.exitCode = 1;
 *   });
 * ```
 *
 * It is also possible to compress or decompress data in a single step:
 *
 * ```js
 * const { deflate, unzip } = require('zlib');
 *
 * const input = '.................................';
 * deflate(input, (err, buffer) => {
 *   if (err) {
 *     console.error('An error occurred:', err);
 *     process.exitCode = 1;
 *   }
 *   console.log(buffer.toString('base64'));
 * });
 *
 * const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
 * unzip(buffer, (err, buffer) => {
 *   if (err) {
 *     console.error('An error occurred:', err);
 *     process.exitCode = 1;
 *   }
 *   console.log(buffer.toString());
 * });
 *
 * // Or, Promisified
 *
 * const { promisify } = require('util');
 * const do_unzip = promisify(unzip);
 *
 * do_unzip(buffer)
 *   .then((buf) => console.log(buf.toString()))
 *   .catch((err) => {
 *     console.error('An error occurred:', err);
 *     process.exitCode = 1;
 *   });
 * ```
