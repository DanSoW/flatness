/**
 * Перемещение элемента по индексу в рамках массива
 * @param arr Старый массив
 * @param oldIndex Старый индекс элемента
 * @param newIndex Новый индекс элемента
 * @returns 
 */
export function arrayMove(arr: any[], oldIndex: number, newIndex: number) {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }

  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

  return arr;
}
