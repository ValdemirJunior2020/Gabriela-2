import React, { useState } from "react";
import { Button, Pagination } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function SearchTable({ data, headers, search }) {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentData = data.slice(start, end);

  const highlightMatch = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text?.toString().replace(regex, "<mark>$1</mark>"),
        }}
      />
    );
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Google Sheet Export", 14, 16);
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 20,
    });
    doc.save("sheet-export.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "sheet-export.xlsx");
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" className="me-2" onClick={exportPDF}>
          📄 Export PDF
        </Button>
        <Button variant="primary" onClick={exportExcel}>
          📊 Export Excel
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow">
          <thead className="table-dark">
            <tr>
              {headers.map((title, i) => (
                <th key={i}>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, idx) => (
              <tr key={idx}>
                {row.map((cell, i) => (
                  <td key={i}>{highlightMatch(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </>
  );
}
