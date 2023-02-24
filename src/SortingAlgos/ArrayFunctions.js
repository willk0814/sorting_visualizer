// Class to create array elements and store all relevant information
export class ArrayElement {
    constructor(index, value, status, key) {
        this.index = index;
        this.value = value;
        // {unsorted, sorted, comparing, swapping}
        this.status = status;
        this.key = index.toString()
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


export function SortDriver({ sortingAlgo, arrContainer }){
    // create an array of values from the arrContainer
    let arrValues = []
    for (let i = 0; i < arrContainer.length; i++){
        arrValues.push(arrContainer[i].value)
    }
    if (sortingAlgo === 'bubble'){
        return(BubbleSort(arrValues))
    }else if (sortingAlgo === 'heap'){
        return(HeapSort(arrContainer))
    }else if(sortingAlgo === ' merge'){
        return(MergeSort(arrContainer))
    }else if(sortingAlgo === 'quick'){
        return(QuickSort(arrContainer))
    }
}


// --- Sorting Algorithm Functions ---
// @Params:
    // arr: an array of ArrayElement items
// @Return:
    // animation_queue: a list of animations that represent the steps taken during the sorting algo
function BubbleSort( arr ){
    let animation_queue = [new Animation('setUnsorted', 0, 0)]
    for (let i = 0; i < arr.length - 1; i++){
        for (let j = 0; j < arr.length - 1 - i; j++){
            // compare arr[j] & arr[j+1]
            animation_queue.push(new Animation('compare', j, j + 1))
            if (arr[j] > arr[j + 1]){
                // swap animations
                animation_queue.push(new Animation('compareSwap', j, j+1))
                animation_queue.push(new Animation('swap', j, j + 1))
                animation_queue.push(new Animation('setUnsorted', j, j + 1))

                // swap logic
                let largerVal = arr[j]
                arr[j] = arr[j + 1]
                arr[j +  1] = largerVal
            } else {
                animation_queue.push(new Animation('setUnsorted', j, j + 1))
            }
        }
        animation_queue.push(new Animation('setSorted', arr.length - 1 - i, arr.length - 1 - i))
    }
    animation_queue.push(new Animation('setSorted', 0, 0))
    return animation_queue
}

function HeapSort( arr ){ 
    let animation_queue = []

    return animation_queue
}

function QuickSort( arr ){ 
    let animation_queue = []

    return animation_queue
}

function MergeSort ( arr ){
    let animation_queue = []

    return animation_queue
}


