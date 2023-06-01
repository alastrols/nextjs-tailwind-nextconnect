import React from "react";
import SearchInput from "@/components/SearchInput";
import Image from "next/image";
import Logo from "@/public/static/images/logo.png";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/router";

const drawerWidth = 240;
const navItems = [
  { link: "/", component: "Our Story" },
  { link: "/", component: "Our Service" },
  { link: "/", component: "Our Experience" },
  { link: "/", component: "Blog & News" },
  { link: "/", component: "Contact Us" },
];

function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { pathname, asPath, query } = router;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Divider />
      <List>
        {navItems.map((item, index) => {
          return (
            <Link href={item.link} key={index}>
              <ListItem key={index}>{item.component}</ListItem>
            </Link>
          );
        })}
      </List>
    </Box>
  );

  return (
    <header id="back-to-top-anchor">
      <div className="container-fluid px-5">
        <div className="row">
          <Toolbar sx={{ py: 2 , alignItems: 'center' }} className="toolbar">
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <Image src={Logo} alt="ITP Asia" className="logo" width={221} />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
                alignItems: 'center',
              }}
            >
              <nav className="menu">
                <ul>
                  <li className="non-ac">
                    <a href="#">Our Story</a>
                    <ul className="submenu">
                      <li>
                        <Link href="/">Company Overview</Link>
                      </li>
                      <li>
                        <Link href="/">Our History</Link>
                      </li>
                      <li>
                        <Link href="/">Our Values</Link>
                      </li>
                      <li>
                        <Link href="/">Our Network</Link>
                      </li>
                    </ul>
                  </li>
                  <li className="non-ac">
                    <a href="#">Our Service</a>
                    <ul className="submenu">
                      <li>
                        <Link href="/">Digital Marketing</Link>
                      </li>
                      <li>
                        <Link href="/">Event & Activation</Link>
                      </li>
                      <li>
                        <Link href="/">Website & Application</Link>
                      </li>
                      <li>
                        <Link href="/">Graphic Design 2D & 3D</Link>
                      </li>
                      <li>
                        <Link href="/">Sales Promotion Tools</Link>
                      </li>
                      <li>
                        <Link href="/">Localization</Link>
                      </li>
                      <li>
                        <Link href="/">Printing Production & </Link>
                      </li>
                      <li>
                        <Link href="/">Logistics Management</Link>
                      </li>
                      <li>
                        <Link href="/">Training Tools</Link>
                      </li>
                      <li>
                        <Link href="/">E-Commerce</Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/">Our Experience</Link>
                  </li>
                  <li>
                    <Link href="/">Blog & News</Link>
                  </li>
                  <li className="menu-5">
                    <Link href="/">Contact Us</Link>
                  </li>
                </ul>
              </nav>
            </Box>

            <Box sx={{ flexGrow: 0 }}></Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Box className="mo-logo" sx={{ mr: 1, width: "40%" }}>
                <Link href="/en/">
                  <Image
                    src={Logo}
                    alt="ITP Asia"
                    className="logo"
                    width={100}
                  />
                </Link>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                  className="mb_menu"
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>

            <Box component="nav">
              <Drawer
                className="drawer"
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { sm: "block", md: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                  },
                  "& .MuiPaper-root": {
                    backgroundColor: "#001736",
                  },
                }}
              >
                {drawer}
              </Drawer>
            </Box>
          </Toolbar>
        </div>
      </div>
    </header>
  );
}

export default Header;
