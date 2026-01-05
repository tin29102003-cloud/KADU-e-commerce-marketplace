"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import clsx from "clsx";

function valuetext(value: number) {
  return `${value}đ`;
}

export default function RangeSlider({
  min,
  max,
  getAriaLabel = "Phạm vi giá tiền",
  classNameBox,
  defaultPosThumb,
  step = 10000,
  onChange,
}: {
  min?: number;
  max?: number;
  getAriaLabel?: string;
  classNameBox?: string;
  defaultPosThumb: { min: number; max: number };
  onChange?: (value: number[]) => void;
  step?: number;
}) {
  const [value, setValue] = useState<number[]>([
    defaultPosThumb.min,
    defaultPosThumb.max,
  ]);

  useEffect(() => {
    setValue([defaultPosThumb.min, defaultPosThumb.max]);
  }, [defaultPosThumb.min, defaultPosThumb.max]);

  const handleChange = (event: Event, newValue: number[]) => {
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Box className={clsx("slider--range", classNameBox)}>
      <Slider
        getAriaLabel={() => getAriaLabel}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="off"
        getAriaValueText={valuetext}
        min={min}
        max={max}
        step={step}
      />
    </Box>
  );
}
