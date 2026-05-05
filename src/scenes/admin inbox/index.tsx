import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CampaignRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  SendRounded,
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

const AdminInbox = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";

  const storedUser: StoredUser | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = async () => {
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

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setFeedback(null);
    try {
      const res = await fetch(`${baseUrl}/post/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser?.token}`,
        },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      });
      if (res.ok) {
        setSubject("");
        setBody("");
        setFeedback({ text: "Message broadcast to all users.", ok: true });
        fetchMessages();
      } else {
        const json = await res.json();
        setFeedback({ text: json.message ?? "Failed to send.", ok: false });
      }
    } catch {
      setFeedback({ text: "Network error.", ok: false });
    } finally {
      setSending(false);
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
            Broadcast Messages
          </Typography>
          <Typography
            fontFamily="Nunito"
            fontSize="0.78rem"
            color="text.secondary"
          >
            Send announcements to all users
          </Typography>
        </Box>
        <CampaignRounded sx={{ fontSize: "22px", color: "text.disabled" }} />
      </Box>

      <Box
        sx={{
          p: { xs: "16px", md: "24px" },
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Compose card */}
        <Box
          sx={{
            border: `1px solid ${borderColor}`,
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: "16px",
              py: "12px",
              borderBottom: `1px solid ${borderColor}`,
              backgroundColor: isDark ? "#0C0C10" : "#FAFAFA",
            }}
          >
            <Typography
              fontFamily="Nunito"
              fontWeight={700}
              fontSize="0.82rem"
              color="text.secondary"
              sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              New Broadcast
            </Typography>
          </Box>

          <Box
            sx={{
              p: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              size="small"
              inputProps={{ style: { fontFamily: "Nunito", fontSize: "0.9rem" } }}
              InputLabelProps={{ style: { fontFamily: "Nunito" } }}
            />
            <TextField
              label="Message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              fullWidth
              multiline
              rows={4}
              inputProps={{ style: { fontFamily: "Nunito", fontSize: "0.9rem" } }}
              InputLabelProps={{ style: { fontFamily: "Nunito" } }}
            />

            {feedback && (
              <Typography
                fontFamily="Nunito"
                fontSize="0.82rem"
                color={feedback.ok ? "#10B981" : "#EF4444"}
              >
                {feedback.text}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="small"
                disabled={sending || !subject.trim() || !body.trim()}
                onClick={handleSend}
                startIcon={<SendRounded sx={{ fontSize: "16px" }} />}
                sx={{
                  fontFamily: "Nunito",
                  fontWeight: 700,
                  borderRadius: "10px",
                  px: "20px",
                }}
              >
                {sending ? "Sending…" : "Send to All Users"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Sent messages */}
        {messages.length > 0 && (
          <Box>
            <Typography
              fontFamily="Nunito"
              fontWeight={700}
              fontSize="0.72rem"
              color="text.disabled"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: "10px",
              }}
            >
              Sent ({messages.length})
            </Typography>
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
                      onClick={() =>
                        setExpandedId(isOpen ? null : msg._id)
                      }
                      sx={{
                        px: "16px",
                        py: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          ml: "12px",
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
                          py: "14px",
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
                          fontSize="0.88rem"
                          color="text.secondary"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {msg.body}
                        </Typography>
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminInbox;
