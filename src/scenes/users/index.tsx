import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  CloseRounded,
  PeopleRounded,
  SearchRounded,
} from "@mui/icons-material";
import { brand } from "../../theme";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  active?: boolean;
  id: string;
  token: string;
  _id: string;
}

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  admin: { bg: `${brand.primary}18`, color: brand.primary },
  user: { bg: "#6B728018", color: "#6B7280" },
};

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const Users = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isSmall = useMediaQuery("(max-width:680px)");

  const storedUser: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [data, setData] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  const getAllUsers = async () => {
    try {
      const res = await fetch(`${baseUrl}/get/users`, {
        headers: { Authorization: `Bearer ${storedUser?.token}` },
      });
      const json = await res.json();
      setData(json.users ?? json);
      setTotal(json.total ?? json.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleToggleActive = async (userId: string) => {
    setToggling(userId);
    try {
      const res = await fetch(`${baseUrl}/edit/users/${userId}/active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${storedUser?.token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, active: json.active } : u
          )
        );
      }
    } catch {
      /* silent */
    } finally {
      setToggling(null);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const filtered = query.trim()
    ? data.filter((u) => {
        const q = query.toLowerCase();
        return (
          u.firstName?.toLowerCase().includes(q) ||
          u.lastName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phoneNumber?.includes(q)
        );
      })
    : data;

  const cols = isSmall
    ? { display: "flex", flexDirection: "column" as const, gap: "6px" }
    : {
        display: "grid",
        gridTemplateColumns: "2fr 2.5fr 1.4fr 0.7fr 0.9fr",
        alignItems: "center",
      };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          px: { xs: "16px", md: "24px" },
          py: "13px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            fontFamily="Playfair Display"
            fontWeight={900}
            fontSize="1.3rem"
          >
            Manage Users
          </Typography>
          <Typography
            fontFamily="Nunito"
            fontSize="0.78rem"
            color="text.secondary"
          >
            {total} user{total !== 1 ? "s" : ""}
            {query && filtered.length !== data.length
              ? ` · ${filtered.length} match${filtered.length !== 1 ? "es" : ""}`
              : ""}
          </Typography>
        </Box>
        <PeopleRounded sx={{ fontSize: "22px", color: "text.disabled" }} />
      </Box>

      {/* Search bar */}
      <Box
        sx={{
          px: { xs: "16px", md: "24px" },
          py: "12px",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            px: "12px",
            py: "8px",
            borderRadius: "10px",
            border: `1px solid ${borderColor}`,
            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
            maxWidth: "340px",
          }}
        >
          <SearchRounded sx={{ fontSize: "17px", color: "text.disabled" }} />
          <InputBase
            placeholder="Search by name, email, phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ fontFamily: "Nunito", fontSize: "0.85rem", flex: 1 }}
          />
          {query && (
            <IconButton size="small" sx={{ p: "2px" }} onClick={() => setQuery("")}>
              <CloseRounded sx={{ fontSize: "13px" }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: "16px", md: "24px" } }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: "60px" }}>
            <PeopleRounded
              sx={{ fontSize: "48px", color: "text.disabled", mb: "12px" }}
            />
            <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem" mb="4px">
              {query ? `No users matching "${query}"` : "No users found"}
            </Typography>
            <Typography fontFamily="Nunito" fontSize="0.82rem" color="text.secondary">
              {query ? "Try a different search term." : "Registered users will appear here."}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              borderRadius: "14px",
              border: `1px solid ${borderColor}`,
              overflow: "hidden",
            }}
          >
            {/* Column headers */}
            {!isSmall && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2.5fr 1.4fr 0.7fr 0.9fr",
                  px: "16px",
                  py: "10px",
                  backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                {["Name", "Email", "Phone", "Role", "Status"].map((col) => (
                  <Typography
                    key={col}
                    fontFamily="Nunito"
                    fontWeight={700}
                    fontSize="0.72rem"
                    color="text.disabled"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    {col}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Rows */}
            {filtered.map((user, i) => {
              const isActive = user.active !== false;
              const roleStyle = ROLE_STYLE[user.role] ?? ROLE_STYLE.user;
              const isTogglingThis = toggling === user._id;

              return (
                <Box
                  key={user._id}
                  sx={{
                    px: "16px",
                    py: "12px",
                    borderBottom:
                      i < filtered.length - 1
                        ? `1px solid ${borderColor}`
                        : "none",
                    opacity: isActive ? 1 : 0.5,
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.02)"
                        : "#FAFAFA",
                    },
                    transition: "background 0.15s, opacity 0.2s",
                    ...cols,
                  }}
                >
                  {/* Avatar + Name */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Box
                      sx={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        backgroundColor: isActive
                          ? `${brand.primary}18`
                          : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#E5E7EB",
                        color: isActive ? brand.primary : "text.disabled",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                      }}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </Box>
                    <Typography fontFamily="Nunito" fontWeight={600} fontSize="0.875rem">
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Box>

                  {/* Email */}
                  <Typography
                    fontFamily="Nunito"
                    fontSize="0.83rem"
                    color="text.secondary"
                    sx={{ wordBreak: "break-all" }}
                  >
                    {isSmall && (
                      <Box component="span" sx={{ fontWeight: 700, color: "text.primary", mr: "4px" }}>
                        Email:
                      </Box>
                    )}
                    {user.email}
                  </Typography>

                  {/* Phone */}
                  <Typography fontFamily="Nunito" fontSize="0.83rem" color="text.secondary">
                    {isSmall && (
                      <Box component="span" sx={{ fontWeight: 700, color: "text.primary", mr: "4px" }}>
                        Phone:
                      </Box>
                    )}
                    {user.phoneNumber || "—"}
                  </Typography>

                  {/* Role */}
                  <Box>
                    <Chip
                      label={
                        user.role
                          ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                          : "User"
                      }
                      size="small"
                      sx={{
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.color,
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                      }}
                    />
                  </Box>

                  {/* Deactivate / Activate */}
                  <Box>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={isTogglingThis}
                      onClick={() => handleToggleActive(user._id)}
                      sx={{
                        fontFamily: "Nunito",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        borderRadius: "8px",
                        px: "10px",
                        py: "3px",
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        borderColor: isActive ? "#EF4444" : "#10B981",
                        color: isActive ? "#EF4444" : "#10B981",
                        "&:hover": {
                          borderColor: isActive ? "#DC2626" : "#059669",
                          backgroundColor: isActive
                            ? "rgba(239,68,68,0.06)"
                            : "rgba(16,185,129,0.06)",
                          color: isActive ? "#DC2626" : "#059669",
                        },
                      }}
                    >
                      {isTogglingThis
                        ? "…"
                        : isActive
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Users;
