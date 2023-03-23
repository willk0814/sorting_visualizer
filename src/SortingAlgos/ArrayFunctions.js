// Class to create array elements and store all relevant information
export class ArrayElement {
  constructor(index, value, status, key) {
    this.index = index;
    this.value = value;
    // {unsorted, sorted, comparing, swapping}
    this.status = status;
    this.key = index.toString();
  }
}

export class Animation {
  constructor(type, index1, index2) {
    // possible types {compare, compareSwap, swap, setSorted}
    this.type = type;
    this.index1 = index1;
    this.index2 = index2;
  }
}

// create an array of values from the arrContainer
export function SortDriver({ sortingAlgo, arrContainer }) {
  let arrValues = [];
  for (let i = 0; i < arrContainer.length; i++) {
    arrValues.push(arrContainer[i].value);
  }

  if (sortingAlgo === "bubble") {
    return BubbleSort(arrValues);
  } else if (sortingAlgo === "heap") {
    return new HeapSort(arrValues).animation_queue;
  } else if (sortingAlgo === "merge") {
    alert("Unfortunately Merge Sort is still in developement");
    // return(MergeSort(arrContainer))
  } else if (sortingAlgo === "quick") {
    alert(
      "Unfortunately Quick Sort is still in developement: some of the animations are a bit off"
    );
    return new QuickSort(arrValues).animation_queue;
    // return(QuickSort(arrContainer))
  }
}

// --- Sorting Algorithm Functions ---
// @Params:
// arr: an array of ArrayElement items
// @Return:
// animation_queue: a list of animations that represent the steps taken during the sorting algo
function BubbleSort(arr) {
  let animation_queue = [new Animation("setUnsorted", 0, 0)];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      // compare arr[j] & arr[j+1]
      animation_queue.push(new Animation("compare", j, j + 1));
      if (arr[j] > arr[j + 1]) {
        // swap animations
        animation_queue.push(new Animation("compareSwap", j, j + 1));
        animation_queue.push(new Animation("swap", j, j + 1));
        animation_queue.push(new Animation("setUnsorted", j, j + 1));

        // swap logic
        let largerVal = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = largerVal;
      } else {
        animation_queue.push(new Animation("setUnsorted", j, j + 1));
      }
    }
    animation_queue.push(
      new Animation("setSorted", arr.length - 1 - i, arr.length - 1 - i)
    );
  }
  animation_queue.push(new Animation("setSorted", 0, 0));
  return animation_queue;
}

class HeapSort {
  constructor(arr) {
    this.arr = arr;
    this.animation_queue = this.HeapSortSequence;
  }

  get HeapSortSequence() {
    let res = [new Animation("setUnsorted", 0, 0)];
    // for some reason heapify doesnt have access to this.arr so we are using a tmp variable
    let tmp_arr = this.arr;
    let len = this.arr.length;

    function Heapify(max_len, i) {
      let largest = i;
      let left = i * 2 + 1;
      let right = i * 2 + 2;

      // make a comparison anytime left is inbounds
      if (left < max_len) {
        res.push(new Animation("compare", left, largest));
        res.push(new Animation("setUnsorted", left, largest));
      }
      if (left < max_len && tmp_arr[left] > tmp_arr[largest]) {
        largest = left;
      }

      // make a comparison anytime right is inbounds
      if (right < max_len) {
        res.push(new Animation("compare", right, largest));
        res.push(new Animation("setUnsorted", right, largest));
      }
      if (right < max_len && tmp_arr[right] > tmp_arr[largest]) {
        largest = right;
      }
      if (largest !== i) {
        res.push(new Animation("compare", largest, i));
        res.push(new Animation("compareSwap", largest, i));
        res.push(new Animation("swap", largest, i));
        res.push(new Animation("setUnsorted", largest, i));

        let swapVal = tmp_arr[i];
        tmp_arr[i] = tmp_arr[largest];
        tmp_arr[largest] = swapVal;

        Heapify(max_len, largest);
      }
    }

    for (let i = Math.floor(len / 2); i >= 0; i--) {
      Heapify(len, i);
    }

    for (let i = len - 1; i > 0; i--) {
      res.push(new Animation("compareSwap", 0, i));
      res.push(new Animation("swap", 0, i));
      res.push(new Animation("setSorted", i, i));

      let swapVal = tmp_arr[0];
      tmp_arr[0] = tmp_arr[i];
      tmp_arr[i] = swapVal;

      Heapify(i, 0);
    }
    res.push(new Animation("setSorted", 0, 0));

    return res;
  }
}

class QuickSort {
  constructor(arr) {
    this.arr = arr;
    this.animation_queue = this.QuickSortSequence;
  }

  get QuickSortSequence() {
    let res = [new Animation("setUnsorted", 0, 0)];
    let tmp_arr = this.arr;

    function Partition(array, low, high) {
      let pivot = array[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        res.push(new Animation("compare", j, j));
        res.push(new Animation("compare", high, high));
        res.push(new Animation("setUnsorted", high, high));
        if (array[j] <= pivot) {
          i = i + 1;

          // Swap animations - only when unique indices
          if (i !== j) {
            res.push(new Animation("compareSwap", i, j));
            res.push(new Animation("swap", i, j));
            res.push(new Animation("setUnsorted", i, j));
          }

          // Swap Logic
          let swap = array[i];
          array[i] = array[j];
          array[j] = swap;
        }
        res.push(new Animation("setUnsorted", j, j));
      }

      // Swap animations - only when unique indices
      if (i + 1 !== high) {
        res.push(new Animation("compareSwap", i + 1, high));
        res.push(new Animation("swap", i + 1, high));
        res.push(new Animation("setUnsorted", i + 1, high));
      } else {
        res.push(new Animation("setSorted", high, high));
      }

      // Swap Logic
      let swap = array[i + 1];
      array[i + 1] = array[high];
      array[high] = swap;
      return i + 1;
    }

    function QuickSortLogic(array, low, high) {
      if (low < high) {
        let pivot = Partition(array, low, high);
        QuickSortLogic(array, low, pivot - 1);
        QuickSortLogic(array, pivot + 1, high);
      }
    }

    QuickSortLogic(tmp_arr, 0, tmp_arr.length - 1);
    // console.log('sorted arr: ', tmp_arr)
    return res;
  }
}

// class MergeSort {
//   construct(arr) {
//     this.arr = arr;
//     this.animation_queue = this.MergeSortSequence;
//   }
//   get MergeSortSequence() {
//     let res = [new Animation("setUnsorted", 0, 0)];
//     // tmp_arr = this.arr;

//     function Merge(arr, l, m, r) {}

//     function MergeSort(arr, l, r) {
//       if (l >= r) {
//         return;
//       }
//       let m = 1 + parseInt((r - 1) / 2);
//       MergeSort(arr, l, m);
//       MergeSort(arr, m + 1, r);
//       Merge(arr, l, m, r);
//     }

//     return res;
//   }
// }
