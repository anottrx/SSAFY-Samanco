import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
  border: '0.5px solid white',
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: 'black',
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: 'white',
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}));

export default function ButtonBases({ image }) {
  /*
        image
        {
            url,
            title,
            width
        },
    */

  return (
    <ImageButton
      focusRipple
      key={image.title}
      style={{
        width: image.width,
      }}
      onClick={() => {
        document.location.href = image.link;
      }}
    >
      <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
      <ImageBackdrop className="MuiImageBackdrop-root" />
      <Image>
        <Typography
          component="span"
          variant="subtitle1"
          color="inherit"
          sx={{
            position: 'relative',
            p: 4,
            pt: 2,
            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
          }}
          style={{
            fontSize: 20,
            fontWeight: 'bolder',
            color: 'white',
            WebkitTextStroke: '0.8px rgb(0 0 0 / 45%)',
          }}
        >
          {image.title}
          <ImageMarked className="MuiImageMarked-root" />
        </Typography>
      </Image>
    </ImageButton>
  );
}
