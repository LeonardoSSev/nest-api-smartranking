export class ArrayHelper {
  static areAllValuesTheEquals(arr: any[]): boolean {
    if (arr.length === 0) {
      return true;
    }

    const firstValue = arr[0];

    return arr.every(value => value === firstValue);
  }
}