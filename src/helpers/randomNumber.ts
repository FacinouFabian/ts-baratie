/**
 * @name randomNb
 * @description return a random number in a range
 * @param min the start of range
 * @param max the end of range
 * @return {number}
 */
export default function randomNb(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
