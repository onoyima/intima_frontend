declare module 'react-paystack' {
    export interface PaystackButtonProps {
        text?: string;
        className?: string;
        children?: React.ReactNode;
        onSuccess?: (reference: any) => void;
        onClose?: () => void;
        reference: string;
        email: string;
        amount: number;
        publicKey: string;
        [key: string]: any;
    }
    // eslint-disable-next-line
    export const PaystackButton: React.ComponentType<PaystackButtonProps>;
}
