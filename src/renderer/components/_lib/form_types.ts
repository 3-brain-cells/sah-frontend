export type ValidationStyleProps = {
    invalid?: boolean;
};

export type AbstractInputProps<T extends string | number> = ValidationStyleProps & {
    value?: T;
    setValue?: (value: T | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
};

// todo: validation off of regex
