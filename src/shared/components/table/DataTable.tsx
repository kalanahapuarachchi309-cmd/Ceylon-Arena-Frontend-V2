import type { ReactNode } from "react";

interface DataTableProps {
  headers: ReactNode[];
  children: ReactNode;
  className?: string;
}

const DataTable = ({ headers, children, className }: DataTableProps) => (
  <table className={className}>
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

export default DataTable;
