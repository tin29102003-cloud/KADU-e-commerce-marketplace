"use client";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

export default function QuantityBox({
  className,
  onUpdate,
  defaultValue = 1,
}: {
  className?: string;
  onUpdate: (quantity: number) => void;
  defaultValue?: number;
}) {
  const [valueQuantity, setValueQuantity] = useState<number>(defaultValue);
  const quantityInpRef = useRef<HTMLInputElement | null>(null);

  const increase = () => {
    if (valueQuantity < 999) {
      const newValue = valueQuantity + 1;
      setValueQuantity(newValue);
      onUpdate(newValue);
    }
  };
  const reduce = () => {
    if (valueQuantity > 1) {
      const newValue = valueQuantity - 1;
      setValueQuantity(newValue);
      onUpdate(newValue);
    }
  };

  return (
    <div
      className={clsx(
        "quantity-box w-[140px] h-[48px] grid grid-cols-3 overflow-hidden rounded-lg border border-neutral-300 bg-white",
        className
      )}
    >
      <button
        className="flex-center text-gray-400 text-xl"
        onClick={(e) => reduce()}
      >
        -
      </button>
      <input
        type="text"
        className="quantity-number text-center text-sm outline-none select-none text-inherit"
        value={valueQuantity}
        readOnly
        ref={quantityInpRef}
      />
      <button onClick={(e) => increase()} className="flex-center text-xl">
        +
      </button>
    </div>
  );
}
