import { createStyles } from "@mantine/core";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { FlexDiv } from "../FlexDiv";
import { HomeButton } from "./Home";
import { Nav } from "./Nav";
import { Profile } from "./Profile";

const useStyles = createStyles((theme) => ({
  outer: {
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : "white",
    zIndex: 2,
    boxShadow: theme.colorScheme === "light" ? "0 0.5rem 1rem rgba(0, 0, 0, 0.04)" : "",
  },
  inner: {
    boxSizing: "border-box",
    flexShrink: 0,
    margin: "0 auto",
    padding: "0 0.7rem",
    maxWidth: "1200px",

    [theme.fn.largerThan("sm")]: {
      padding: "0 25px",
    },
  },
  content: {
    height: "3.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",

    [theme.fn.largerThan("sm")]: {
      height: "5rem",
      gap: "1rem",
    },
  },
}));

export const Menubar = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.outer}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <FlexDiv justifyBetween fullWidth>
            <FlexDiv gap05>
              <Nav />
              <HomeButton />
            </FlexDiv>

            <FlexDiv gap05>
              <ColorSchemeToggle />
              <Profile />
            </FlexDiv>
          </FlexDiv>
        </div>
      </div>
    </div>
  );
};