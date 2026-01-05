"use client";
import clsx from "clsx";
import { useState, useRef } from "react";

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

  const increase = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (valueQuantity < 999) {
      setValueQuantity((prev) => {
        const newVal = valueQuantity + 1;
        onUpdate(newVal);
        return newVal;
      });
    }
  };
  const reduce = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (valueQuantity > 1) {
      setValueQuantity((prev) => {
        const newVal = valueQuantity - 1;
        onUpdate(newVal);
        return newVal;
      });
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
        onClick={(e) => reduce(e)}
      >
        -
      </button>
      <input
        type="text"
        className="quantity-number text-center outline-none select-none text-inherit"
        value={valueQuantity}
        readOnly
        ref={quantityInpRef}
      />
      <button onClick={(e) => increase(e)} className="flex-center text-xl">
        +
      </button>
    </div>
  );
}

// increase
// reduce
