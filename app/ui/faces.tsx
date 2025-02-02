import Image from "next/image";
import GoodFaceFrameImage from '@/public/faces/goodface-frame.png'
import GoodFaceImage from '@/public/faces/goodface.png'

import UnhealthyFaceImage from '@/public/faces/unhealthyface.png'
import UnhealthyFaceFrameImage from '@/public/faces/unhealthyface-frame.png'

import DangerousFaceImage from '@/public/faces/dangerousface.png'
import DangerousFaceFrameImage from '@/public/faces/dangerousface-frame.png'

import ModerateFaceImage from '@/public/faces/moderateface.png'
import ModerateFaceFrameImage from '@/public/faces/moderateface-frame.png'

import GoodFaceDisabledFrame from '@/public/faces/disabled-faces/goodface-frame-disabled.png'
import UnhealthyFaceDisabledFrame from '@/public/faces/disabled-faces/unhealthyface-frame-disabled.png'
import DangerousFaceDisabledFrame from '@/public/faces/disabled-faces/dangerousface-frame-disabled.png'
import ModerateFaceDisabledFrame from '@/public/faces/disabled-faces/moderateface-frame-disabled.png'


export function GoodFace({ width, height } : { width: number, height: number}) {
  return (
    <Image src={GoodFaceImage} alt="good-face" width={width} height={height} className="object-fit"/>
  )
}

export function GoodFaceFrame({ width, height } : { width: number, height: number}) {
  return (
    <Image src={GoodFaceFrameImage} alt="good-face-frame" width={width} height={height} className="object-fit" />
  )
} 


export function UnhealthyFace({ width, height } : { width: number, height: number}) {
  return (
    <Image src={UnhealthyFaceImage} alt="unhealthy-face-frame" width={width} height={height} className="object-fit"/>
  )
}

export function UnhealthyFaceFrame({ width, height } : { width: number, height: number}) {
  return (
    <Image src={UnhealthyFaceFrameImage} alt="unhealthy-face" width={width} height={height} className="object-fit"/>
  )
} 

export function DangerousFace({ width, height } : { width: number, height: number}) {
  return (
    <Image src={DangerousFaceImage} alt="dangerous-face-frame" width={width} height={height} className="object-fit"/>
  )
}

export function DangerousFaceFrame({ width, height } : { width: number, height: number}) {
  return (
    <Image src={DangerousFaceFrameImage} alt="dangerous-face" width={width} height={height} className="object-fit"/>
  )
} 

export function ModerateFace({ width, height } : { width: number, height: number}) {
  return (
    <Image src={ModerateFaceImage} alt="moderate-face" width={width} height={height} className="object-fit"/>
  )
}

export function ModerateFaceFrame({ width, height } : { width: number, height: number}) {
  return (
    <Image src={ModerateFaceFrameImage} alt="moderate-face-frame" width={width} height={height} className="object-fit"/>
  )
} 

export function GoodFaceDisabled({ width, height } : { width: number, height: number}) {
  return (
    <Image src={GoodFaceDisabledFrame} alt="good-face-disabled" width={width} height={height} className="object-fit"/>
  )
}

export function ModerateFaceDisabled({ width, height } : { width: number, height: number}) {
  return (
    <Image src={ModerateFaceDisabledFrame} alt="moderate-face-disabled" width={width} height={height} className="object-fit"/>
  )
}

export function UnhealthyFaceDisabled({ width, height } : { width: number, height: number}) {
  return (
    <Image src={UnhealthyFaceDisabledFrame} alt="unhealthy-face-disabled" width={width} height={height} className="object-fit"/>
  )
 }

 export function DangerousFaceDisabled({ width, height } : { width: number, height: number}) {
  return (
    <Image src={DangerousFaceDisabledFrame} alt="dangerous-face-disabled" width={width} height={height} className="object-fit"/>
  )
 }








export const STATUS_FACE = {
  'GOOD': <GoodFaceFrame width={72} height={72} />,
  'MODERATE': <ModerateFaceFrame width={72} height={72} />,
  'UNHEALTHY': <UnhealthyFaceFrame width={72} height={72} />,
  'DANGEROUS': <DangerousFaceFrame width={72} height={72} />,
  'CRITICAL': <DangerousFaceFrame width={72} height={72} />
} 

export const STATUS_FACE_DISABLED = {
  'GOOD': <GoodFaceDisabled width={72} height={72} />,
  'MODERATE': <ModerateFaceDisabled width={72} height={72} />,
  'UNHEALTHY': <UnhealthyFaceDisabled width={72} height={72} />,
  'DANGEROUS': <DangerousFaceDisabled width={72} height={72} />,
  'CRITICAL': <DangerousFaceDisabled width={72} height={72} />
} 



