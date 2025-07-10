import * as baileys from "@whiskeysockets/baileys";
import makeWASocket from "@whiskeysockets/baileys";

console.log("Baileys exports:", Object.keys(baileys));
console.log("Default export type:", typeof baileys.default);
console.log("makeWASocket direct import type:", typeof makeWASocket);
console.log("makeWASocket from named import:", typeof baileys.makeWASocket);
