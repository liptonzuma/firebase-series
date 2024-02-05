export function sortItemsByCompletion(arr: any[]) {
  return arr.sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) {
      return 1; // a should come after b
    } else if (!a.isCompleted && b.isCompleted) {
      return -1; // a should come before b
    } else {
      return 0; // leave them unchanged
    }
  });
}
