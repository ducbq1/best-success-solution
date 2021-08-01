import { DataTable } from "@shopify/polaris";
import React, { useState, useEffect } from "react";

export default function Table({ rows }) {
  return (
    <DataTable
      columnContentTypes={["text", "text"]}
      headings={["Title", "Modified Price"]}
      rows={rows}
    />
  );
}
