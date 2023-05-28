import React from 'react';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from '@mui/material/styles';
let theme = createTheme({
  components: {
    Header: {
      backgroundColor: '#202020',
      textColor: '#FFFFFF',
    },
    Grid: {
      backgroundColor: '#181818',
      textColor: '#FFFFFF',
    },
    Chips: {
      deselectColor: '#FFFFFF',
      deselectBackgroundColor: '#202020',
      selectColor: '#586069',
      selectBackgroundColor: '#FFFFFF',
    },
    Dialog: {
      backgroundColor: '#383838',
    },
    Video: {
      primaryColor: '#FFFFFF',
      secondaryColor: '#C2C2C2',
      chipUp:'#4CA3FC',
      chipDown:'#2F2F2F'
    },
    Card: {
      primary: '#FFFFFF',
      secondary:'#D1D5DA'
    },

    Search: {
      backgroundColor: '#121212',
      borderColor: '#444D56',
      textColor: '#FFFFFF',
    },
    Button:{
      uploadbackgroundColor:'#EE1520',  
      cancelTextColor:'#FFFFFF'
    },
  },
});
ReactDOM.render(
  
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
      <SnackbarProvider
            maxSnack={1}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            preventDuplicate
          >
            <App />
          </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
