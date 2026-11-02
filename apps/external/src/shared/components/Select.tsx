import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Icon from "./Icon";
import styles from "./Select.module.css";

export type SelectOption = { value: string; label: string; disabled?: boolean };

type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  style?: CSSProperties;
};

export default function Select({ options, value, defaultValue = "", onChange, placeholder = "Selecione uma opção", name, label, disabled = false, required = false, invalid = false, describedBy, style }: SelectProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef({ text: "", at: 0 });
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState<CSSProperties>({});
  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex(option => option.value === selectedValue);
  const selected = options[selectedIndex];

  function close() {
    if (listRef.current?.matches(":popover-open")) listRef.current.hidePopover();
    setIsOpen(false);
  }

  function open(index?: number) {
    const trigger = triggerRef.current;
    if (disabled || !trigger || !options.some(option => !option.disabled)) return;
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const upwards = below < 200 && above > below;
    const width = Math.min(rect.width, window.innerWidth - 16);
    setPosition({
      width,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      top: upwards ? undefined : rect.bottom + 6,
      bottom: upwards ? window.innerHeight - rect.top + 6 : undefined,
      maxHeight: Math.max(60, Math.min(260, upwards ? above : below)),
    });
    setActiveIndex(index ?? (selectedIndex >= 0 && !selected?.disabled ? selectedIndex : options.findIndex(option => !option.disabled)));
    listRef.current?.showPopover();
    setIsOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled || disabled) return;
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option.value);
    close();
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;
    const dismiss = (event: Event) => {
      if (event.type === "scroll" && event.target instanceof Node && listRef.current?.contains(event.target)) return;
      if (listRef.current?.matches(":popover-open")) listRef.current.hidePopover();
    };
    window.addEventListener("resize", dismiss);
    document.addEventListener("scroll", dismiss, true);
    return () => {
      window.removeEventListener("resize", dismiss);
      document.removeEventListener("scroll", dismiss, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
    if (!enabled.length) return;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const offset = event.key === "ArrowUp" ? -1 : 1;
      let index = enabled[(enabled.indexOf(activeIndex) + offset + enabled.length) % enabled.length];
      if (event.key === "Home") index = enabled[0];
      if (event.key === "End") index = enabled[enabled.length - 1];
      if (!isOpen) open(event.key === "Home" || event.key === "End" ? index : undefined);
      else setActiveIndex(index);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) choose(activeIndex);
      else open();
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      close();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text = (now - searchRef.current.at < 700 ? searchRef.current.text : "") + event.key;
      searchRef.current = { text, at: now };
      const normalize = (input: string) => input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
      const index = options.findIndex(option => !option.disabled && normalize(option.label).startsWith(normalize(text)));
      if (index >= 0) {
        if (!isOpen) open(index);
        else setActiveIndex(index);
      }
    }
  }

  return (
    <div className={styles.root} style={style}>
      {name && <input type="hidden" name={name} value={selectedValue} disabled={disabled} />}
      <button ref={triggerRef} type="button" className={styles.trigger} role="combobox" data-select-name={name}
        aria-label={label} aria-expanded={isOpen} aria-controls={`${id}-options`} aria-haspopup="listbox"
        aria-activedescendant={isOpen && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
        aria-required={required} aria-invalid={invalid} aria-describedby={describedBy} disabled={disabled}
        onClick={() => isOpen ? close() : open()} onKeyDown={handleKeyDown}>
        <span className={!selected ? styles.placeholder : undefined}>{selected?.label ?? placeholder}</span>
        <svg className={isOpen ? styles.chevronOpen : styles.chevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <div ref={listRef} id={`${id}-options`} role="listbox" aria-label={label} popover="auto" className={styles.options} style={position}
        onToggle={event => setIsOpen(event.currentTarget.matches(":popover-open"))}>
        {options.map((option, index) => (
          <div key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === selectedValue}
            aria-disabled={option.disabled || undefined} data-index={index} data-active={index === activeIndex || undefined}
            className={styles.option} onPointerMove={() => { if (!option.disabled) setActiveIndex(index); }}
            onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>
            <span>{option.label}</span>
            {option.value === selectedValue && <Icon name="check" size={15} />}
          </div>
        ))}
      </div>
    </div>
  );
}
