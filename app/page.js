"use client";
import { Box, Typography, SpeedDial, SpeedDialAction, SpeedDialIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import React, { useState } from 'react';

const actions = [
  { icon: <SupportAgentIcon />, name: 'Customer Support' },
];

export default function Home() {
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);


  const [choices, setChoices] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi, I am the support AI' }
  ]);
  const [message, setMessage] = useState('');

  const handleSpeedDialOpen = () => setSpeedDialOpen(true);
  const handleSpeedDialClose = () => setSpeedDialOpen(false);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleSendMessage = async () => {
    // Add user's message to the chat
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: message }
    ]);

    // Clear the input field
    setMessage('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        someData: message,
      }),
    });
  
    if (response.ok) {
      const data = await response.json(); // Extract the JSON data
      // Add the assistant's response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: data }
      ]);
    } else {
      console.error("Failed to fetch data: ", response.statusText);
    }
  };
  
  

  return (
    <Box 
      width="100vw" 
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Typography variant="h1">This is AI Customer Support</Typography>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleSpeedDialClose}
        onOpen={handleSpeedDialOpen}
        open={speedDialOpen}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleDialogOpen} // Open the dialog on click
          />
        ))}
      </SpeedDial>

      {/* Chat Window Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Customer Support</DialogTitle>
        <DialogContent>
          <Box 
            display="flex"
            flexDirection="column"
            height="400px"
            overflow="auto"
          >
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={msg.content}
                    style={{
                      textAlign: msg.role === 'user' ? 'right' : 'left',
                      backgroundColor: msg.role === 'user' ? '#e1ffc7' : '#f1f1f1',
                      borderRadius: '10px',
                      padding: '8px',
                      marginBottom: '8px',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Type your message..."
            type="text"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendMessage} color="primary">
            Send
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
