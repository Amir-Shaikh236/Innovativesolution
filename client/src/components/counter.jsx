import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const Counter = ({ to, duration = 1.5, shouldStart=false }) => {
  const [count, setCount] = useState(0);
 

  useEffect(() => {
    if(!shouldStart) return;
    let animationId;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      const newCount = Math.floor(progress * to);
      
      setCount(newCount);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [shouldStart, to, duration]);

  return <span>{count}</span>;
};

const CounterCard = ({ number, label, symbol = "" }) => {
  const elementRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  // Extract numeric value from number (e.g., "100+" -> 100, "70%" -> 70)
  const numericValue = parseInt(number.replace(/\D/g, ""), 10);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
        }
        else{
            setIsVisible(false);
        }
      },
      { threshold: 0.5 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={elementRef}
      className="group bg-emerald-100 text-gray-800  to-transparent border border-[#40E0D0]/30 p-6 rounded-xl text-center hover:border-[#40E0D0]/70 transition hover:shadow-lg hover:shadow-[#40E0D0]/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-10%" }}
    >
      <span className="block text-5xl font-bold text-teal-800 mb-3">
        <Counter to={numericValue} duration={1.5} shouldStart={isVisible} />
        {symbol}
      </span>
      <p className="text-black text-sm">{label}</p>
    </motion.div>
  );
};

export default CounterCard;
