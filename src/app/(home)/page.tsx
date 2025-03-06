'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

// Register the MotionPathPlugin
gsap.registerPlugin(MotionPathPlugin)

const TrailEffect: React.FC = () => {
  const numCircles = 15 // Number of trail elements
  const circlesRef = useRef<HTMLDivElement[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const onMouseClick = (e: MouseEvent) => {
      // if (isAnimating) return // Prevent clicks during animation

      // setIsAnimating(true)
      circlesRef.current.forEach((circle, index) => {
        if (circle) {
          // Reset the circle's position to the click position
          gsap.set(circle, {
            x: e.clientX,
            y: e.clientY,
            opacity: 1,
            scale: 1
          })

          // Animate to the origin (0,0) with Bezier curve
          gsap.to(circle, {
            x: 0,
            y: 0,
            scale: 0.1,
            duration: 1.5,
            overwrite: true,
            opacity: 0.2,
            delay: index * 0.007,
            ease: 'power2.inOut',
            motionPath: {
              path: [
                { x: e.clientX, y: e.clientY }, // Start point (B)
                { x: e.clientX * 0.75, y: e.clientY * 1.3 }, // First control point
                // { x: e.clientX * 0.25, y: e.clientY * 0.5 }, // Second control point
                { x: 0, y: 0 } // End point (A)
              ],
              type: 'bezier',
              curviness: 1.3
            },
            onComplete: () => {
              if (index === numCircles - 1) {
                setIsAnimating(false)
              }
            }
          })
        }
      })
    }

    window.addEventListener('click', onMouseClick)
    return () => window.removeEventListener('click', onMouseClick)
  }, [isAnimating])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {Array.from({ length: numCircles }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) circlesRef.current[index] = el
          }}
          className="pointer-events-none absolute flex h-12 w-12 flex-row items-center justify-center rounded-full bg-yellow-600"
          style={{
            opacity: 0,
            transform: 'translate(-50%, -50%)' // Center the circle on the click position
          }}>
          +1
        </div>
      ))}
    </div>
  )
}

export default TrailEffect
