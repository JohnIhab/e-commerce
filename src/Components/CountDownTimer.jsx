import React, { useEffect, useState } from 'react'


 function CountdownTimer({ targetDate}) {
   const [timeLeft, setTimeLeft] = useState({});
   
 
   const calculateTimeLeft = () => {
     const now = new Date().getTime();
     const distance = new Date(targetDate).getTime() - now;
 
     if (isNaN(distance)) return { invalid: true };
     if (distance <= 0) return { expired: true };
 
     const days = Math.floor(distance / (1000 * 60 * 60 * 24));
     const hours = Math.floor(
       (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
     );
     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
     const seconds = Math.floor((distance % (1000 * 60)) / 1000);
     return { days, hours, minutes, seconds };
   };
 
   useEffect(() => {
     setTimeLeft(calculateTimeLeft());
     const countdown = setInterval(() => {
       setTimeLeft(calculateTimeLeft());
     }, 1000);
     return () => clearInterval(countdown);
   }, [targetDate]);
 
   if (timeLeft.invalid)
     return <h2 className="text-red-600 font-bold text-md">Invalid Date</h2>;
 
   if (timeLeft.expired)
     return <h2 className="text-red-600 font-bold text-md">Expired</h2>;
 
   if (!("days" in timeLeft))
     return <h2 className="text-md font-semibold">Loading...</h2>;
 
   const format = (n) => String(n).padStart(2, "0");
 
   return (
     <div className="flex gap-2 text-md font-bold text-primary">
       <span>{format(timeLeft.days)}d</span>
       <span>{format(timeLeft.hours)}h</span>
       <span>{format(timeLeft.minutes)}m</span>
       <span>{format(timeLeft.seconds)}s</span>
     </div>
   );
 }

export default CountdownTimer