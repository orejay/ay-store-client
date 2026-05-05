import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { brand } from "../theme";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const getPages = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++)
    pages.push(p);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
};

const Pagination = ({ page, totalPages, onChange }: Props) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const pages = getPages(page, totalPages);

  if (totalPages <= 1) return null;

  const btnBase = {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Nunito",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.15s",
    border: `1px solid ${isDark ? "#27272E" : "#EBEBEB"}`,
    userSelect: "none" as const,
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", mt: "40px", mb: "8px" }}>
      {/* Prev */}
      <IconButton
        size="small"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        sx={{
          ...btnBase,
          color: page === 1 ? "text.disabled" : "text.primary",
          "&:hover:not(:disabled)": {
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
          },
        }}
      >
        <ChevronLeftRounded sx={{ fontSize: "20px" }} />
      </IconButton>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "…" ? (
          <Typography
            key={`ellipsis-${i}`}
            fontFamily="Nunito"
            fontSize="0.85rem"
            color="text.disabled"
            sx={{ width: "36px", textAlign: "center" }}
          >
            …
          </Typography>
        ) : (
          <Box
            key={p}
            onClick={() => onChange(p as number)}
            sx={{
              ...btnBase,
              backgroundColor: p === page ? brand.primary : "transparent",
              color: p === page ? "#fff" : theme.palette.text.primary,
              borderColor: p === page ? brand.primary : isDark ? "#27272E" : "#EBEBEB",
              "&:hover": p === page ? {} : {
                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
              },
            }}
          >
            {p}
          </Box>
        )
      )}

      {/* Next */}
      <IconButton
        size="small"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        sx={{
          ...btnBase,
          color: page === totalPages ? "text.disabled" : "text.primary",
          "&:hover:not(:disabled)": {
            backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
          },
        }}
      >
        <ChevronRightRounded sx={{ fontSize: "20px" }} />
      </IconButton>
    </Box>
  );
};

export default Pagination;
