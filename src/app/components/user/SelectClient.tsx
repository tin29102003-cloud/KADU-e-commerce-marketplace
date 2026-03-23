"use client";
import Select from "react-select";
import clsx from "clsx";

export default function SelectClient({
  options,
  className,
  placeholder,
  defaultOption,
  onChange,
  isDisabled,
}: {
  options: { value?: string; label?: string }[];
  className?: string;
  placeholder?: string;
  defaultOption?: { value?: string; label?: string };
  onChange?: (value: { value?: string; label?: string } | null) => void;
  isDisabled?: boolean;
}) {
  return (
    <Select
      className={className}
      options={options}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultOption}
      isDisabled={isDisabled}
    />
  );
}
