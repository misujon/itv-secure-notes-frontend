"use client";

import { Check, Tag } from "lucide-react";
import { useGetInterestsQuery } from "@/store/api/authApi";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

export function InterestSelector({
  value,
  onChange,
  disabled = false,
}: InterestSelectorProps) {
  const { data: interests = [], isLoading } = useGetInterestsQuery();

  const availableNames = interests.map((item) => item.name);
  const extraSelected = value.filter((item) => !availableNames.includes(item));
  const allOptions = [...availableNames, ...extraSelected];

  function toggleInterest(name: string) {
    if (disabled) {
      return;
    }

    if (value.includes(name)) {
      onChange(value.filter((item) => item !== name));
    } else if (value.length < 20) {
      onChange([...value, name]);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className="h-7 w-20 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>
    );
  }

  if (allOptions.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No interests configured yet.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
      {allOptions.map((name) => {
        const selected = value.includes(name);

        return (
          <button
            key={name}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => toggleInterest(name)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            {selected ? (
              <Check className="h-3 w-3" />
            ) : (
              <Tag className="h-3 w-3 text-muted-foreground" />
            )}
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
}
