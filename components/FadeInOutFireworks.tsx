import React, { useState, useEffect } from 'react';
import { FireworksContainer } from './FireworksContainer';

interface Props {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export const FADE_IN_TIME = 2000;
export const FADE_OUT_TIME = 2000;
export const WAIT_TIME = 6000;

export default function FadeInOutFireworks({ isVisible, setIsVisible }: Props) {

  return (
    <div style={{
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 2s ease-in-out'
    }}>
      <FireworksContainer />
    </div>
  );
}

