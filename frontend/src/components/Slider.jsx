import React, { useState, useEffect } from 'react';

export default function Slider({ slides = [] }){
  const [idx, setIdx] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=> setIdx(i=> (i+1) % slides.length), 4000);
    return ()=>clearInterval(t);
  },[slides.length]);
  return (
    <div className="slider card slide-in">
      <div className="slides" style={{ transform: `translateX(-${idx*100}%)` }}>
        {slides.map((s,i)=> (
          <div className={`slide slide-${(i%3)+1}`} key={i}>{s}</div>
        ))}
      </div>
      <div className="slider-controls">
        {slides.map((_,i)=> <div key={i} className="control" onClick={()=>setIdx(i)}>{i+1}</div>)}
      </div>
    </div>
  );
}
