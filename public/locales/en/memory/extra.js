// Distinct local reference drawings for additional challenges.
const artwork=[
 ['an umbrella','<path d="M130 210 Q300 5 470 210 Q430 180 385 210 Q342 180 300 210 Q255 180 215 210 Q170 180 130 210Z"/><path d="M300 210v110q0 50 45 50t45-42"/>'],
 ['a rocket','<path d="M300 65 Q385 120 370 275 L300 330 230 275 Q215 120 300 65Z"/><circle cx="300" cy="180" r="30"/><path d="M235 250l-60 70 65-10m125-60 60 70-65-10m-85 40 25 45 25-45"/>'],
 ['a key','<circle cx="235" cy="210" r="75"/><circle cx="235" cy="210" r="25"/><path d="M290 265l115 115m-45-45 30-30m-5 55 30-30"/>'],
 ['a guitar','<path d="M265 235q-40-65-95-15-45 42 0 90 30 32 75 15 20 45 65 35 58-12 45-72-10-38-45-48l145-150-22-22-150 145q-8 10-18 22Z"/><circle cx="245" cy="280" r="27"/><path d="M260 264 450 75"/>'],
 ['a camera','<rect x="130" y="155" width="340" height="210" rx="22"/><path d="M180 155l25-50h80l25 50m95 35h20"/><circle cx="300" cy="260" r="70"/><circle cx="300" cy="260" r="42"/>'],
 ['a fish','<path d="M125 225q120-145 265 0-145 145-265 0Zm265 0 85-75v150Z"/><circle cx="205" cy="205" r="7"/><path d="M260 155q35 70 0 140m40-125q30 55 0 110"/>'],
 ['a house','<path d="M105 215 300 65l195 150M155 180v190h290V180M250 370V260h100v110"/><rect x="185" y="220" width="45" height="45"/><rect x="370" y="220" width="45" height="45"/>'],
 ['a book','<path d="M300 135q-85-55-165-20v210q80-35 165 20 85-55 165-20V115q-80-35-165 20Zm0 0v210M160 150q60-20 110 5m-110 28q60-20 110 5m60-33q50-25 110-5m-110 38q50-25 110-5"/>'],
 ['a clock','<circle cx="300" cy="215" r="145"/><circle cx="300" cy="215" r="6"/><path d="M300 105v110l70 42M300 82v18m0 230v18M167 215h18m230 0h18"/>'],
 ['an airplane','<path d="M105 235 270 208 385 80l45 5-65 120 95 4 38-35 25 5-20 57-27 50-25 3-20-36-95 5 55 100-45 5-105-100-136-5q-35-6 0-23Z"/>']
];
export const extraTargets=artwork.map(([name,art])=>({name,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 430" role="img" aria-label="${name}"><rect width="600" height="430" fill="#e7eddf"/><g fill="none" stroke="#2b302b" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">${art}</g></svg>`}));
