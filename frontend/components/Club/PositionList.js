import styled from '@emotion/styled';
import Chip from '@mui/material/Chip';

export default function PositionList(props) {
  const StackChip = styled(Chip)`
    margin-left: 10px;
  `;
  let Item = {};

  props.positionData.map((data) => {
    // data.position: 포지션 이름 / data.size: 포지션 인원수

    if (data.position.includes('total')) {
      let name = data.position.split('total')[1];
      Item[`${name}`] = [0, data.size];
    }

    if (data.position.includes('current')) {
      let name = data.position.split('current')[1];
      Item[`${name}`][0] = data.size;
    }
  });

  return (
    <div>
      {Object.keys(Item).map((position, index) => {
        let size = Item[position];
        return position !== 'Size' && size[1] > 0 ? (
          <div key={index}>
            {position}
            <StackChip
              label={size[0] + ' / ' + size[1]}
              size="small"
            ></StackChip>
          </div>
        ) : null;
      })}
    </div>
  );
}
