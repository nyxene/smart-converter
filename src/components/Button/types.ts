import React from 'react';

export enum BUTTON_UI {
    primary = 'primary',
    secondary = 'secondary'
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    ui: BUTTON_UI;
    borderRadiusTopLeft?: string;
    borderRadiusTopRight?: string;
    borderRadiusBottomRight?: string;
    borderRadiusBottomLeft?: string;
}
