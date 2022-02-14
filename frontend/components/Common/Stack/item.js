import Chip from '@mui/material/Chip';
import styled from '@emotion/styled';
import StackColor from '../../../data/StackColor.json';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';

export default function item(props) {
  let color = StackColor[props.title];

  const StackChip = styled(Chip)`
    margin-right: 10px;
    margin-bottom: 5px;
    background-color: #${color};
    border: 1px solid white;
    width: fit-content;
  `;

  return props.type == 'email' ? (
    <StackChip
      icon={<EmailOutlinedIcon style={{ marginLeft: '10px' }} />}
      label={props.title}
    />
  ) : props.type == 'link' ? (
    <StackChip
      onClick={() => {
        document.location.href = props.title;
      }}
      icon={<LinkOutlinedIcon style={{ marginLeft: '10px' }} />}
      label={props.title}
    />
  ) : (
    <StackChip label={props.title} />
  );
}
