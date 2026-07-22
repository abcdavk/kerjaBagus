import { useEffect, useRef, useState } from "react";

type WidthType = "wrap" | "full";

type EditableCardProps = {
  initialBody: string;
  widthType?: WidthType
  maxLength?: number;
  onChange?: (value: string) => void;
};

export default function EditableCard({
  initialBody,
  widthType = "full",
  maxLength,
  onChange,
}: EditableCardProps) {
  const [body, setBody] = useState(initialBody);
  const [editing, setEditing] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [editing]);

  const autoResize = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (editing && textareaRef.current) {
      autoResize(textareaRef.current);
    }
  }, [editing]);

  const finishEdit = () => {
    setEditing(false);
    onChange?.(body);
  };

  return (
    <div>

      {editing ? (
        <textarea
          ref={textareaRef}
          value={body}
          maxLength={maxLength}
          onChange={(e) => {
            setBody(e.target.value);
            autoResize(e.target);
          }}
          onBlur={finishEdit}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditing(false);
            }
          }}
          rows={1}
          className={`resize-none overflow-hidden rounded border border-gray-800 px-2 py-1 outline-none ${
            widthType === "wrap" ? "w-fit" : "w-full"
          }`}
        />
      ) : (
        <div
          onClick={() => setEditing(true)}
          className="cursor-text min-h-6 w-full whitespace-pre-wrap break-words hover:border-gray-500 hover:border hover:px-2 hover:rounded w-fit"
        >
          {body || (
            <span className="text-gray-400 italic">
              Klik untuk mengisi...
            </span>
          )}
        </div>
      )}
    </div>
  );
}