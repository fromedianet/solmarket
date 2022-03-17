import { CountdownState } from "@oyster/common";
import moment from "moment";
import { useEffect, useState } from "react";

const ended = { days: 0, hours: 0, minutes: 0, seconds: 0 };
// date: utc date string
export const useCountdown = (date: string, showCountdown: boolean) => {
  const [state, setState] = useState<CountdownState>(ended);
  const [isEnded, setEnded] = useState(false);

  useEffect(() => {
    if (!showCountdown) {
      return;
    }
    const isEnded = checkIsEnded(date);
    if (isEnded) {
      setEnded(true);
    } else {
      const calc = () => {
        const newState = timeToEnd(date);
  
        setState(newState);
      };
  
      const interval = setInterval(() => {
        calc();
      }, 1000);
  
      calc();
      return () => clearInterval(interval);
    }
    
  }, [date]);

  return {isEnded, state};
}

/**
 * 
 * @param string date - utc date string
 * @returns 
 */
function timeToEnd(date: string): CountdownState {
  const now = moment().unix();
  const endAt = moment.utc(date).unix();

  let delta = endAt - now;

  if (delta <= 0) return ended;

  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  const seconds = Math.floor(delta % 60);

  return { days, hours, minutes, seconds };
}

function checkIsEnded(date: string): boolean {
  const now = moment().unix();
  const endAt = moment.utc(date).unix();
  console.log(date, moment.utc(date));

  if (endAt - now > 0) {
    return false;
  } else {
    return true;
  }
}