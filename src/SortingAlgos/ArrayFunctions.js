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
  // construct arr values arr
  let arrValues = [];
  for (let i = 0; i < arrContainer.length; i++) {
    arrValues.push(arrContainer[i].value);
  }

  // construct index map for MergeSort
  let ind_map = {};
  for (let j = 0; j < arrValues.length; j++) {
    ind_map[arrValues[j]] = j;
  }

  if (sortingAlgo === "bubble") {
    return BubbleSort(arrValues);
  } else if (sortingAlgo === "heap") {
    return new HeapSort(arrValues).animation_queue;
  } else if (sortingAlgo === "merge") {
    // console.log(new MergeSortObj(arrValues, ind_map).animation_queue);
    return new MergeSortObj(arrValues, ind_map).animation_queue;
  } else if (sortingAlgo === "quick") {
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

class MergeSortObj {
  constructor(arr, ind_map) {
    this.arr = arr;
    this.ind_map = ind_map;
    this.animation_queue = this.MergeSortSequence;
  }

  get MergeSortSequence() {
    let res = [new Animation("setUnsorted", 0, 0)];

    // map of every value and its index - reference by value
    let index_map = this.ind_map;

    function Merge(arr, left, mid, right) {
      // create two temporary arrays
      let left_arr = new Array(mid - left + 1);
      let right_arr = new Array(right - mid);

      // fill both temporary arrays
      for (let i = 0; i < left_arr.length; i++) {
        left_arr[i] = arr[left + i];
      }
      for (let j = 0; j < right_arr.length; j++) {
        right_arr[j] = arr[mid + 1 + j];
      }

      // merge left and right arrays back into arr
      let left_ind = 0; //initial index of left_arr
      let right_ind = 0; //initial index of right_arr
      let final_ind = left; //initial index of arr

      /* Possible Implementation of Animations:
      - modify the array generation entirely unique numbers
      - create a dictionary of numbers and their indices in the form:
        - { number : index, number2 : index2, ...  }
      - when combining arrays reference index in dictionary 
        for comparison index -> since we are coming to an auxillary
        array I can reference that value's location in the map
      - need to consider moving indexes around in this data structure
      */

      // select the smaller of the values from the left, right arrs
      while (left_ind < left_arr.length && right_ind < right_arr.length) {
        // compare left_arr[left_ind] and right_arr[right_ind]
        let left_val_ind = index_map[left_arr[left_ind]];
        let right_val_ind = index_map[right_arr[right_ind]];
        let swap_val_ind = index_map[arr[final_ind]];

        res.push(new Animation("compare", left_val_ind, right_val_ind));

        if (left_arr[left_ind] <= right_arr[right_ind]) {
          // Swap animation
          res.push(new Animation("setUnsorted", right_val_ind, right_val_ind));
          res.push(new Animation("compareSwap", left_val_ind, swap_val_ind));
          res.push(new Animation("swap", left_val_ind, swap_val_ind));
          res.push(new Animation("setUnsorted", left_val_ind, swap_val_ind));

          // left value = final_ind
          let tmp = index_map[arr[final_ind]];
          index_map[arr[final_ind]] = index_map[left_arr[left_ind]];
          index_map[left_arr[left_ind]] = tmp;

          // Code - I'm not sure how equivalent the swap and the logic are
          arr[final_ind] = left_arr[left_ind];
          left_ind++;
        } else {
          res.push(new Animation("setUnsorted", left_val_ind, left_val_ind));
          res.push(new Animation("compareSwap", right_val_ind, swap_val_ind));
          res.push(new Animation("swap", right_val_ind, swap_val_ind));
          res.push(new Animation("setUnsorted", right_val_ind, swap_val_ind));

          let tmp = index_map[arr[final_ind]];
          index_map[arr[final_ind]] = index_map[right_arr[right_ind]];
          index_map[right_arr[right_ind]] = tmp;

          arr[final_ind] = right_arr[right_ind];
          right_ind++;
        }
        final_ind++;
      }

      // add any remaining values from the left arr
      while (left_ind < left_arr.length) {
        let left_val_ind = index_map[left_arr[left_ind]];
        let swap_val_ind = index_map[arr[final_ind]];
        res.push(new Animation("compareSwap", left_val_ind, swap_val_ind));
        res.push(new Animation("swap", left_val_ind, swap_val_ind));
        res.push(new Animation("setUnsorted", left_val_ind, swap_val_ind));

        let tmp = index_map[arr[final_ind]];
        index_map[arr[final_ind]] = index_map[left_arr[left_ind]];
        index_map[left_arr[left_ind]] = tmp;

        arr[final_ind] = left_arr[left_ind];
        left_ind++;
        final_ind++;
      }

      // add any remaining values from the right arr
      while (right_ind < right_arr.length) {
        let right_val_ind = index_map[right_arr[right_ind]];
        let swap_val_ind = index_map[arr[final_ind]];
        res.push(new Animation("compareSwap", right_val_ind, swap_val_ind));
        res.push(new Animation("swap", right_val_ind, swap_val_ind));
        res.push(new Animation("setUnsorted", right_val_ind, swap_val_ind));

        let tmp = index_map[arr[final_ind]];
        index_map[arr[final_ind]] = index_map[right_arr[right_ind]];
        index_map[right_arr[right_ind]] = tmp;

        arr[final_ind] = right_arr[right_ind];
        right_ind++;
        final_ind++;
      }
    }

    function MergeSort(arr, left, right) {
      if (left >= right) {
        return;
      }
      let mid = left + Math.floor((right - left) / 2);
      MergeSort(arr, left, mid);
      MergeSort(arr, mid + 1, right);
      Merge(arr, left, mid, right);
    }

    let arr = this.arr;
    // this.arr = MergeSort(tmp_arr, 0, this.arr.length - 1);
    // console.log("MergeSort Return: ", MergeSort(arr, 0, arr.length - 1));
    MergeSort(arr, 0, arr.length - 1);
    return res;
  }
}
