export const formatDate = (value?: string | Date | null) => {
  if (!value) {
    return "N/A";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString();
};

export const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString();
};

