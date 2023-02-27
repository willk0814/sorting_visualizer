import React, { useState, useEffect } from 'react'
import './Body.css'
import ArrayBar from './ArrayBar'

import { ArrayElement, Animation, SortDriver } from '../SortingAlgos/ArrayFunctions'

function Body() {
  
  // State Vars - core logic
  const [sortingAlgo, setSortingAlgo] = useState('bubble')
  
  // How can we combine the state variables into one array of objects
  const [arrContainer, setArrContainer] = useState([])
  const [animationSequence, setAnimationSequence] = useState([])
  const [currentAnimation, setCurrentAnimation] = useState(-1)

  // Array Generation Constants
  const MAX = 3
  const MIN = 500

  // Array Generation Functions
  const generateRandomArr = () => {

    let tmp_ArrContainer = []
    for (let i = 0; i < 100; i ++){
      tmp_ArrContainer.push(new ArrayElement(i, generateRandomNum(), 'unsorted', i.toString()))
    }
    setArrContainer(tmp_ArrContainer)
  }

  const generateRandomNum = () => {
    return Math.floor(Math.random() * (MAX - MIN) + MIN)
  }

  // Setting the sorting Algo
  const handleSelectAlgo = (e) => {
    // console.log(e.target.value)
    setSortingAlgo(e.target.value)
  }

  // this function will return an array of array containers which will be used to display each step of the animation sequence
  const handleSort = () => {
    let sequence = SortDriver({ sortingAlgo, arrContainer })
    // console.log(sequence)
    setAnimationSequence(sequence)
  }

  const handleAnimation = (animation) => {
    let tmpContainer = arrContainer
    // apply the correct operation to the currentStep
    if (animation.type === 'compare'){
      tmpContainer[animation.index2].status = 'comparing'
      tmpContainer[animation.index1].status = 'comparing'

    }else if(animation.type === 'compareSwap'){
      tmpContainer[animation.index1].status = 'swapping'
      tmpContainer[animation.index2].status = 'swapping'
      
    }else if(animation.type === 'swap'){
      let first_index = tmpContainer[animation.index1]
      tmpContainer[animation.index1] = tmpContainer[animation.index2]
      tmpContainer[animation.index2] = first_index
      
    }else if(animation.type === 'setSorted'){
      tmpContainer[animation.index1].status = 'sorted'
      tmpContainer[animation.index2].status = 'sorted'

    }else if(animation.type === 'setUnsorted'){
      tmpContainer[animation.index1].status = 'unsorted'
      tmpContainer[animation.index2].status = 'unsorted'
    }
    setArrContainer(tmpContainer)
  }

  useEffect(() => {
    console.log('UPDATED BARS')
    for (let i = 0; i < arrContainer.length; i++){
      console.log(arrContainer[i])
    }
  }, [arrContainer])
  
  // Hook to generate an array on mount
  useEffect(() => {
    generateRandomArr()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (animationSequence.length >= 1){
        let tmpQueue = animationSequence
        let animation = tmpQueue.shift()
        handleAnimation(animation)
        setCurrentAnimation(animation)
        setAnimationSequence(tmpQueue)
      }
    }, 10);
    return () => clearInterval(interval)
  }, [animationSequence])

  return (
    <div className='bodyContainer'>
      <div className='buttonContainer'>
            {/* Generate Array Button */}
            <button className='button' onClick={generateRandomArr}>Generate</button>

            {/* Sorting Algo Select Dropdown */}
            <label htmlFor='dropdown' className='dropdown_label'>Select Sorting Algo:</label>
            <select name='sortingAlgoSelect' className='dropdown' id='dropdown' 
              onChange={handleSelectAlgo}>
              <option value='bubble'>Bubble Sort</option>
              <option value='heap'>Heap Sort</option>
              <option value='merge'>Merge Sort</option>
              <option value='quick'>Quick Sort</option>
            </select>

            {/* Sort button */}
            <button className='button' onClick={handleSort}>Sort!</button>
      </div>

      {/* Array animation */}
      <div className='arrayBoxContainer'>
        {arrContainer.map((bar) => ( 
          <ArrayBar
            value = {bar.value}
            status = {bar.status} 
            key = {bar.key}/> ))
        }
      </div>
    </div>
  )
}

export default Body


// ToDo:
// - Create a sorting algo state var
// - Create a drop down menu with different sorting algorithms
// - Create an animation object
// - Write func to handle playback of a set of animations 
// - Write bubble sort algorithm to return a list of animations to Body.js

