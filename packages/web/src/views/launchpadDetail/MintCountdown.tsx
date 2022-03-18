import React from 'react';
import Countdown from 'react-countdown';

interface MintCountdownProps {
  date: Date | undefined;
  status?: string;
  onComplete?: () => void;
}

interface MintCountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const MintCountdown: React.FC<MintCountdownProps> = ({
  date,
  status,
  onComplete,
}) => {
  const renderCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: MintCountdownRender) => {
    hours += days * 24;
    if (completed) {
      return status ? (
        <span className="launchpad-countdown">{status}</span>
      ) : null;
    } else {
      return (
        <div className="launchpad-countdown">
          <span>STARTS IN</span>
          <div className="countdown-item">
            <span>{hours < 10 ? `0${hours}` : hours}</span>
          </div>
          <div className="countdown-item">
            <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
          </div>
          <div className="countdown-item">
            <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
          </div>
        </div>
      );
    }
  };

  if (date) {
    return (
      <Countdown
        date={date}
        onComplete={onComplete}
        renderer={renderCountdown}
      />
    );
  } else {
    return null;
  }
};
