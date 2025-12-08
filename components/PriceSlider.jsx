import { useState, useEffect } from 'react';
import "../styles/priceSlider.css";

export default function PriceRangeSlider({ 
  min = 0, 
  max = 1000000, 
  step = 5000,
  valueMin: externalMin,
  valueMax: externalMax,
  onChangeMin,
  onChangeMax
}) {
  const [minVal, setMinVal] = useState(externalMin || min);
  const [maxVal, setMaxVal] = useState(externalMax || max);

  useEffect(() => {
    if (externalMin !== undefined) setMinVal(externalMin);
  }, [externalMin]);

  useEffect(() => {
    if (externalMax !== undefined) setMaxVal(externalMax);
  }, [externalMax]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(value);
    onChangeMin?.(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(value);
    onChangeMax?.(value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="price-slider-container">
      
    <h3 className='price-title'>Precio: </h3>
      <div className="price-slider-values">
        <span className="price-slider-value">{formatPrice(minVal)}</span>
        <span className="price-slider-separator">-</span>
        <span className="price-slider-value">{formatPrice(maxVal)}</span>
      </div>

      <div className="price-slider-wrapper">

        <div className="price-slider-track"></div>

        <div
          className="price-slider-active-track"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        ></div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="price-slider-input"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="price-slider-input price-slider-max"
        />
      </div>
    </div>
  );
}
