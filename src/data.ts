import { Ingredient, Combination } from "./types";

export const ingredients: Ingredient[] = [
  { id: "1", name: "Niacinamide", function: "Mencerahkan & kontrol minyak", risk: "safe" },
  { id: "2", name: "Retinol", function: "Anti-aging", risk: "caution", note: "Hindari saat hamil, pakai malam hari" },
  { id: "3", name: "Alcohol Denat.", function: "Pelarut", risk: "avoid", note: "Bisa mengiritasi dan membuat kulit kering" },
  { id: "4", name: "Hyaluronic Acid", function: "Melembapkan kulit", risk: "safe" },
  { id: "5", name: "Salicylic Acid", function: "Mengatasi jerawat & komedo", risk: "caution", note: "Bisa membuat kulit kering, mulai dari konsentrasi rendah" },
  { id: "6", name: "Vitamin C", function: "Mencerahkan & antioksidan", risk: "caution", note: "Bisa perih di kulit sensitif" },
  { id: "7", name: "Ceramide", function: "Memperkuat skin barrier", risk: "safe" },
  { id: "8", name: "Glycolic Acid", function: "Eksfoliasi kulit mati", risk: "caution", note: "Wajib sunscreen di siang hari" },
  { id: "9", name: "Fragrance", function: "Pewangi", risk: "avoid", note: "Sering memicu iritasi dan alergi" },
  { id: "10", name: "Panthenol", function: "Menenangkan & melembapkan", risk: "safe" },
  { id: "11", name: "Centella Asiatica", function: "Menenangkan kulit kemerahan", risk: "safe" },
  { id: "12", name: "Zinc Oxide", function: "Tabir surya mineral", risk: "safe" },
];

export const combinations: Combination[] = [
  { id: "c1", a: "Retinol", b: "Niacinamide", result: "good", note: "Umumnya aman. Mulai pelan jika kulit sensitif." },
  { id: "c2", a: "Retinol", b: "Glycolic Acid", result: "avoid", note: "Sama-sama eksfoliasi, risiko iritasi tinggi." },
  { id: "c3", a: "Retinol", b: "Salicylic Acid", result: "caution", note: "Bisa membuat kulit kering dan iritasi." },
  { id: "c4", a: "Niacinamide", b: "Hyaluronic Acid", result: "good", note: "Cocok, saling melengkapi." },
  { id: "c5", a: "Vitamin C", b: "Niacinamide", result: "good", note: "Umumnya aman dipakai bersama." },
  { id: "c6", a: "Vitamin C", b: "Retinol", result: "caution", note: "Lebih aman dipisah: Vitamin C pagi, Retinol malam." },
  { id: "c7", a: "Glycolic Acid", b: "Salicylic Acid", result: "caution", note: "Eksfoliasi berlebihan, jangan sekaligus." },
];
