import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import Toast from "components/Toast";
import {
  ArrowBackRounded,
  DeleteOutlineRounded,
  EditRounded,
  LocationOnRounded,
  AddRounded,
  StarRounded,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { setAddresses } from "state";
import { useAppDispatch, RootState } from "store";
import { useSelector } from "react-redux";
import AddAddress from "components/AddAddress";
import EditAddress from "components/EditAddress";
import { brand } from "../../theme";

interface AddressData {
  _id: string;
  contactName: string;
  phoneNumber: string;
  user: string;
  isDefault: boolean;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  id: string;
  token: string;
}

const AddressCard = ({
  each,
  confirm,
  onEdit,
  onDelete,
  onMakeDefault,
  onConfirm,
  onCancelConfirm,
  isDark,
  borderColor,
}: {
  each: AddressData;
  confirm: string;
  onEdit: () => void;
  onDelete: () => void;
  onMakeDefault: () => void;
  onConfirm: () => void;
  onCancelConfirm: () => void;
  isDark: boolean;
  borderColor: string;
}) => {
  const isDefault = each.isDefault;

  return (
    <Box
      sx={{
        borderRadius: "14px",
        border: `1px solid ${isDefault ? brand.primary + "50" : borderColor}`,
        backgroundColor: isDark ? "#09090D" : "#FFFFFF",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease",
        boxShadow: isDefault
          ? `0 4px 16px ${brand.primary}18`
          : isDark
          ? "0 2px 8px rgba(0,0,0,0.35)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        "&:hover": {
          boxShadow: isDark
            ? "0 6px 20px rgba(0,0,0,0.5)"
            : "0 6px 20px rgba(0,0,0,0.10)",
        },
      }}
    >
      {/* Card header */}
      <Box
        sx={{
          px: "16px",
          py: "12px",
          borderBottom: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: isDefault
            ? isDark
              ? `${brand.primary}10`
              : `${brand.primary}08`
            : "transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LocationOnRounded
            sx={{ fontSize: "16px", color: isDefault ? brand.primary : "text.disabled" }}
          />
          <Typography
            fontFamily="Nunito"
            fontWeight={700}
            fontSize="0.92rem"
            sx={{ textTransform: "capitalize" }}
          >
            {each.contactName}
          </Typography>
        </Box>
        {isDefault && (
          <Chip
            icon={<StarRounded sx={{ fontSize: "12px !important" }} />}
            label="Default"
            size="small"
            sx={{
              bgcolor: `${brand.primary}18`,
              color: brand.primary,
              fontFamily: "Nunito",
              fontWeight: 700,
              fontSize: "0.68rem",
              height: "22px",
              "& .MuiChip-icon": { color: brand.primary },
            }}
          />
        )}
      </Box>

      {/* Address body */}
      <Box sx={{ px: "16px", py: "14px", flex: 1 }}>
        <Typography
          fontFamily="Nunito"
          fontSize="0.87rem"
          color="text.secondary"
          lineHeight={1.7}
        >
          {each.address}
          <br />
          {each.city}, {each.state}
          <br />
          {each.country}
        </Typography>
        <Typography
          fontFamily="Nunito"
          fontSize="0.82rem"
          color="text.disabled"
          mt="6px"
        >
          {each.phoneNumber}
        </Typography>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          px: "12px",
          py: "8px",
          borderTop: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!isDefault ? (
          <Button
            size="small"
            onClick={onMakeDefault}
            sx={{
              fontFamily: "Nunito",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: brand.secondary,
              px: "10px",
            }}
          >
            Set as Default
          </Button>
        ) : (
          <Box />
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {confirm !== each._id ? (
            <>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={onEdit}>
                  <EditRounded sx={{ fontSize: "17px", color: brand.primary }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={onConfirm}>
                  <DeleteOutlineRounded sx={{ fontSize: "17px", color: brand.primary }} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Typography
                fontFamily="Nunito"
                fontSize="0.78rem"
                fontWeight={600}
                color="text.secondary"
                fontStyle="italic"
              >
                Delete?
              </Typography>
              <Button
                size="small"
                variant="contained"
                onClick={onDelete}
                sx={{
                  bgcolor: "#EF4444",
                  "&:hover": { bgcolor: "#DC2626" },
                  fontFamily: "Nunito",
                  fontSize: "0.72rem",
                  px: "10px",
                  py: "3px",
                  minWidth: 0,
                }}
              >
                Yes
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={onCancelConfirm}
                sx={{
                  fontFamily: "Nunito",
                  fontSize: "0.72rem",
                  px: "10px",
                  py: "3px",
                  minWidth: 0,
                  borderColor: "divider",
                  color: "text.secondary",
                }}
              >
                No
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const AddressBook = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderColor = isDark ? "#27272E" : "#EBEBEB";
  const isSmallScreen = useMediaQuery("(max-width:500px)");
  const { pathname } = useLocation();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState<AddressData[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });
  const showToast = (message: string, severity: "success" | "error") => setToast({ open: true, message, severity });
  const [confirm, setConfirm] = useState("");
  const addressList = useSelector((state: RootState) => state.global.addresses);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const prevPage = useSelector((state: RootState) => state.global.prevPage);
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  ) as UserData | null;

  useEffect(() => {
    getAddresses();
  }, [pathname]);

  const getAddresses = async () => {
    try {
      const response = await fetch(`${baseUrl}/get/addresses`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const jsonData = await response.json();
      setData(jsonData);
    } catch {
      /* silent */
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/edit/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        showToast("Address deleted successfully.", "success");
        getAddresses();
      }
    } catch {
      /* silent */
    }
  };

  const makeDefault = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/edit/addresses/set-default/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (response.ok) {
        showToast("Default address updated.", "success");
        getAddresses();
      }
    } catch {
      /* silent */
    }
  };

  const isListView = pathname === "/customer/addresses";
  const isAddView = pathname === "/customer/addresses/add";
  const isEditView = pathname === "/customer/addresses/edit";

  const defaultAddresses = data.filter((a) => a.isDefault);
  const otherAddresses = data.filter((a) => !a.isDefault);

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
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {(isAddView || isEditView) && (
            <Link to={prevPage || "/customer/addresses"}>
              <IconButton size="small">
                <ArrowBackRounded sx={{ fontSize: "20px" }} />
              </IconButton>
            </Link>
          )}
          <Box>
            <Typography fontFamily="Playfair Display" fontWeight={900} fontSize="1.3rem">
              {isListView
                ? "Address Book"
                : isAddView
                ? "Add Address"
                : "Edit Address"}
            </Typography>
            {isListView && (
              <Typography fontFamily="Nunito" fontSize="0.78rem" color="text.secondary">
                Manage your saved delivery addresses
              </Typography>
            )}
          </Box>
        </Box>
        {isListView && (
          <Link to="/customer/addresses/add">
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              size="small"
              sx={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "0.8rem", px: "16px" }}
            >
              {isSmallScreen ? "Add" : "Add Address"}
            </Button>
          </Link>
        )}
      </Box>

      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((t) => ({ ...t, open: false }))} />

      {/* Content */}
      {isListView ? (
        <Box sx={{ p: { xs: "16px", md: "24px" } }}>
          {data.length === 0 ? (
            <Box sx={{ textAlign: "center", py: "48px" }}>
              <LocationOnRounded
                sx={{ fontSize: "40px", color: "text.disabled", mb: "10px" }}
              />
              <Typography fontFamily="Nunito" fontWeight={700} fontSize="0.95rem" mb="4px">
                No saved addresses
              </Typography>
              <Typography
                fontFamily="Nunito"
                fontSize="0.82rem"
                color="text.secondary"
                mb="18px"
              >
                Add your first delivery address to get started.
              </Typography>
              <Link to="/customer/addresses/add">
                <Button
                  variant="contained"
                  startIcon={<AddRounded />}
                  sx={{ fontFamily: "Nunito", fontWeight: 700 }}
                >
                  Add Address
                </Button>
              </Link>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isSmallScreen ? "1fr" : "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              {[...defaultAddresses, ...otherAddresses].map((each) => (
                <AddressCard
                  key={each._id}
                  each={each}
                  confirm={confirm}
                  isDark={isDark}
                  borderColor={borderColor}
                  onEdit={() => {
                    dispatch(setAddresses([each]));
                    navigate("/customer/addresses/edit");
                  }}
                  onDelete={() => {
                    deleteAddress(each._id);
                    setConfirm("");
                  }}
                  onMakeDefault={() => makeDefault(each._id)}
                  onConfirm={() => setConfirm(each._id)}
                  onCancelConfirm={() => setConfirm("")}
                />
              ))}
            </Box>
          )}
        </Box>
      ) : isAddView ? (
        <AddAddress />
      ) : (
        <EditAddress />
      )}
    </Box>
  );
};

export default AddressBook;
