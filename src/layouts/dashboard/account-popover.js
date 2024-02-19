import axios from "axios";
import { useContext } from "react";
import { UserContext } from "src/contexts/UserContext";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import Swal from "sweetalert2";

export const AccountPopover = (props) => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const { anchorEl, onClose, open } = props;

  const handleLogout = async () => {
    try {
      const action = await axios.post(`${process.env.NEXT_PUBLIC_BACK_END}/logout`);
      if (action) {
        localStorage.removeItem("token");
        setUser(null);
        Swal.fire({
          title: "Logout successfully!",
          text: "Sad to see you going.",
          icon: "success",
        });
        setTimeout(() => {
          router.push(`${process.env.NEXT_PUBLIC_MAIN_WEB}`);
        }, 1000);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Try again.",
      });
      console.error("Logout error:", error);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {user ? user.name : "NO NAME"}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            style={{ width: "16px", marginRight: "10px" }}
          >
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
          <span style={{ fontWeight: "600" }}>Log out</span>
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
