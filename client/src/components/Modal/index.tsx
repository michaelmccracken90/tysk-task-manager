import React, { useEffect, useCallback } from "react";

import "./style.scss";

// TODO: Add new property called `name` to pass to onCloseModal
interface ModalProps {
    children?: React.ReactNode;
    className?: string;
    hidden: boolean;
    style?: React.CSSProperties;
    /**
     * Called when clicked in everything outside the modal.
     *
     * @memberof ModalProps
     */
    onCloseModal?: () => void;
    display?: string
}

const Modal: React.FC<ModalProps> = ({
    children,
    hidden,
    style,
    className = "",
    display = "block",
    onCloseModal = () => {},
}: ModalProps) => {
    const hasParentByClass = (
        target: HTMLElement,
        className: string
    ): HTMLElement | null => {
        let currentElement: HTMLElement | null = target;
        while (
            currentElement !== null &&
            !currentElement.classList.contains(className)
        ) {
            currentElement = currentElement.parentElement;
        }
        return currentElement;
    };

    const onclick = useCallback(
        (e: React.MouseEvent) => {
            !hasParentByClass(e.target as HTMLElement, "Modal") &&
                onCloseModal();
        },
        [onCloseModal]
    ) as () => {};

    useEffect(() => {
        if (hidden) {
            document.removeEventListener("click", onclick);
        } else {
            document.addEventListener("click", onclick);
        }
    }, [hidden, onclick, onCloseModal]);

    return (
        <div
            className={`Modal ${className}`}
            style={{ ...style, display: !hidden ? display : "none" }}
        >
            {children}
        </div>
    );
};

export default Modal;
