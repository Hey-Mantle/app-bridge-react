import "react";

/**
 * Type definitions for Mantle App Bridge web components
 * These augment React's JSX namespace to provide TypeScript support
 * for the custom web components used in Mantle extensions.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ui-modal": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        title?: string;
        size?: "small" | "medium" | "large" | "fullscreen";
        open?: boolean;
        onClose?: () => void;
      };
      "ui-title-bar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        title?: string;
        subtitle?: string;
        backAction?: string | (() => void);
      };
      "ui-save-bar": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        message?: string;
        visible?: boolean;
      };
      "ui-nav-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

