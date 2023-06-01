import React from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: "#EBEBEB",
  "&:hover": {
    backgroundColor: "##EBEBEB",
  },
  marginLeft: 0,
  width: "100%",
  height: "40px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "0",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function SearchInput() {
  return (
    <div>
      {/* <Search className='searchinput'>
        <SearchIconWrapper>
          <SearchIcon sx={{color:'#001736',fontWeight: 'bold'}}/>
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
        />
      </Search> */}
    </div>
  );
}

export default SearchInput;
