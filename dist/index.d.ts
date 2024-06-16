type ThemeFunction = (path: string | string[], defaultValue?: string) => string;

type ClassColor = {
    prefix: string;
    color: string;
    shade?: string;
    opacity?: string;
};

declare const getReverseColor: ({ selector, classColor, theme }: {
    selector: string;
    classColor: ClassColor;
    theme: ThemeFunction;
}) => string;
declare const bicolor: ({ variantName, getColor }?: {
    variantName?: string | undefined;
    getColor?: (({ selector, classColor, theme }: {
        selector: string;
        classColor: ClassColor;
        theme: ThemeFunction;
    }) => string) | undefined;
}) => any;

export { bicolor, bicolor as default, getReverseColor };
