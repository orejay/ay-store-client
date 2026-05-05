import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Collapse,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ExpandLessRounded,
  ExpandMoreRounded,
  MailOutlineRounded,
} from "@mui/icons-material";
import { brand } from "../../theme";

interface MessageData {
  _id: string;
  subject: string;
  body: string;
  createdAt: string;
}

interface StoredUser {
  token: string;
}

const Inbox = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const storedUser: StoredUser | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${baseUrl}/get/messages`, {
          headers: { Authorization: `Bearer ${storedUser?.token}` },
        });
        const json = await res.json();
        setMessages(json.messages ?? []);
      } catch {
        /* silent */
      }
    };
    fetch_();
  }, []);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <Box sx={{ p: { xs: "16px", md: "28px" } }}>
      {/* Header */}
      <Box
        sx={{
          pb: "20px",
          borderBottom: `1px solid ${borderColor}`,
          mb: "24px",
        }}
      >
        <Typography
          fontFamily="Playfair Display"
          fontWeight={900}
          fontSize="1.3rem"
        >
          Inbox
        </Typography>
        <Typography
          fontFamily="Nunito"
          fontSize="0.82rem"
          color="text.secondary"
          mt="2px"
        >
          {messages.length > 0
            ? `${messages.length} message${messages.length !== 1 ? "s" : ""} from the store`
            : "Messages and notifications from the store"}
        </Typography>
      </Box>

      {messages.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: "60px",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: `${brand.secondary}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: "20px",
            }}
          >
            <MailOutlineRounded
              sx={{ fontSize: "38px", color: brand.secondary }}
            />
          </Box>
          <Typography
            fontFamily="Playfair Display"
            fontWeight={700}
            fontSize="1.3rem"
            mb="10px"
          >
            No messages yet
          </Typography>
          <Typography
            fontFamily="Nunito"
            color="text.secondary"
            fontSize="0.9rem"
            sx={{ maxWidth: "340px" }}
          >
            When we have updates, promotions, or news for you, they'll appear
            right here. Stay tuned!
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            border: `1px solid ${borderColor}`,
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {messages.map((msg, i) => {
            const isOpen = expandedId === msg._id;
            return (
              <Box key={msg._id}>
                <Box
                  onClick={() => setExpandedId(isOpen ? null : msg._id)}
                  sx={{
                    px: "16px",
                    py: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    borderBottom:
                      isOpen || i < messages.length - 1
                        ? `1px solid ${borderColor}`
                        : "none",
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.02)"
                        : "#FAFAFA",
                    },
                    transition: "background 0.15s",
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: `${brand.secondary}14`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <MailOutlineRounded
                      sx={{ fontSize: "18px", color: brand.secondary }}
                    />
                  </Box>

                  {/* Text */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      fontFamily="Nunito"
                      fontWeight={700}
                      fontSize="0.875rem"
                      noWrap
                    >
                      {msg.subject}
                    </Typography>
                    {!isOpen && (
                      <Typography
                        fontFamily="Nunito"
                        fontSize="0.78rem"
                        color="text.secondary"
                        noWrap
                      >
                        {msg.body}
                      </Typography>
                    )}
                  </Box>

                  {/* Date + chevron */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexShrink: 0,
                    }}
                  >
                    <Chip
                      label={fmt(msg.createdAt)}
                      size="small"
                      sx={{
                        fontFamily: "Nunito",
                        fontSize: "0.72rem",
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#F3F4F6",
                        color: "text.secondary",
                      }}
                    />
                    {isOpen ? (
                      <ExpandLessRounded
                        sx={{ fontSize: "18px", color: "text.disabled" }}
                      />
                    ) : (
                      <ExpandMoreRounded
                        sx={{ fontSize: "18px", color: "text.disabled" }}
                      />
                    )}
                  </Box>
                </Box>

                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      px: "16px",
                      py: "16px",
                      pl: "64px",
                      borderBottom:
                        i < messages.length - 1
                          ? `1px solid ${borderColor}`
                          : "none",
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.01)"
                        : "#FAFAFA",
                    }}
                  >
                    <Typography
                      fontFamily="Nunito"
                      fontSize="0.9rem"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                    >
                      {msg.body}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Inbox;
