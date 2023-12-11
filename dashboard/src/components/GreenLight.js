import React from 'react'

export default function GreenLight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
  <g filter="url(#filter0_d_23_43)">
    <circle cx="17" cy="17" r="5" fill="#11D100"/>
  </g>
  <defs>
    <filter id="filter0_d_23_43" x="0" y="0" width="34" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_23_43"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.08 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_23_43"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_23_43" result="shape"/>
    </filter>
  </defs>
</svg>
  )
}
