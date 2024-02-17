import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/solid/ArrowTopRightOnSquareIcon";
import ChevronUpDownIcon from "@heroicons/react/24/solid/ChevronUpDownIcon";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { items } from "./config";
import { SideNavItem } from "./side-nav-item";
import { color, width } from "@mui/system";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* <Box
            component={NextLink}
            href="/"
            sx={{
              display: "inline-flex",
              justifyContent: "center",
              height: 32,
              width: "100%",
            }}
          >
            <img src="/assets/logos/confluence-footer.svg" alt="" />
            <Typography
              sx={{
                color: "white",
                fontSize: "25px",
                fontWeight: "bold",
                marginLeft: "20px",
              }}
            >
              Confluence
            </Typography>
          </Box> */}
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRadius: 1,
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              mt: 2,
              p: "12px",
            }}
          >
            {/* <Typography
                color="inherit"
                fontSize="20px"
                variant="subtitle1"
              >
                Confluence
              </Typography>
              <Typography
                // color="neutral.400"
                fontSize="20px"
                fontWeight="600"
                variant="body2"
              >
                Dashboard
              </Typography> */}
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "5px",
                height: 32,
                width: "100%",
              }}
            >
              <img
                src="/assets/logos/confluence-footer.svg"
                alt=""
                style={{ width: "25px", height: "25px" }}
              />
              <Typography
                sx={{
                  color: "white",
                  fontSize: "30px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Confluence
              </Typography>
            </Box>
            {/* <SvgIcon fontSize="small" sx={{ color: "neutral.500" }}>
              <ChevronUpDownIcon />
            </SvgIcon> */}
          </Box>
        </Box>
        <Divider sx={{ borderColor: "neutral.200" }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <Button
            component="a"
            endIcon={
              <SvgIcon fontSize="small">
                <ArrowTopRightOnSquareIcon />
              </SvgIcon>
            }
            fullWidth
            href={`${process.env.NEXT_PUBLIC_MAIN_WEB}`}
            sx={{ mt: 2, fontSize: "16px" }}
            target="_blank"
            variant="contained"
          >
            Confluence Website
          </Button>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
