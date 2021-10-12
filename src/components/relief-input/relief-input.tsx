import React, { FC, useContext, useRef } from 'react';
import { AquariumContext } from '../aquarium/aquarium';
import './relief-input.scss';

export interface ReliefInputProps {
  initialRelief: number[];
}

export const ReliefInput: FC<ReliefInputProps> = ({ initialRelief }) => {
  const aquariumStore = useContext(AquariumContext);

  const reliefInputRef = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    const valueToSet = reliefInputRef.current?.value;
    if (valueToSet !== undefined) {
      aquariumStore.setRelief(valueToSet);
    }
  }
  return (
    <div className="relief-input-wrapper">
    <input
      className="relief-input"
      type="text"
      ref={reliefInputRef}
      onChange={handleChange}
      defaultValue={`[${initialRelief.toString()}]`}
    />
    </div>
  );
}