"use client"

import { useState } from "react"
import "./InfoTooltip.css"

const InfoTooltip = ({ text, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="info-tooltip-container">
      <span className="info-icon" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
        ⓘ
      </span>
      {isVisible && <div className={`info-tooltip-bubble info-tooltip-${position}`}>{text}</div>}
    </div>
  )
}

export default InfoTooltip
