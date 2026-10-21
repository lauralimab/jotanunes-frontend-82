import {
  useRef,
  useState,
  type DragEvent,
} from "react";

import Icon from "../../../../shared/components/Icon";

export type SelectedFile = {
  file: File;
  name: string;
  size: string;
};

type DocumentoUploadAreaProps = {
  file: SelectedFile | null;

  onFileChange: (
    file: SelectedFile | null,
  ) => void;
};

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

export default function DocumentoUploadArea({
  file,
  onFileChange,
}: DocumentoUploadAreaProps) {
  const [
    dragging,
    setDragging,
  ] = useState(false);

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  function handleSelectedFile(
    selectedFile: File,
  ) {
    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      alert(
        "O arquivo excede o tamanho máximo de 10 MB.",
      );

      return;
    }

    onFileChange({
      file: selectedFile,
      name: selectedFile.name,

      size: `${(
        selectedFile.size /
        1024 /
        1024
      ).toFixed(2)} MB`,
    });
  }

  function handleDrop(
    event:
      DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setDragging(false);

    const selectedFile =
      event.dataTransfer.files[0];

    if (!selectedFile) {
      return;
    }

    handleSelectedFile(
      selectedFile,
    );
  }

  return (
    <>
      <div
        className={`drag-zone${
          dragging
            ? " active"
            : ""
        }`}
        onDragOver={(event) => {
          event.preventDefault();

          setDragging(true);
        }}
        onDragLeave={() =>
          setDragging(false)
        }
        onDrop={handleDrop}
        onClick={() =>
          inputRef.current?.click()
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{
            display: "none",
          }}
          onChange={(event) => {
            const selectedFile =
              event.target.files?.[0];

            if (!selectedFile) {
              return;
            }

            handleSelectedFile(
              selectedFile,
            );
          }}
        />

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#fde8ea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <Icon
            name="upload"
            size={24}
            color="#c01a2b"
          />
        </div>

        <p
          style={{
            margin: "0 0 4px",
            fontSize: 14,
            fontWeight: 600,
            color: "#0f172a",
          }}
        >
          Arraste o arquivo aqui
          ou clique para selecionar
        </p>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          Formatos aceitos: PDF,
          JPG, JPEG e PNG — máximo
          10 MB
        </p>
      </div>

      {file && (
        <div
          style={{
            marginTop: 14,
            padding: "12px 16px",
            background: "#fef2f2",
            border:
              "1px solid #fecaca",
            borderRadius: 8,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Icon
              name="doc"
              size={18}
              color="#c01a2b"
            />

            <div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                {file.name}
              </div>

              <div
                style={{
                  fontSize: 11.5,
                  color: "#6b7280",
                }}
              >
                {file.size}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={(event) => {
              event.stopPropagation();

              onFileChange(null);
            }}
          >
            <Icon
              name="x"
              size={14}
            />
          </button>
        </div>
      )}
    </>
  );
}