import { Tooltip } from "@mui/material";
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
//import InfoIcon from '@mui/icons-material/Info';

// export default function InfoElement({content}){
//   return (
//     <Tooltip title={content}>
//       <InfoOutlineIcon fontSize="small">
//       </InfoOutlineIcon>
//     </Tooltip>
//   )
// }
export default function InfoElement({ content }) {
  return (
    <Tooltip
      title={content}
      slotProps={{
        tooltip: {
          sx: {
            fontSize: '0.9rem',
            fontFamily: 'Inter',
            fontWeight: 400,                      
            fontStyle: 'Italic', 
            color: 'white',
            bgcolor: '#8d8d8dff',
            p: 1.2,
            borderRadius: '8px',
            boxShadow: 2,
          },
        },
      }}
    >
      <InfoOutlineIcon
        sx={{
          color: '#6d6e6eff',
          fontSize: 20,
          verticalAlign: 'middle',
          cursor: 'pointer',
          '&:hover': {
            color: '#1d4ed8',
            transform: 'scale(1.1)',
            transition: '0.2s',
          },
        }}
      />
    </Tooltip>
  );
}