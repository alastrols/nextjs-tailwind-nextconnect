import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Collapse, ListItem, Stack } from "@mui/material";
import Link from "next/link";
import { Layers, BarChart, Person } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import { useRouter } from "next/router";
import PersonIcon from "@mui/icons-material/Person";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import Image from "next/image";
import { useSelector } from "react-redux";
const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type MenuProps = {
  open: boolean;
  onDrawerClose: () => void;
};

export default function Menu({ open, onDrawerClose }: MenuProps) {
  const theme = useTheme();
  const router = useRouter();
  const userSelector = useSelector((store: any) => store.admin);
  const [userOpen, setUserOpen] = React.useState<boolean>(false);
  const [newsOpen, setNewsOpen] = React.useState<boolean>(false);
  const [bannerOpen, setBannerOpen] = React.useState<boolean>(false);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Stack direction="row" alignItems="center">
          <Image
            width={200}
            height={68}
            unoptimized={true}
            alt="logo"
            src={"/static/images/logo.png"}
          />
          <IconButton onClick={onDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Stack>
      </DrawerHeader>
      <Divider />

      <List>
        <Link
          href="/admin/user"
          style={{ textDecoration: "none", color: "#000000DE" }}
          passHref
        >
          <ListItem
            button
            onClick={() => setUserOpen(!userOpen)}
            className={
              router.pathname === "/admin/user"
                ? "Mui-selected"
                : router.pathname === "/admin/user/edit"
                ? "Mui-selected"
                : router.pathname === "/admin/user/add"
                ? "Mui-selected"
                : ""
            }
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="User" />
          </ListItem>
        </Link>
      </List>

      <List>
        <Link
          href="/admin/banner"
          style={{ textDecoration: "none", color: "#000000DE" }}
          passHref
        >
          <ListItem
            onClick={() => setBannerOpen(!bannerOpen)}
            className={
              router.pathname === "/admin/banner"
                ? "Mui-selected"
                : router.pathname === "/admin/banner/edit"
                ? "Mui-selected"
                : router.pathname === "/admin/banner/add"
                ? "Mui-selected"
                : ""
            }
          >
            <ListItemIcon>
              <PhotoSizeSelectActualIcon />
            </ListItemIcon>
            <ListItemText primary="Banner" />
          </ListItem>
        </Link>
      </List>

      <List>
        <Link
          href="/admin/news"
          style={{ textDecoration: "none", color: "#000000DE" }}
          passHref
        >
          <ListItem
            onClick={() => setNewsOpen(!newsOpen)}
            className={
              router.pathname === "/admin/news"
                ? "Mui-selected"
                : router.pathname === "/admin/news/edit"
                ? "Mui-selected"
                : router.pathname === "/admin/news/add"
                ? "Mui-selected"
                : ""
            }
          >
            <ListItemIcon>
              <NewspaperIcon />
            </ListItemIcon>
            <ListItemText primary="News" />
          </ListItem>
        </Link>
      </List>

      <List>
        <Link
          href="/admin/contact"
          style={{ textDecoration: "none", color: "#000000DE" }}
          passHref
        >
          <ListItem
            button
            onClick={() => setUserOpen(!userOpen)}
            className={
              router.pathname === "/admin/contact" ? "Mui-selected" : ""
            }
          >
            <ListItemIcon>
              <ContactMailIcon />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
}
