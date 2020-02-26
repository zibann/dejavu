
import React, { useRef } from 'react'
import { Button, Checkbox, Dropdown } from 'antd';
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../../constants/index';

const DraggableCheckbox = (props) => {

  let { index, moveCard } = props

  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: ItemTypes.MAPPING,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

   const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.MAPPING, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  
  const { option } = props

  drag(drop(ref))
  return (
    <div ref={ref} >
      <Checkbox
        key={option.value.toString()}
        value={option.value}
        checked={props.checked}
        onChange={(e) => {props.toggleCheckbox(e, option)}}
        style={option.style}
      >
        {option.label}
      </Checkbox>
    </div>

  )
}

export default DraggableCheckbox