import type { Spot } from "@/types";

interface KmzOptions {
  documentName?: string;
  fileName?: string;
}

const textEncoder = new TextEncoder();

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      if ((c & 1) !== 0) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function dateToDos(date: Date) {
  let year = date.getFullYear();
  if (year < 1980) {
    year = 1980;
  }
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function toKml(spots: Spot[], documentName: string) {
  const placemarks = spots
    .map((spot) => {
      const location = spot.location?.split(",").map((v) => parseFloat(v.trim()));
      const lat = location && location.length === 2 && !location.some((v) => Number.isNaN(v)) ? location[0] : null;
      const lng = location && location.length === 2 && !location.some((v) => Number.isNaN(v)) ? location[1] : null;
      const descriptionParts: string[] = [];
      if (spot.species?.length) {
        descriptionParts.push(`Species: ${spot.species.join(", ")}`);
      }
      if (spot.rating) {
        descriptionParts.push(`Rating: ${spot.rating}/5`);
      }
      if (spot.last) {
        descriptionParts.push(`Last visit: ${spot.last}`);
      }
      const notes = (spot.history || [])
        .map((entry) => {
          const pieces = [];
          if (entry.date) {
            pieces.push(entry.date);
          }
          if (entry.note) {
            pieces.push(entry.note);
          }
          return pieces.join(" — ");
        })
        .filter(Boolean);
      if (notes.length) {
        descriptionParts.push(`Notes: ${notes.join(" | ")}`);
      }
      const description = descriptionParts.join("\n");

      const escapedName = spot.name.replace(/[&<>]/g, (char) => {
        switch (char) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          default:
            return char;
        }
      });

      const descriptionCData = description ? `<![CDATA[${description}]]>` : "";

      let point = "";
      if (lat !== null && lng !== null) {
        point = `<Point><coordinates>${lng},${lat},0</coordinates></Point>`;
      }

      return `    <Placemark>\n      <name>${escapedName}</name>\n      <description>${descriptionCData}</description>\n${
        point ? `      ${point}\n` : ""
      }    </Placemark>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n  <Document>\n    <name>${
    documentName || "Spots"
  }</name>\n${placemarks}\n  </Document>\n</kml>`;
}

function createZipWithStoredFile(filename: string, fileBytes: Uint8Array) {
  const encoder = textEncoder;
  const nameBytes = encoder.encode(filename);
  const { dosTime, dosDate } = dateToDos(new Date());
  const fileCrc = crc32(fileBytes);

  const localHeader = new Uint8Array(30 + nameBytes.length);
  const localView = new DataView(localHeader.buffer);
  localView.setUint32(0, 0x04034b50, true);
  localView.setUint16(4, 20, true);
  localView.setUint16(6, 0, true);
  localView.setUint16(8, 0, true);
  localView.setUint16(10, dosTime, true);
  localView.setUint16(12, dosDate, true);
  localView.setUint32(14, fileCrc, true);
  localView.setUint32(18, fileBytes.length, true);
  localView.setUint32(22, fileBytes.length, true);
  localView.setUint16(26, nameBytes.length, true);
  localView.setUint16(28, 0, true);
  localHeader.set(nameBytes, 30);

  const centralHeader = new Uint8Array(46 + nameBytes.length);
  const centralView = new DataView(centralHeader.buffer);
  centralView.setUint32(0, 0x02014b50, true);
  centralView.setUint16(4, 20, true);
  centralView.setUint16(6, 20, true);
  centralView.setUint16(8, 0, true);
  centralView.setUint16(10, 0, true);
  centralView.setUint16(12, dosTime, true);
  centralView.setUint16(14, dosDate, true);
  centralView.setUint32(16, fileCrc, true);
  centralView.setUint32(20, fileBytes.length, true);
  centralView.setUint32(24, fileBytes.length, true);
  centralView.setUint16(28, nameBytes.length, true);
  centralView.setUint16(30, 0, true);
  centralView.setUint16(32, 0, true);
  centralView.setUint16(34, 0, true);
  centralView.setUint16(36, 0, true);
  centralView.setUint32(38, 0, true);
  centralView.setUint32(42, 0, true);
  centralHeader.set(nameBytes, 46);

  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, 1, true);
  endView.setUint16(10, 1, true);
  endView.setUint32(12, centralHeader.length, true);
  endView.setUint32(16, localHeader.length + fileBytes.length, true);
  endView.setUint16(20, 0, true);

  const total = localHeader.length + fileBytes.length + centralHeader.length + endRecord.length;
  const zipBuffer = new Uint8Array(total);
  let offset = 0;
  zipBuffer.set(localHeader, offset);
  offset += localHeader.length;
  zipBuffer.set(fileBytes, offset);
  offset += fileBytes.length;
  zipBuffer.set(centralHeader, offset);
  offset += centralHeader.length;
  zipBuffer.set(endRecord, offset);

  return zipBuffer;
}

export async function createKmzFromSpots(spots: Spot[], options: KmzOptions = {}) {
  const documentName = options.documentName ?? "Spots";
  const fileName = options.fileName ?? "spots.kmz";

  const kmlContent = toKml(spots, documentName);
  const kmlBytes = textEncoder.encode(kmlContent);
  const zipBytes = createZipWithStoredFile("doc.kml", kmlBytes);
  const blob = new Blob([zipBytes], { type: "application/vnd.google-earth.kmz" });

  if (typeof File !== "undefined") {
    return new File([blob], fileName, { type: "application/vnd.google-earth.kmz" });
  }

  return blob;
}
