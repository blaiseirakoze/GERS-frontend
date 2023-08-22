import { Card, Box, styled, IconButton, Icon } from "@mui/material";

const CardRoot = styled(Card)({
  height: "100%",
  padding: "20px 24px",
});

const CardTitle = styled("div")(({ subtitle }) => ({
  fontSize: "1.5rem",
  fontWeight: "500",
  textTransform: "capitalize",
  marginBottom: !subtitle && "16px",
}));

const SimpleCard = ({ children, title, subtitle, show, setShow }) => {
  return (
    <CardRoot elevation={6}>
      <div className=" d-flex align-items-center ">
        <CardTitle subtitle={subtitle}>{title}</CardTitle>

        <IconButton>
          {show ? (
            <Icon onClick={() => setShow(false)} title="more details">
              visibilityOff
            </Icon>
          ) : (
            <Icon onClick={() => setShow(true)} title="more details">
              visibility
            </Icon>
          )}
        </IconButton>
      </div>
      {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
      {children}
    </CardRoot>
  );
};

export default SimpleCard;
