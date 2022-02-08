import StackItem from './item';
import Rating from '@mui/material/Rating';
import styled from '@emotion/styled';

function StackLevelList({ items }) {
  const StackWrapper = styled.div`
    margin: 10px 0px;
  `;

  const ItemWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    & .star {
      margin: 0px 10px 0px 0px;
    }
  `;

  return (
    <StackWrapper>
      {items.map((item, index) => {
        return (
          <ItemWrapper key={index}>
            <StackItem title={item.name}></StackItem>
            <Rating className="star" value={item.grade} max={3} readOnly />
          </ItemWrapper>
        );
      })}
    </StackWrapper>
  );
}

export default StackLevelList;
