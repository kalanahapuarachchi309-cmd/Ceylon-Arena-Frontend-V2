import type { ChangeEvent } from "react";

interface FileUploadFieldProps {
  id: string;
  accept?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const FileUploadField = ({ id, accept, onChange, className }: FileUploadFieldProps) => (
  <input id={id} name={id} type="file" accept={accept} onChange={onChange} className={className} />
);

export default FileUploadField;
