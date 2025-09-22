import { Tooltip } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
//import InfoIcon from '@mui/icons-material/Info';

export default function InfoElement({content}){
  return (
    <Tooltip title={content}>
      <InfoOutlineIcon fontSize="small">
      </InfoOutlineIcon>
    </Tooltip>
  )
}
