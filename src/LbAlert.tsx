import React, { FunctionComponent } from 'react';
import { Alert } from 'react-bootstrap';

export const LbAlert: FunctionComponent<Partial<{
    isVisible: boolean;
    onClose: () => void;
    title: string;
    message: string;
}>> = ({ isVisible = false, onClose, title, message }) => {

    return isVisible ? (
        <Alert variant="danger" dismissible
            onClose={() => { if (onClose) { onClose(); } }}>
            <Alert.Heading>{title}</Alert.Heading>
            <p>{message}</p>
        </Alert>
    ) : (
            <span />
        );
}
