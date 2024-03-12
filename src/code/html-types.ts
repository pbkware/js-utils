// (c) 2024 Xilytix Pty Ltd

/** @public */
export namespace HtmlTypes {
    export const enum Tags {
        Display = 'display',
    }

    export const enum Visibility {
        Hidden = 'hidden',
        Visible = 'visible',
    }

    export const enum Display {
        None = 'none',
        Block = 'block',
        Flex = 'flex',
    }

    export const enum Opacity {
        Opaque = '1',
        SemiTransparent = '0.5',
        Transparent = '0',
    }

    export const enum Width {
        Auto = 'auto',
        MaxContent = 'max-content',
        MinContent = 'min-content',
    }

    export const enum Height {
        Auto = 'auto',
        MaxContent = 'max-content',
        MinContent = 'min-content',
    }

    export const enum FontWeight {
        Bold = 'bold',
    }

    export const enum BorderStyle {
        Hidden = 'hidden',
        Solid = 'solid',
    }

    export const transparentColor = 'transparent';
}
