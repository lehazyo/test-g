import React, { FC, useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import { AquariumContext } from '../aquarium/aquarium';
import './relief-input.scss';

export interface ReliefInputProps {
  initialRelief: number[];
}

export const ReliefInput: FC<ReliefInputProps> = observer(({ initialRelief }) => {
  const aquariumStore = useContext(AquariumContext);

  const reliefInputRef = useRef<HTMLInputElement>(null);
  const handleChange = () => {
    const valueToSet = reliefInputRef.current?.value;
    if (valueToSet !== undefined) {
      aquariumStore.setRelief(valueToSet);
    }
  }

  const rightBlock = (aquariumStore.getConfigurationIsValid())
    ? (
      <span className="relief-input-water-label relief-right-most-label">
        has water volume {aquariumStore.getWaterCount()}
      </span>
    )
    : (
      <span className="relief-input-wrong-config relief-right-most-label">
        is invalid
      </span>
    );

  return (
    <div className="relief-input-panel">
      <div className="relief-input-wrapper">
        <span className="relief-input-config-label">
          Configuration
        </span>
        <input
          className="relief-input"
          type="text"
          ref={reliefInputRef}
          onChange={handleChange}
          defaultValue={`[${initialRelief.toString()}]`}
        />
        {rightBlock}
      </div>
    </div>
  );
});