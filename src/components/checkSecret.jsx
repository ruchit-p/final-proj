import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CheckSecret({ post, action, isOpen, onClose }) {
  const [secretKey, setSecretKey] = useState('');

  const handleSecretKeyChange = (e) => {
    setSecretKey(e.target.value);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (secretKey === post.secretKey) {
      action();
    } else {
      alert('Incorrect secret key.');
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogTitle>Enter Secret Key</AlertDialogTitle>
        <AlertDialogDescription>
          Enter the secret key you set when creating the post to proceed.
        </AlertDialogDescription>
        <form onSubmit={handleConfirm}>
        <Input
          type="password"
          value={secretKey}
          onChange={handleSecretKeyChange}
          placeholder="Secret key"
        />
        </form>
        <AlertDialogFooter>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
