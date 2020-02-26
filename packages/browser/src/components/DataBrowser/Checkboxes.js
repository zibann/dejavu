import React, {useCallback, useEffect, useState} from 'react'
import { useDrop } from 'react-dnd'
import { Button, Checkbox, Dropdown } from 'antd';

import { ItemTypes } from '../../constants/index';
import update from 'immutability-helper'

import DraggableCheckbox from './DraggableCheckbox';



const Checkboxes = (props) => {

  let { options } = props
  const [cards, setCards] = useState(options)
  
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex]
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      )
    },
    [options],
  )

  useEffect(() => {
    props.onChangeOrder(cards)
  }, cards)


  let nodes = options.map((option, index) => {
    return (
      <DraggableCheckbox
        key={option.value.toString()}
        option={option}
        checked={props.selectedColumns.indexOf(option.value) !== -1}
        toggleCheckbox={props.toggleCheckbox}
        moveCard={moveCard}
        index={index}
      />
    )
  })
  
  return (
    <div
    >
      {nodes}
    </div>
  )
  
}

export default Checkboxes