import { IconButton } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { NoteView, NothingSelectedView } from '../views';
import { SystemLayout } from '../layout/SystemLayout';

export const SystemPage = () => {
  return (
    <SystemLayout>
      
      {/* <Typography>Sint id officia amet velit do aliqua aliqua est ea velit minim voluptate duis laboris. Esse esse consectetur ullamco excepteur ullamco amet. Mollit est nostrud nisi irure magna dolor eiusmod aliquip aliqua nostrud incididunt enim. Velit ipsum laborum Lorem anim laboris aute ullamco ipsum do adipisicing irure.</Typography> */}

      <NothingSelectedView />
      {/* <NoteView /> */}


      <IconButton
        size='large'
        sx={{
          color: 'white',
          backgroundColor: 'error.main',
          ':hover': { backgroundColor: 'error.main', opacity: 0.9 },
          position: 'fixed',
          right: 50,
          bottom: 50
        }}
      >
        <AddOutlined sx={{ fontSize: 30 }} />
      </IconButton>

    </SystemLayout>
  )
}