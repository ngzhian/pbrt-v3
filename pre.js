const outputFile = 'output.pfm';

Module['arguments'] = ['--outfile', outputFile, 'scenes/killeroo-simple.pbrt'];

function drawPFMToCanvas(width, height) {
  Module.canvas.width = width;
  Module.canvas.height = height;
  var ctx = Module.canvas.getContext('2d');
  var imageData = ctx.createImageData(width, height);

  var contents = FS.readFile(outputFile);
  // netpbm format (https://en.wikipedia.org/wiki/Netpbm#32-bit_extensions)
  // PF\n
  // width height\n
  // endian\n
  // 32-bit floats...
  // Skip 3 new lines.
  const nl = 10;  // Uint8 representing new line (ASCII).
  const lastNewLine = contents.indexOf(nl, contents.indexOf(nl, contents.indexOf(nl, 0) + 1) + 1);
  const data = contents.slice(lastNewLine+1);

  // Each pixel is made up of 3 (RGB) 32-bit floats.
  if (data.byteLength != width * height * 3 * 4) {
    throw 'Mismatch in size';
  }

  // Uses platform endianness, to be more robust, we should check the endianness encoded in the pfm file.
  const floats = new Float32Array(data.buffer);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // r g b
      imageData.data[(height-y-1) * width * 4 + (x * 4 + 0)] = floats[y * width * 3 + (x * 3 + 0)] * 255;
      imageData.data[(height-y-1) * width * 4 + (x * 4 + 1)] = floats[y * width * 3 + (x * 3 + 1)] * 255;
      imageData.data[(height-y-1) * width * 4 + (x * 4 + 2)] = floats[y * width * 3 + (x * 3 + 2)] * 255;
      imageData.data[(height-y-1) * width * 4 + (x * 4 + 3)] = 255;  // Full alpha.
    }
  }
  ctx.putImageData(imageData, 0, 0);
}
