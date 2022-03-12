import { colors } from './colors';

// Excerpts from normalize.css designed to make Chrome's styles not terrible
const reset = `
    html {
        line-height: 1.15;
    }

    body {
        margin: 0;
        overflow: hidden;
    }

    pre {
        font-family: monospace, monospace;
        font-size: 1em;
    }

    abbr[title] {
        text-decoration: underline;
        text-decoration: underline dotted;
    }

    b,
    strong {
        font-weight: bolder;
    }

    code,
    kbd,
    samp {
        font-family: monospace, monospace;
        font-size: 1em;
    }

    small {
        font-size: 80%;
    }

    sub,
    sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
    }

    sub {
        bottom: -0.25em;
    }

    sup {
        top: -0.5em;
    }

    button,
    input,
    optgroup,
    select,
    textarea {
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
    }


    fieldset {
        padding: 0.35em 0.75em 0.625em;
    }

    progress {
        vertical-align: baseline;
    }

    [type="number"]::-webkit-inner-spin-button,
    [type="number"]::-webkit-outer-spin-button {
        height: auto;
    }

    [type="search"] {
        -webkit-appearance: textfield;
    }
`;

export const globalStyles = `
    ${reset}

    body {
        font-family: 'Roboto', sans-serif;
        color: ${colors.foreground};
        box-sizing: border-box;

        * {
            box-sizing: inherit;
        }

        *::-webkit-scrollbar {
            width: 12px;
        }

        *::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 6px;
            border: 4px solid rgba(0,0,0,0);
            background-clip: content-box;
            min-width: 32px;
            min-height: 32px;
        }
    }
`;
