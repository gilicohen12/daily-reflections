import { useLayoutEffect, useRef } from "react";

// A text area that grows with its content, so writing feels open-ended
// rather than boxed into a fixed field.
export function AutoTextarea(props: {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  // Fit to content after every render. Running unconditionally (rather than
  // only when the value changes) means the height self-corrects once fonts and
  // styles have finished applying, avoiding a stale first measurement.
  useLayoutEffect(resize);

  return (
    <textarea
      ref={ref}
      id={props.id}
      className="answer"
      value={props.value}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
      rows={1}
    />
  );
}
