import {useState} from 'react'

const useDialog = () => {

  const [showDialog, setShowDialog] = useState(false);

  const closeDialog = () => {
    setShowDialog(false);
  }
  const openDialog = () => {
    setShowDialog(true);
  }
  return {showDialog, closeDialog, openDialog};
}

export default useDialog;
