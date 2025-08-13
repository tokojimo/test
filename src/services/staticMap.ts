export async function getStaticMapUrl(
  lat: number,
  lng: number,
  width = 400,
  height = 160,
  zoom = 13
): Promise<string> {
  const xT = ((lng + 180) / 360) * Math.pow(2, zoom);
  const yT =
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) +
          1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
    Math.pow(2, zoom);
  const xOffset = (xT - Math.floor(xT)) * 256;
  const yOffset = (yT - Math.floor(yT)) * 256;

  const leftTiles = Math.max(0, Math.ceil((width / 2 - xOffset) / 256));
  const rightTiles = Math.max(
    0,
    Math.ceil((width / 2 - (256 - xOffset)) / 256)
  );
  const topTiles = Math.max(0, Math.ceil((height / 2 - yOffset) / 256));
  const bottomTiles = Math.max(
    0,
    Math.ceil((height / 2 - (256 - yOffset)) / 256)
  );

  const startX = Math.floor(xT) - leftTiles;
  const startY = Math.floor(yT) - topTiles;
  const endX = Math.floor(xT) + rightTiles;
  const endY = Math.floor(yT) + bottomTiles;

  const tilesX = endX - startX + 1;
  const tilesY = endY - startY + 1;

  const canvas = await createCanvas(tilesX * 256, tilesY * 256);
  const ctx = canvas.getContext('2d');

  for (let ty = startY; ty <= endY; ty++) {
    for (let tx = startX; tx <= endX; tx++) {
      const sub = ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)];
      const url = `https://${sub}.basemaps.cartocdn.com/light_all/${zoom}/${tx}/${ty}.png`;
      const img = await loadTile(url);
      ctx.drawImage(img, (tx - startX) * 256, (ty - startY) * 256);
    }
  }

  const centerX = (xT - startX) * 256;
  const centerY = (yT - startY) * 256;
  const cropX = Math.round(centerX - width / 2);
  const cropY = Math.round(centerY - height / 2);

  const outCanvas = await createCanvas(width, height);
  const outCtx = outCanvas.getContext('2d');
  outCtx.putImageData(ctx.getImageData(cropX, cropY, width, height), 0, 0);

  return canvasToDataURL(outCanvas);
}

async function loadTile(url: string): Promise<any> {
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  if (
    typeof window !== 'undefined' &&
    typeof Image !== 'undefined' &&
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function'
  ) {
    return loadImageBrowser(arr);
  } else {
    const { loadImage } = await import('@napi-rs/canvas');
    return loadImage(Buffer.from(arr));
  }
}

async function createCanvas(width: number, height: number): Promise<any> {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas') as any;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext?.('2d');
    if (ctx) return canvas;
  }
  const { createCanvas } = await import('@napi-rs/canvas');
  return createCanvas(width, height);
}

function canvasToDataURL(canvas: any): string {
  if (typeof canvas.toDataURL === 'function') {
    return canvas.toDataURL();
  }
  if (typeof canvas.toBuffer === 'function') {
    const buf = canvas.toBuffer('image/png');
    return `data:image/png;base64,${buf.toString('base64')}`;
  }
  throw new Error('Unsupported canvas object');
}

function loadImageBrowser(arr: ArrayBuffer): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([arr], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
